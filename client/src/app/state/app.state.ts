import { RouterState } from "@angular/router";

import { AuthState } from "./auth/auth.state";
import { MenuState } from "./menu/menu.state";
import { UserRegistrationState } from "./users/user-registration/user-registration.state";
import { UserUpdateState } from "./users/user-update/user-update.state";
import { UsersListState } from "./users/users-list/users-list.state";

export interface AppState {
  router: RouterState;
  menu: MenuState;
  auth: AuthState;
  userRegistration: UserRegistrationState;
  userUpdate: UserUpdateState;
  usersList: UsersListState;
}
