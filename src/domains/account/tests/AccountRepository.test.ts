// tests/accountRepository.test.ts
import AccountRepository from '../repositories/AccountRepository';
import { accountSchema } from '../entities/Account';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import User, { userSchema } from '../../user/entities/User';
import { transactionSchema } from '../../transaction/entities/Transaction';
import AccountDTO from '../dto/AccountDTO';

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
      mongoose.model('User', userSchema);
    }

    if (!mongoose.models.Transaction) {
      mongoose.model('Transaction', transactionSchema);
    }

    if (!mongoose.models.Account) {
      mongoose.model('Account', accountSchema);
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
    const accountData = new AccountDTO({
      accountNumber: 12345678900000,
      user: '507f191e810c19729de860ea',
      balance: 1000,
      transactions: [],
    });

    const createdAccount = await accountRepository.create(
      accountData.toAccount(),
    );
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
    const accountData = new AccountDTO({
      accountNumber: 12345678900000,
      user: user._id as string,
      balance: 1000,
      transactions: [],
    });

    const createdAccount = await accountRepository.create(
      accountData.toAccount(),
    );
    const foundAccount = await accountRepository.findByAccountNumber(
      createdAccount.accountNumber.toString(),
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
    const accountData = new AccountDTO({
      accountNumber: 12345678900000,
      user: user._id as string,
      balance: 1000,
      transactions: [],
    });

    const createdAccount = await accountRepository.create(
      accountData.toAccount(),
    );
    const updatedAccount = await accountRepository.updateBalance(
      createdAccount.accountNumber.toString(),
      1500,
    );

    expect(updatedAccount).not.toBeNull();
    expect(updatedAccount?.balance).toBe(1500);
  });
});
