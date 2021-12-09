import { RouterState } from "@angular/router";
import { AuthState } from "./auth/auth.state";
import { UserUpdateState } from "./user-update/user-update.state";
import { UsersListState } from "./users-list/users-list.state";

export interface AppState {
  router: RouterState;
  auth: AuthState;
  usersList: UsersListState;
  userUpdate: UserUpdateState;
}
