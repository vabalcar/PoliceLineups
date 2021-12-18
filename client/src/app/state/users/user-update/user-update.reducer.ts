import { createReducer, on } from "@ngrx/store";

import { updateState } from "../../utils/reducer.utils";
import { loadUserToUpdate, userToUpdateLoaded } from "./user-update.actions";
import { UserUpdateState } from "./user-update.state";

export const initialState: UserUpdateState = {
  userId: null,
  username: null,
  isAdmin: false,
  fullName: null,
};

export const userUpdateReducer = createReducer(
  initialState,
  on(loadUserToUpdate, () => initialState),
  on(userToUpdateLoaded, updateState)
);
