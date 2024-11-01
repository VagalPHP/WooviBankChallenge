import TransactionResCode from '../enums/TransactionResCode';

export interface ITransactionResponseArgs {
  message?: string;
  code?: TransactionResCode;
  failed?: boolean;
}

export default class TransactionResponse implements ITransactionResponseArgs {
  code?: TransactionResCode;
  message?: string;
  failed?: boolean;

  constructor({
    message = 'Transaction done successfully',
    code = TransactionResCode.APPROVED,
    failed = false,
  }: ITransactionResponseArgs = {}) {
    this.message = message;
    this.code = code;
    this.failed = failed;
  }

  isApproved(): boolean {
    return this.code === TransactionResCode.APPROVED;
  }

  isFailed(): boolean {
    return this.failed ?? false;
  }
}
