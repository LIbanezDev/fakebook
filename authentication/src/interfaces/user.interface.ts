export interface UserInterface {
  id: number;
  name: string;
  bornDate: Date;
  description: string;
  google: boolean;
  github: boolean;
  email: string;
  password: string;
  salt: string;
}
