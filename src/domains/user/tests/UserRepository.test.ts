import UserRepository from '../infrastructure/repositories/UserRepository';
import { User } from '../domain/entities/User';
import UserDTO from '../application/dto/UserDTO';

export class MockUserRepository implements UserRepository {
  private users: User[] = [];

  async create(user: User): Promise<void> {
    this.users.push(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((user) => user.email === email) || null;
  }
}

describe('UserRepository', () => {
  const repository = new MockUserRepository();

  it('should create and retrieve a user by email', async () => {
    const data = new UserDTO({
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'alice@example.com',
      password: 'password123',
    });
    const user = data.toUser();
    await repository.create(user);

    const foundUser = await repository.findByEmail('alice@example.com');
    expect(foundUser).toEqual(user);
  });

  it('should return null if user is not found by email', async () => {
    const user = await repository.findByEmail('notfound@example.com');
    expect(user).toBeNull();
  });
});
