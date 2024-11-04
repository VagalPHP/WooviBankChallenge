import AccountService from '../services/AccountService';
import { IAccount } from '../schemas/Account';

export default class AccountController {
  constructor(private _accountService: AccountService) {}

  async getAccounts(): Promise<IAccount | null> {
    const userId = '1';
    return await this._accountService.getAccounts(userId);
  }
}
