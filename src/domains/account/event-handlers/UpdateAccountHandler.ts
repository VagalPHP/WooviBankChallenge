import { IEventHandler } from '../../shared/EventBus/interfaces/EventInterfaces';
import TransactionEvents from '../../shared/events/transaction/enums/TransactionEvents';
import TransactionApprovedEvent from '../../shared/events/transaction/TransactionApprovedEvent';
import AccountService from '../services/AccountService';
import AccountRepository from '../repositories/AccountRepository';
import account from '../entities/Account';
import AccountTransactionService from '../services/AccountTransactionService';

export class UpdateAccountHandler
  implements IEventHandler<TransactionApprovedEvent>
{
  subscribedTo(): TransactionEvents {
    return TransactionEvents.TRANSACTION_APPROVED;
  }

  async handle(event: TransactionApprovedEvent): Promise<void> {
    const { accountNumber, amount, targetAccountNumber } = event;
    const accountService = new AccountService(new AccountRepository());
    const accountTransactionService = new AccountTransactionService(
      accountService,
      accountNumber,
      targetAccountNumber,
    );
    await accountTransactionService.processTransaction(amount);
  }
}
