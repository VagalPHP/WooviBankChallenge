import mongoose from 'mongoose';
import User from '../domains/user/entities/User';
import Account from '../domains/account/entities/Account';
import Transaction from '../domains/transaction/entities/Transaction';

const collections = [
  { name: 'users', model: User },
  { name: 'accounts', model: Account },
  { name: 'transactions', model: Transaction },
];

export default class Migrations {
  static async runMigrations(): Promise<void> {
    try {
      for (const { name, model } of collections) {
        const exists = await mongoose.connection
          .collection(name)
          .countDocuments();
        if (exists === 0) {
          // @ts-ignore
          await model.create([]);
        }
      }
    } catch (error) {
      console.error('Error running migrations:', error);
    }
  }
}