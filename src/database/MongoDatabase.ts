import mongoose from 'mongoose';
import Migrations from './Migrations';

export default class MongoDatabase {
  static async connectDB(): Promise<void> {
    try {
      const mongoUri = process.env.MONGO_CONNECTION + '/woovi-bank';
      await mongoose.connect(mongoUri, { dbName: 'woovi-bank' });
      await Migrations.runMigrations();
    } catch (error) {
      console.error('MongoDB connection failed:', error);
      process.exit(1);
    }
  }

  static async disconnectDB(): Promise<void> {
    try {
      await mongoose.disconnect();
    } catch (error) {
      console.error('MongoDB disconnection failed:', error);
      process.exit(1);
    }
  }
}
