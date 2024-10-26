import { User } from '../../domain/entities/User';
import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import {
  AuthenticateUserDTO,
  ICreateUserDTO,
} from '../../domain/interfaces/DtoInterfaces';
import UserDTO from '../dto/UserDTO';

export class UserService {
  constructor(private userRepository: IUserRepository) {}

  public async createUser(data: UserDTO): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error('Email already in use.');
    }
    const user = data.toUser();
    await this.userRepository.create(user);

    return user;
  }

  public async authenticateUser(data: AuthenticateUserDTO): Promise<boolean> {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) return false;

    return user.checkPassword(data.password);
  }
}
