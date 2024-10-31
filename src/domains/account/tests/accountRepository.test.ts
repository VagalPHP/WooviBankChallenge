// tests/accountRepository.test.ts
import AccountRepository from '../repositories/AccountRepository';
import { IAccount } from '../entities/Account';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import User from '../../user/entities/User';

describe('AccountRepository', () => {
  let mongoServer: MongoMemoryServer;
  let accountRepository: AccountRepository;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
    accountRepository = new AccountRepository();
  });
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
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
  afterEach(async () => {
    // Limpa as coleções após cada teste
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  });

  it('deve criar uma conta com sucesso', async () => {
    const accountData = {
      user: '507f191e810c19729de860ea',
      balance: 1000,
      transactions: [],
    } as unknown as IAccount;

    const createdAccount = await accountRepository.create(accountData);
    expect(createdAccount).toHaveProperty('_id');
    expect(createdAccount.user.toHexString()).toBe(accountData.user);
    expect(createdAccount.balance).toBe(accountData.balance);
  });

  it('deve encontrar uma conta pelo ID', async () => {
    const user = await User.create({
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'password123',
    });
    const accountData = {
      user: user._id as string,
      balance: 1000,
      transactions: [],
    } as unknown as IAccount;

    const createdAccount = await accountRepository.create(accountData);
    const foundAccount = await accountRepository.findById(
      createdAccount._id as string,
    );

    expect(foundAccount).not.toBeNull();
    expect(foundAccount?._id).toStrictEqual(createdAccount._id);
  });

  it('deve atualizar o saldo de uma conta', async () => {
    const user = await User.create({
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'password123',
    });
    const accountData = {
      user: user._id as string,
      balance: 500,
    } as unknown as IAccount;

    const createdAccount = await accountRepository.create(accountData);
    const updatedAccount = await accountRepository.updateBalance(
      createdAccount._id as string,
      1500,
    );

    expect(updatedAccount).not.toBeNull();
    expect(updatedAccount?.balance).toBe(1500);
  });
});
