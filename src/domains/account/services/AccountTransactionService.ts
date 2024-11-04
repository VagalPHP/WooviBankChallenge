import { IAccount } from '../schemas/Account';
import AccountService from './AccountService';

export default class AccountTransactionService {
  private _account: IAccount | null = null;
  private _targetAccount: IAccount | null = null;

  constructor(
    private _accountService: AccountService,
    private _accountNumber: string,
    private _targetAccountNumber: string,
  ) {
    this._getTransactionAccounts().then(({ account, targetAccount }) => {
      this._account = account;
      this._targetAccount = targetAccount;
    });
  }

  async processTransaction(amount: number): Promise<void> {
    if (!(await this._validateTransaction(amount))) {
      return;
    }
    await this._accountService.subBalance(
      this._account?.accountNumber.toString() || '',
      amount,
    );
    await this._accountService.addBalance(
      this._targetAccount?.accountNumber.toString() || '',
      amount,
    );
  }

  private async _validateTransaction(amount: number): Promise<boolean> {
    if (!this._account || !this._targetAccount || amount <= 0) {
      return false;
    }
    return await this._hasBalance(amount);
  }

  private async _hasBalance(amount: number): Promise<boolean> {
    return amount < (this._account?.balance ?? 0);
  }

  private async _getTransactionAccounts(): Promise<{
    targetAccount: IAccount | null;
    account: IAccount | null;
  }> {
    const account = await this._accountService.getAccount(this._accountNumber);
    const targetAccount = await this._accountService.getAccount(
      this._targetAccountNumber,
    );
    return { account: account, targetAccount: targetAccount };
  }
}
