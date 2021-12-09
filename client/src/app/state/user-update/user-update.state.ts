import { IUserInfo } from "../utils/user-info";

export interface UserUpdateState extends IUserInfo {
  success?: boolean;
  userFullNameUpdateValidationError?: string;
}
