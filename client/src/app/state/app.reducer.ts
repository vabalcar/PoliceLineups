import { ActionReducerMap } from "@ngrx/store";

import { authReducer, AuthState } from "./auth/auth.reducer";
import {
  userUpdateReducer,
  UserUpdateState,
} from "./user-update/user-update.reducer";
import {
  usersListReducer,
  UsersListState,
} from "./users-list/users-list.reducer";

export interface AppState {
  auth: AuthState;
  usersList: UsersListState;
  userUpdate: UserUpdateState;
}

export const reducers: ActionReducerMap<Record<string, unknown>> = {
  auth: authReducer,
  usersList: usersListReducer,
  userUpdate: userUpdateReducer,
};