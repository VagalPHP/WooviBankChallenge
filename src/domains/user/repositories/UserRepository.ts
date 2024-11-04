import User, { IUser } from '../schemas/User';
import mongoose from 'mongoose';

export default class UserRepository {
  async create(userData: IUser): Promise<IUser> {
    try {
      const user = new User(userData);
      return (await user.save()) as IUser;
    } catch (error) {
      console.log(error);
      throw new Error('Error creating user');
    }
  }

  async findById(id: string): Promise<IUser | null> {
    if (!mongoose.isValidObjectId(id)) {
      return null;
    }
    try {
      const objectId = new mongoose.Types.ObjectId(id);
      return await User.findById(objectId).populate('accounts');
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  }

  async findAll(): Promise<IUser[]> {
    try {
      return await User.find().populate('accounts');
    } catch (e) {
      console.log(e);
      return [];
    }
  }

  async update(id: string, updateData: Partial<IUser>): Promise<IUser | null> {
    if (!mongoose.isValidObjectId(id)) {
      return null;
    }
    try {
      return await User.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      }).populate('accounts');
    } catch (error) {
      console.error('Error updating user:', error);
      return null;
    }
  }
}
