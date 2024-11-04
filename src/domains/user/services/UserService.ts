import User, { IUser } from '../schemas/User';

export default class UserService {
  async create(userData: IUser): Promise<IUser> {
    const user = new User(userData);
    return (await user.save()) as IUser;
  }
}
