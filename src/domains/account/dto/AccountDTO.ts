import { IAccount } from '../entities/Account';

export interface IAccountArgs {
  accountNumber: number;
  balance: number;
  user: string;
  transactions?: string[];
}

export default class AccountDTO {
  accountNumber: number;
  balance: number;
  user: string;
  transactions: string[];

  constructor(accountArgs: IAccountArgs) {
    this.user = accountArgs.user;
    this.balance = accountArgs.balance ?? 0;
    this.transactions = accountArgs.transactions || [];
    this.accountNumber = accountArgs.accountNumber ?? '';
  }

  /** Returns needed data format for database */
  toAccount(): IAccount {
    return {
      accountNumber: this.accountNumber,
      balance: this.balance,
      user: this.user,
      transactions: this.transactions,
    } as unknown as IAccount;
  }

  /** Returns formatted data for API can show in frontend */
  toAPI(): IAccount {
    return {
      accountNumber: String(this.accountNumber).padStart(10, '0'),
      balance: this._formatBalanceToBRL(this.balance),
      user: this.user,
    } as unknown as IAccount;
  }

  private _formatBalanceToBRL(balance: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(balance);
  }
}
