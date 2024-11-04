import TransactionRepository from '../repositories/TransactionRepository';
import { IAccount } from '../../account/schemas/Account';
import { ITransaction, TransactionStatus } from '../schemas/Transaction';
import TransactionDTO from '../dto/TransactionDTO';
import TransactionResponse from '../response/TransactionResponse';
import TransactionResCode from '../enums/TransactionResCode';
import EventEmitter from 'node:events';
import TransactionEvents from '../../shared/events/transaction/enums/TransactionEvents';

export default class TransactionService extends EventEmitter {
  constructor(private _transactionRepository: TransactionRepository) {
    super();
  }

  async validateTransaction(
    transactionCode: string,
  ): Promise<TransactionResponse> {
    const transaction = await this._transactionRepository.findByTransactionCode(
      transactionCode,
      true,
    );
    if (!transaction) {
      return new TransactionResponse({
        message: 'Transaction not found',
        code: TransactionResCode.NOT_FOUND,
        failed: true,
      });
    }
    if (transaction.status !== 'in_progress') {
      // Don't allow to update transaction if it's not in progress to avoid double spending
      return new TransactionResponse({
        message: 'Transaction is not in progress',
        code: TransactionResCode.NOT_IN_PROGRESS,
        failed: true,
      });
    }

    return new TransactionResponse();
  }

  async createTransaction(
    account: IAccount,
    targetAccount: IAccount,
    amount: number,
  ): Promise<ITransaction | null> {
    if (account.accountNumber === targetAccount.accountNumber) {
      return null;
    }
    let status: TransactionStatus = 'in_progress';
    if (account.balance < amount) {
      status = 'no_balance';
    }

    const transactionDTO = new TransactionDTO({
      transactionCode: this._generateTransactionCode(),
      account: account._id as string,
      targetAccount: targetAccount._id as string,
      amount: amount,
      status: status,
    });
    return await this._transactionRepository.create(
      transactionDTO.toTransaction(),
    );
  }

  async approveTransaction(
    transactionCode: string,
  ): Promise<ITransaction | null> {
    const transaction = await this._transactionRepository.findByTransactionCode(
      transactionCode,
      true,
    );
    if (!transaction) {
      return null;
    }
    transaction.status = 'completed';
    const updateResult = await this._transactionRepository.update(
      transactionCode,
      transaction,
    );
    // emit event to notify that transaction is approved and update account's balance
    this.emit(TransactionEvents.TRANSACTION_APPROVED, updateResult);
    return updateResult;
  }

  private _generateTransactionCode(length: number = 10): string {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters[randomIndex];
    }

    return code;
  }
}
