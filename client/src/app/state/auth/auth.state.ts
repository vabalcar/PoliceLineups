import { IUserInfo } from "../utils/user-info";

export interface AuthState extends IUserInfo {
  token: string;
  tokenExpirationDatetime: Date;
  loginFailedCount: number;
}
