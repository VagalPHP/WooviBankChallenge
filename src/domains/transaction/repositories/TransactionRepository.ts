import Transaction, { ITransaction } from '../entities/Transaction';

export default class TransactionRepository {
  async create(
    transactionData: Omit<ITransaction, '_id'>,
  ): Promise<ITransaction> {
    const transaction = new Transaction(transactionData);
    return (await transaction.save()) as ITransaction;
  }

  async findByTransactionCode(
    transactionCode: string,
    withAccount: boolean = false,
  ): Promise<ITransaction | null> {
    try {
      const transactionQuery = Transaction.findOne({
        transactionCode: transactionCode,
      });
      if (withAccount) {
        transactionQuery.populate('account').populate('targetAccount');
      }
      return transactionQuery;
    } catch (error) {
      console.error('Error fetching transaction:', error);
      return null;
    }
  }

  async findAll(): Promise<ITransaction[]> {
    try {
      return await Transaction.find().populate('account');
    } catch (e) {
      console.log(e);
      return [];
    }
  }

  async update(
    transactionCode: string,
    updateData: Partial<ITransaction>,
  ): Promise<ITransaction | null> {
    try {
      const updatedTransaction = await Transaction.findOneAndUpdate(
        { transactionCode: transactionCode },
        updateData,
        { new: true, runValidators: true },
      ).populate('account');

      return updatedTransaction as ITransaction | null;
    } catch (error) {
      console.error('Error updating transaction:', error);
      return null;
    }
  }
}
