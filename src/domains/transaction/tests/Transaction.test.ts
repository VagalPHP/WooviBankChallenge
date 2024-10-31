// tests/transactionRepository.test.ts
import TransactionRepository from '../repositories/TransactionRepository';
import { ITransaction } from '../entities/Transaction';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import Account from '../../account/entities/Account';
import User from '../../user/entities/User';

describe('TransactionRepository', () => {
  let mongoServer: MongoMemoryServer;
  let transactionRepository: TransactionRepository;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
    transactionRepository = new TransactionRepository();
  });

  beforeEach(async () => {
    // Limpa o banco de dados antes de cada teste
    await mongoose.connection.dropDatabase();

    // Define os schemas para garantir que estejam disponíveis
    if (!mongoose.models.User) {
      mongoose.model(
        'User',
        new mongoose.Schema({
          name: { type: String, required: true },
          email: { type: String, required: true },
          password: { type: String, required: true },
        }),
      );
    }

    if (!mongoose.models.Transaction) {
      mongoose.model(
        'Transaction',
        new mongoose.Schema({
          amount: { type: Number, required: true },
          date: { type: Date, default: Date.now },
        }),
      );
    }

    if (!mongoose.models.Account) {
      mongoose.model(
        'Account',
        new mongoose.Schema({
          balance: { type: Number, required: true },
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
          },
          transactions: [
            { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' },
          ],
        }),
      );
    }
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    // Limpa as coleções após cada teste
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  });

  it('deve criar uma transação com sucesso', async () => {
    const user = await User.create({
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'password123',
    });

    const account = await Account.create({
      user: user._id,
      balance: 1000,
    });

    const transactionData = {
      amount: 200,
      account: account._id,
      status: 'in_progress',
    } as unknown as ITransaction;

    const createdTransaction =
      await transactionRepository.create(transactionData);

    expect(createdTransaction).toHaveProperty('_id');
    expect(createdTransaction.amount).toBe(transactionData.amount);
    expect(createdTransaction.account.toString()).toBe(
      transactionData.account.toString(),
    );
  });

  it('deve encontrar uma transação pelo ID', async () => {
    const user = await User.create({
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'password123',
    });

    const account = await Account.create({
      user: user._id,
      balance: 1000,
    });

    const transactionData = {
      amount: 300,
      account: account._id,
      status: 'in_progress',
    } as unknown as ITransaction;

    const createdTransaction =
      await transactionRepository.create(transactionData);
    const foundTransaction = await transactionRepository.findById(
      createdTransaction._id as string,
    );

    expect(foundTransaction).not.toBeNull();
    expect(foundTransaction?._id).toStrictEqual(createdTransaction._id);
  });

  it('deve atualizar o status de uma transação', async () => {
    const user = await User.create({
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'password123',
    });

    const account = await Account.create({
      user: user._id,
      balance: 1000,
    });

    const transactionData = {
      amount: 150,
      account: account._id,
      status: 'in_progress',
    } as unknown as ITransaction;

    const createdTransaction =
      await transactionRepository.create(transactionData);
    const updatedTransaction = await transactionRepository.update(
      createdTransaction._id as string,
      { status: 'completed' },
    );

    expect(updatedTransaction).not.toBeNull();
    expect(updatedTransaction?.status).toBe('completed');
  });
});
