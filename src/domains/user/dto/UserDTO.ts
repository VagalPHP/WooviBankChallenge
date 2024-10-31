
import { User } from '../entities/User';
import {ICreateUserParams} from "../interfaces/UserInterfaces";

export default class UserDTO implements ICreateUserParams{
  firstName: string;
  lastName: string;
  email: string;
  password: string;

  constructor(data: ICreateUserParams) {
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.email = data.email;
    this.password = data.password;
  }

  toUser(): User {
    return new User(this.firstName, this.lastName, this.email, this.password);
  }
}
