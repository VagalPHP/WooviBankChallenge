import mongoose, { Document, Schema } from 'mongoose';

export interface IAccount extends Document {
  accountNumber: number;
  balance: number;
  user: mongoose.Types.ObjectId;
  transactions: mongoose.Types.ObjectId[];
}

export const accountSchema = new Schema<IAccount>({
  accountNumber: { type: Number, required: true, unique: true },
  balance: { type: Number, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  transactions: [{ type: Schema.Types.ObjectId, ref: 'Transaction' }],
});

//@ts-ignore
export default mongoose.model<IAccount>('Account', accountSchema);
