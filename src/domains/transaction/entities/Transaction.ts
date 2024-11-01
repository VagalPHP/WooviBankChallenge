import mongoose, { Document, Schema } from 'mongoose';

export type TransactionStatus =
  | 'in_progress'
  | 'completed'
  | 'failed'
  | 'canceled'
  | 'no_balance';

export interface ITransaction extends Document {
  account: mongoose.Types.ObjectId;
  targetAccount: mongoose.Types.ObjectId;
  transactionCode: string;
  amount: number;
  status: TransactionStatus;
  createdAt: Date;
  updatedAt: Date;
}

export const transactionSchema = new Schema<ITransaction>({
  account: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
  targetAccount: {
    type: Schema.Types.ObjectId,
    ref: 'Account',
    required: true,
  },
  transactionCode: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

//@ts-ignore
export default mongoose.model<ITransaction>('Transaction', transactionSchema);
