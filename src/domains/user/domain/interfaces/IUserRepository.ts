import { User } from '../entities/User';
import { ICreateUserDTO } from './DtoInterfaces';

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  create(user: User): Promise<void>;
}
