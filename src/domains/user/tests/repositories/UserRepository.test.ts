// userRepository.test.ts
import { MongoMemoryServer } from 'mongodb-memory-server';
import MongoDatabase from '../../../../database/MongoDatabase';
import { IUser } from '../../schemas/User';
import UserRepository from '../../repositories/UserRepository';

describe('UserRepository', () => {
  let mongoServer: MongoMemoryServer;
  let userRepository: UserRepository;
  beforeAll(async () => {
    jest.setTimeout(60000);
    userRepository = new UserRepository();
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

    const createdUser = await userRepository.create(userData);
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

    const createdUser = await userRepository.create(userData);
    const foundUser = await userRepository.findById(createdUser._id as string);
    expect(foundUser).toBeDefined();
    expect(foundUser?.name).toBe(userData.name);
    expect(foundUser?.email).toBe(userData.email);
  });

  it('should return null for a non-existing user', async () => {
    const foundUser = await userRepository.findById('non-existing-id');
    expect(foundUser).toBeNull(); // Verifica se o retorno é null
  });

  it('deve atualizar um usuário com sucesso', async () => {
    // Cria um usuário inicial
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    } as IUser;

    const createdUser = await userRepository.create(userData);

    // Dados a serem atualizados
    const updateData = {
      email: 'john.updated@example.com',
      password: 'newPassword123',
    };

    // Atualiza o usuário
    const updatedUser = await userRepository.update(
      createdUser._id as string,
      updateData,
    );

    // Verifica se o usuário foi atualizado corretamente
    expect(updatedUser).not.toBeNull();
    expect(updatedUser?.email).toBe(updateData.email);
    expect(updatedUser?.password).toBe(updateData.password);
  });
});
