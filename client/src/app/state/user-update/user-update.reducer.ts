import { createReducer, on } from "@ngrx/store";
import { updateState } from "../utils/reducer.utils";
import {
  currentUserFullNameUpdateSuccessful,
  loadUserToUpdate,
  userFullNameUpdateSuccessful,
  userFullnameUpdateValidated,
  userToUpdateLoaded,
  userUpdateFailed,
  userUpdatePasswordSuccessful,
} from "./user-update.actions";
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
  on(userToUpdateLoaded, updateState),
  on(userFullnameUpdateValidated, updateState),
  on(userUpdateFailed, (state) =>
    updateState(state, {
      success: false,
    })
  ),
  on(userUpdatePasswordSuccessful, (state) =>
    updateState(state, {
      success: true,
    })
  ),
  on(userFullNameUpdateSuccessful, (state, action) =>
    updateState(state, action, {
      success: true,
    })
  ),
  on(currentUserFullNameUpdateSuccessful, (state, action) =>
    updateState(state, action, {
      success: true,
    })
  )
);
