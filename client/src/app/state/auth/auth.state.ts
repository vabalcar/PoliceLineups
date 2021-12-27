import { User } from "src/app/api/model/user";

export interface AuthState extends User {
  token?: string;
  tokenExpirationDatetime?: Date;
  loginFailedCount: number;
}
