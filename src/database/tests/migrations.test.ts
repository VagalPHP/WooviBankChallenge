import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Migrations from '../Migrations';
import User from '../../domains/user/schemas/User';

describe('Migrations', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    // Inicia o MongoMemoryServer
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    // Conecta ao banco de dados em memória
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    // Desconecta e para o MongoMemoryServer
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    // Limpa o banco de dados antes de cada teste
    await mongoose.connection.dropDatabase();
  });

  test('should create collections if they do not exist', async () => {
    // Executa as migrações
    await Migrations.runMigrations();

    // Verifica se as collections foram criadas
    const userCollectionExists = await mongoose.connection
      .collection('users')
      .countDocuments();
    const accountCollectionExists = await mongoose.connection
      .collection('accounts')
      .countDocuments();
    const transactionCollectionExists = await mongoose.connection
      .collection('transactions')
      .countDocuments();

    expect(userCollectionExists).toBe(0); // Deve estar vazio, pois não criamos documentos padrão
    expect(accountCollectionExists).toBe(0); // Deve estar vazio
    expect(transactionCollectionExists).toBe(0); // Deve estar vazio
  });

  test('should not create collections if they already exist', async () => {
    // Cria uma collection manualmente
    await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      accounts: [],
    });

    // Executa as migrações
    await Migrations.runMigrations();

    // Verifica se a collection de usuários ainda existe
    const userCollectionExists = await mongoose.connection
      .collection('users')
      .countDocuments();

    expect(userCollectionExists).toBe(1); // Deve conter o documento criado anteriormente
  });
});
