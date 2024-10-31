import mongoose, { Document, Schema } from 'mongoose';

export type TransactionStatus =
  | 'in_progress'
  | 'completed'
  | 'failed'
  | 'canceled'
  | 'no_balance';

export interface ITransaction extends Document {
  account: mongoose.Types.ObjectId;
  amount: number;
  status: TransactionStatus;
  createdAt: Date;
}

const transactionSchema = new Schema<ITransaction>({
  account: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
  amount: { type: Number, required: true },
  status: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

//@ts-ignore
export default mongoose.model<ITransaction>('Transaction', transactionSchema);
