import {
  createAction,
  createFeatureSelector,
  createReducer,
  createSelector,
  on,
  props,
} from "@ngrx/store";
import { AppState } from "../app.reducer";
import { IUserInfo } from "../auth/auth.reducer";
import { updateState } from "../utils/reducer.utils";
import { createUserInfoSelector } from "../utils/users.utils";

export const userUpdateFeatureKey = "userUpdate";

// State
export interface UserUpdateState extends IUserInfo {
  success?: boolean;
  userFullNameUpdateValidationError?: string;
}

// Selectors
export const selectUserUpdateFeature = createFeatureSelector<
  AppState,
  UserUpdateState
>(userUpdateFeatureKey);

export const selectUserUpdateSuccess = createSelector(
  selectUserUpdateFeature,
  (state: UserUpdateState) => state.success
);

export const selectUserFullnameUpdateValidationError = createSelector(
  selectUserUpdateFeature,
  (state: UserUpdateState) => state.userFullNameUpdateValidationError
);

export const selectEditedUserInfo = createUserInfoSelector(
  selectUserUpdateFeature
);

// Actions
export const loadUserToUpdate = createAction(
  "[User update] load user",
  props<{ targetUserId?: number }>()
);

export const userToUpdateLoaded = createAction(
  "[User update] load user successful",
  props<Pick<UserUpdateState, "userId" | "fullName">>()
);

export const validateUserFullnameUpdate = createAction(
  "[User update] validate user full name update",
  props<{ newFullName: string }>()
);

export const userFullnameUpdateValidated = createAction(
  "[User update] user full name update validated",
  props<Pick<UserUpdateState, "userFullNameUpdateValidationError">>()
);

export const updateUserFullName = createAction(
  "[User update] update user full name",
  props<{ targetUserId?: number; newFullName: string }>()
);

export const updateUserPassword = createAction(
  "[User update] update password",
  props<{ targetUserId?: number; newPassword: string }>()
);

export const userUpdateFailed = createAction("[User update] failed");
export const userUpdatePasswordSuccessful = createAction(
  "[User update] password successful"
);
export const currentUserFullNameUpdateSuccessful = createAction(
  "[User update] current fullname",
  props<Pick<UserUpdateState, "fullName">>()
);
export const userFullNameUpdateSucessful = createAction(
  "[User update] fullname successful",
  props<Pick<UserUpdateState, "fullName">>()
);

// State manipulation
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
  on(userFullNameUpdateSucessful, (state, action) =>
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
