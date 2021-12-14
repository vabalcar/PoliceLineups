import { RouterState } from "@angular/router";
import { AuthState } from "./auth/auth.state";
import { UserUpdateState } from "./users/user-update/user-update.state";
import { UsersListState } from "./users/users-list/users-list.state";

export interface AppState {
  router: RouterState;
  auth: AuthState;
  usersList: UsersListState;
  userUpdate: UserUpdateState;
}
