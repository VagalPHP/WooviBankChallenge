import { UserService } from '../application/services/UserService';
import { MockUserRepository } from './UserRepository.test';
import { AuthenticateUserDTO } from '../domain/interfaces/DtoInterfaces';
import UserDTO from '../application/dto/UserDTO';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: MockUserRepository;

  beforeEach(() => {
    userRepository = new MockUserRepository();
    userService = new UserService(userRepository);
  });

  it('should create a new user', async () => {
    const createUserDTO: UserDTO = new UserDTO({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'securePass',
    });

    const user = await userService.createUser(createUserDTO);

    expect(user.firstName).toBe('John');
    expect(user.email).toBe('john@example.com');
  });

  it('should not allow duplicate emails', async () => {
    const createUserDTO: UserDTO = new UserDTO({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'securePass',
    });

    await userService.createUser(createUserDTO);

    await expect(userService.createUser(createUserDTO)).rejects.toThrow(
      'Email already in use.'
    );
  });

  it('should authenticate a user with valid credentials', async () => {
    const createUserDTO: UserDTO = new UserDTO({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'securePass',
    });

    await userService.createUser(createUserDTO);

    const authenticateUserDTO: AuthenticateUserDTO = {
      email: 'john@example.com',
      password: 'securePass',
    };

    const isAuthenticated =
      await userService.authenticateUser(authenticateUserDTO);
    expect(isAuthenticated).toBe(true);
  });

  it('should not authenticate a user with invalid credentials', async () => {
    const createUserDTO: UserDTO = new UserDTO({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'securePass',
    });

    await userService.createUser(createUserDTO);

    const authenticateUserDTO: AuthenticateUserDTO = {
      email: 'john@example.com',
      password: 'wrongPass',
    };

    const isAuthenticated =
      await userService.authenticateUser(authenticateUserDTO);
    expect(isAuthenticated).toBe(false);
  });
});
