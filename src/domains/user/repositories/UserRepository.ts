import User, { IUser } from '../entities/User';
import mongoose from 'mongoose';

class UserRepository {
  async create(userData: IUser): Promise<IUser> {
    try {
      const user = new User(userData);
      console.log({ user });
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
      return await User.findById(objectId).populate('accounts'); // Retorna o usuário encontrado ou null se não encontrado
    } catch (error) {
      console.error('Error fetching user:', error);
      return null; // Retorna null em caso de erro
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
}

export default new UserRepository();
