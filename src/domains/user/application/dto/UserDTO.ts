import { ICreateUserDTO } from '../../domain/interfaces/DtoInterfaces';
import { User } from '../../domain/entities/User';

export default class UserDTO implements ICreateUserDTO {
  firstName: string;
  lastName: string;
  email: string;
  password: string;

  constructor(data: ICreateUserDTO) {
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.email = data.email;
    this.password = data.password;
  }

  toUser(): User {
    return new User(this.firstName, this.lastName, this.email, this.password);
  }
}
