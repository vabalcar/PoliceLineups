import { IUserInfo } from "../utils/IUserInfo";

export interface UserUpdateState extends IUserInfo {
  success?: boolean;
  userFullNameUpdateValidationError?: string;
}
