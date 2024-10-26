// domain/transaction/events/TransactionApprovedEvent.ts

import { IDomainEvent } from '../../../shared/event-bus/IDomainEvent';

export default class TransactionApprovedEvent implements IDomainEvent {
  public ocurredOn: Date;

  constructor(
    public readonly transactionId: string,
    public readonly accountId: string,
    public readonly amount: number
  ) {
    this.ocurredOn = new Date();
  }

  occurredOn(): Date {
    return this.ocurredOn;
  }
}
