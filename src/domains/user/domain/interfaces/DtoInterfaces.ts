export interface ICreateUserDTO {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface AuthenticateUserDTO {
  email: string;
  password: string;
}
