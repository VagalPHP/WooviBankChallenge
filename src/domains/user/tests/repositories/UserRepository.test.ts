// userRepository.test.ts
import { MongoMemoryServer } from 'mongodb-memory-server';
import MongoDatabase from '../../../../database/MongoDatabase';
import { IUser } from '../../entities/User';
import UserRepository from '../../repositories/UserRepository';

describe('UserRepository', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    // Inicia o servidor MongoDB em memória
    mongoServer = await MongoMemoryServer.create();
    process.env.MONGO_CONNECTION = mongoServer.getUri();
    await MongoDatabase.connectDB(); // Conecta ao banco de dados
  });

  afterAll(async () => {
    await MongoDatabase.disconnectDB(); // Desconecta do banco de dados
    await mongoServer.stop(); // Para o servidor em memória
  });

  it('should create a new user', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      accounts: [],
    } as unknown as IUser;

    const createdUser = await UserRepository.create(userData);
    expect(createdUser).toHaveProperty('_id'); // Verifica se o usuário foi criado com um ID
    expect(createdUser.name).toBe(userData.name);
    expect(createdUser.email).toBe(userData.email);
  });

  it('should find a user by ID', async () => {
    const userData = {
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'password123',
      accounts: [],
    } as unknown as IUser;

    const createdUser = await UserRepository.create(userData);
    const foundUser = await UserRepository.findById(createdUser._id as string);
    expect(foundUser).toBeDefined();
    expect(foundUser?.name).toBe(userData.name);
    expect(foundUser?.email).toBe(userData.email);
  });

  it('should return null for a non-existing user', async () => {
    const foundUser = await UserRepository.findById('non-existing-id');
    expect(foundUser).toBeNull(); // Verifica se o retorno é null
  });
});
