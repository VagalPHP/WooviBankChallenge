export interface ICreateTransactionParams {
    accountId: string;
    type: 'send' | 'receive';
    amount: number;
}
