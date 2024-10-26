import { User } from '../domain/entities/User';

describe('User Entity', () => {
  it('should create a user with valid properties', () => {
    const user = new User('John', 'Doe', 'john@example.com', 'securePass');
    expect(user.firstName).toBe('John');
    expect(user.lastName).toBe('Doe');
    expect(user.email).toBe('john@example.com');
  });

  it('should throw an error if the password is less than 6 characters', () => {
    expect(() => new User('Jane', 'Doe', 'jane@example.com', '123')).toThrow(
      'Password must be at least 6 characters long.'
    );
  });

  it('should check if the password is correct', () => {
    const user = new User('John', 'Doe', 'john@example.com', 'securePass');
    expect(user.checkPassword('securePass')).toBe(true);
    expect(user.checkPassword('wrongPass')).toBe(false);
  });
});
