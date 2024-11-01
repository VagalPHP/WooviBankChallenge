import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  accounts: string[];
}

export const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  accounts: [{ type: String }],
});
// @ts-ignore
const User = mongoose.model<IUser>('User', userSchema);
export default User;
