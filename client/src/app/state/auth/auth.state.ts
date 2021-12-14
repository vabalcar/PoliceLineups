import { IUserInfo } from "../utils/IUserInfo";

export interface AuthState extends IUserInfo {
  token: string;
  tokenExpirationDatetime: Date;
  loginFailedCount: number;
}
