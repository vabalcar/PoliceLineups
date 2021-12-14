import { IUserInfo } from "../users/utils/IUserInfo";

export interface AuthState extends IUserInfo {
  token: string;
  tokenExpirationDatetime: Date;
  loginFailedCount: number;
}
