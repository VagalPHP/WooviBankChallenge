import Transaction, { ITransaction } from '../entities/Transaction';
import mongoose from 'mongoose';

export default class TransactionRepository {
  async create(
    transactionData: Omit<ITransaction, '_id'>,
  ): Promise<ITransaction> {
    const transaction = new Transaction(transactionData);
    return (await transaction.save()) as ITransaction;
  }

  async findById(id: string): Promise<ITransaction | null> {
    if (!mongoose.isValidObjectId(id)) {
      return null;
    }
    try {
      const objectId = new mongoose.Types.ObjectId(id);
      return Transaction.findById(objectId).populate('account');
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
    id: string,
    updateData: Partial<ITransaction>,
  ): Promise<ITransaction | null> {
    if (!mongoose.isValidObjectId(id)) {
      return null;
    }

    try {
      const updatedTransaction = await Transaction.findByIdAndUpdate(
        id,
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
