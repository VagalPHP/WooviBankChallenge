import mongoose, { Document, Schema } from 'mongoose';

export interface IAccount extends Document {
  balance: number;
  user: mongoose.Types.ObjectId;
  transactions: mongoose.Types.ObjectId[];
}

const accountSchema = new Schema<IAccount>({
  balance: { type: Number, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  transactions: [{ type: Schema.Types.ObjectId, ref: 'Transaction' }],
});

//@ts-ignore
export default mongoose.model<IAccount>('Account', accountSchema);
