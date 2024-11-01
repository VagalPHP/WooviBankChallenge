import { IEvent } from '../../shared/EventBus/interfaces/EventInterfaces';
import TransactionEvents from '../enums/TransactionEvents';

export interface ITransactionApprovedEvent {
  transactionCode: string;
  accountNumber: string;
  targetAccountNumber: string;
  amount: number;
}

export default class TransactionApprovedEvent implements IEvent {
  public occurredOn: Date;
  public readonly transactionCode: string;
  public readonly accountNumber: string;
  public readonly targetAccountNumber: string;
  public readonly amount: number;

  constructor({
    transactionCode,
    accountNumber,
    targetAccountNumber,
    amount,
  }: {
    transactionCode: string;
    accountNumber: string;
    targetAccountNumber: string;
    amount: number;
  }) {
    this.transactionCode = transactionCode;
    this.accountNumber = accountNumber;
    this.targetAccountNumber = targetAccountNumber;
    this.amount = amount;
    this.occurredOn = new Date();
  }

  getOccurredOn(): Date {
    return this.occurredOn;
  }

  eventName(): TransactionEvents {
    return TransactionEvents.TRANSACTION_APPROVED;
  }
}
