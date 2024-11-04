import { ITransaction, TransactionStatus } from '../schemas/Transaction';
import { ITransactionApprovedEvent } from '../../shared/events/transaction/TransactionApprovedEvent';

export interface ITransactionArgs {
  account: string;
  targetAccount: string;
  transactionCode: string;
  amount: number;
  status: TransactionStatus;
  updatedAt?: Date;
  accountNumber?: string;
  targetAccountNumber?: string;
}

export default class TransactionDTO implements ITransactionArgs {
  account: string;
  targetAccount: string;
  amount: number;
  status: TransactionStatus;
  updatedAt?: Date;
  accountNumber?: string;
  targetAccountNumber?: string;
  transactionCode: string;

  constructor(transactionArgs: ITransactionArgs) {
    this.account = transactionArgs.account;
    this.targetAccount = transactionArgs.targetAccount;
    this.transactionCode = transactionArgs.transactionCode ?? '';
    this.amount = transactionArgs.amount ?? 0;
    this.status = transactionArgs.status;
    this.updatedAt = transactionArgs.updatedAt;
    this.accountNumber = transactionArgs.accountNumber ?? '';
    this.targetAccountNumber = transactionArgs.targetAccountNumber ?? '';
  }

  static fromTransaction(transaction: ITransaction): TransactionDTO {
    return new TransactionDTO({
      account: transaction.account.id as string,
      targetAccount: transaction.targetAccount.id as string,
      amount: transaction.amount,
      transactionCode: transaction.transactionCode,
      status: transaction.status,
      updatedAt: transaction.updatedAt,
      accountNumber: transaction.account.accountNumber ?? '',
      targetAccountNumber: transaction.targetAccount.accountNumber ?? '',
    });
  }

  toApprovedEvent(): ITransactionApprovedEvent {
    return {
      accountNumber: this.accountNumber,
      targetAccountNumber: this.targetAccountNumber,
      amount: this.amount,
      transactionCode: this.transactionCode,
    } as unknown as ITransactionApprovedEvent;
  }

  toTransaction(): ITransaction {
    return {
      account: this.account,
      targetAccount: this.targetAccount,
      amount: this.amount,
      status: this.status,
      updatedAt: this.updatedAt,
    } as unknown as ITransaction;
  }
}
