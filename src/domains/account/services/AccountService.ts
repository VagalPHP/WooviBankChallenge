import AccountRepository from '../repositories/AccountRepository';
import { IAccount } from '../entities/Account';
import AccountDTO from '../dto/AccountDTO';

export default class AccountService {
  constructor(private accountRepository: AccountRepository) {}

  async createAccount(accountData: AccountDTO): Promise<IAccount> {
    accountData.accountNumber = this._generateAccountNumber();
    return await this.accountRepository.create(accountData.toAccount());
  }

  async getAccount(accountNumber: string): Promise<IAccount | null> {
    return await this.accountRepository.findByAccountNumber(accountNumber);
  }

  async addBalance(accountNumber: string, balance: number): Promise<void> {
    const account =
      await this.accountRepository.findByAccountNumber(accountNumber);

    if (!account) {
      return;
    }
    await this.accountRepository.updateBalance(
      accountNumber.toString(),
      account.balance + balance,
    );
  }

  async subBalance(accountNumber: string, balance: number): Promise<void> {
    const account =
      await this.accountRepository.findByAccountNumber(accountNumber);
    if (!account) {
      return;
    }
    await this.accountRepository.updateBalance(
      accountNumber.toString(),
      account.balance - balance,
    );
  }

  private _generateAccountNumber(): number {
    // Define o tamanho desejado para o número da conta, por exemplo, 10 dígitos
    const accountNumberLength = 10;

    // Gera uma sequência numérica aleatória com o comprimento desejado
    let accountNumber = '';
    for (let i = 0; i < accountNumberLength; i++) {
      // Adiciona um dígito aleatório de 0 a 9
      accountNumber += Math.floor(Math.random() * 10);
    }

    // Retorna o número da conta formatado
    return Number(accountNumber);
  }
}
