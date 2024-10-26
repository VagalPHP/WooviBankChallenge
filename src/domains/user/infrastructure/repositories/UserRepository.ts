import { User } from '../../domain/entities/User';
import { ICreateUserDTO } from '../../domain/interfaces/DtoInterfaces';
import { IUserRepository } from '../../domain/interfaces/IUserRepository';

export default class UserRepository implements IUserRepository {
  findByEmail(email: string): Promise<User | null> {
    throw new Error('Method not implemented.');
  }
  create(user: User): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
