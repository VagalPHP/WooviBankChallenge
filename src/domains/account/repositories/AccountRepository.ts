import Account, { IAccount } from '../entities/Account';
import mongoose, { Document, Model } from 'mongoose';

export default class AccountRepository {
  private model: Model<IAccount & Document>;

  constructor() {
    //@ts-ignore
    this.model = Account;
  }

  async create(accountData: Omit<IAccount, '_id'>): Promise<IAccount> {
    const account = new Account(accountData);
    return (await account.save()) as IAccount;
  }

  async findById(id: string): Promise<IAccount | null> {
    if (!mongoose.isValidObjectId(id)) {
      return null;
    }
    try {
      const objectId = new mongoose.Types.ObjectId(id);
      return Account.findById(objectId).populate('user transactions');
    } catch (error) {
      console.error('Error fetching account:', error);
      return null;
    }
  }

  async findAll(): Promise<IAccount[]> {
    try {
      return await Account.find().populate('user transactions');
    } catch (e) {
      console.log(e);
      return [];
    }
  }

  async updateBalance(
    id: string,
    newBalance: number,
  ): Promise<(IAccount & Document) | null> {
    try {
      if (!mongoose.isValidObjectId(id)) {
        return null;
      }
      const objectId = new mongoose.Types.ObjectId(id);
      return await this.model.findByIdAndUpdate(
        objectId,
        { balance: newBalance },
        { new: true },
      );
    } catch (error) {
      console.error('Erro ao atualizar saldo da conta:', error);
      return null;
    }
  }
}
