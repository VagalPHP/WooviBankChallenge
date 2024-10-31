export interface ICreateUserParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface IAuthUserParams {
  email: string;
  password: string;
}
