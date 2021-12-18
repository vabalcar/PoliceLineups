import { routerReducer } from "@ngrx/router-store";
import { ActionReducerMap } from "@ngrx/store";

import { authReducer } from "./auth/auth.reducer";
import {
  userRegistrationReducer,
} from "./users/user-registration/user-registration.reducer";
import { userUpdateReducer } from "./users/user-update/user-update.reducer";
import { usersListReducer } from "./users/users-list/users-list.reducer";

export const reducers: ActionReducerMap<Record<string, unknown>> = {
  router: routerReducer,
  auth: authReducer,
  userRegistration: userRegistrationReducer,
  userUpdate: userUpdateReducer,
  usersList: usersListReducer,
};
