export interface IRegisterUserDao {
  name: string;
  lastname: string;
  email: string;
  password: string;
}

export interface IUpdateUserDao {
  name: string;
  lastname: string;
  email: string;
}

export interface ILogin {
  email: string;
  password: string;
}
