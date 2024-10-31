import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import MongoDatabase from '../MongoDatabase';

describe('MongoDatabase', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    // Inicia o servidor MongoDB em memória
    mongoServer = await MongoMemoryServer.create();
    process.env.MONGO_CONNECTION = mongoServer.getUri();
  });

  afterAll(async () => {
    // Desconecta e para o servidor em memória
    await MongoDatabase.disconnectDB();
    await mongoServer.stop();
  });

  it('should connect to MongoDB', async () => {
    await expect(MongoDatabase.connectDB()).resolves.not.toThrow();
    // Você pode adicionar outras asserções, como verificar se o estado de mongoose está conectado
    expect(mongoose.connection.readyState).toBe(1); // 1 significa conectado
  });

  it('should disconnect from MongoDB', async () => {
    await MongoDatabase.connectDB(); // Primeiro, conecta ao banco
    await expect(MongoDatabase.disconnectDB()).resolves.not.toThrow();
    expect(mongoose.connection.readyState).toBe(0); // 0 significa desconectado
  });
});
