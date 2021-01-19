export interface ICredential {
  id: number;
  email: string;
  password: string;
  salt: string;
  createdAt: Date;
  verified: boolean
}

export interface IConfirmationCode {
  id: number;
  code: number;
  createdAt: Date;
}

export interface IUser {
  id: number;
  name: string;
  description: string;
  bornDate: Date;
}
