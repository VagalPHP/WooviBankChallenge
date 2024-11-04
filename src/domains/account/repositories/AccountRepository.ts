import Account, { IAccount } from '../schemas/Account';
import { Document, Model } from 'mongoose';

export default class AccountRepository {
  private model: Model<IAccount & Document>;

  constructor() {
    //@ts-ignore
    this.model = Account;
  }

  async create(accountData: IAccount): Promise<IAccount> {
    const account = new Account(accountData);
    return (await account.save()) as IAccount;
  }

  async findByUserId(userId: string): Promise<IAccount | null> {
    try {
      return await Account.findOne({ user: userId }).populate(
        'user transactions',
      );
    } catch (error) {
      console.error('Error fetching account:', error);
      return null;
    }
  }

  async findByAccountNumber(accountNumber: string): Promise<IAccount | null> {
    try {
      return await Account.findOne({ accountNumber: accountNumber }).populate(
        'user transactions',
      );
    } catch (error) {
      console.error('Error fetching account:', error);
      return null;
    }
  }

  async updateBalance(
    accountNumber: string,
    newBalance: number,
  ): Promise<(IAccount & Document) | null> {
    try {
      return await this.model.findOneAndUpdate(
        { accountNumber: accountNumber },
        { balance: newBalance },
        { new: true },
      );
    } catch (error) {
      console.error('Erro ao atualizar saldo da conta:', error);
      return null;
    }
  }
}
