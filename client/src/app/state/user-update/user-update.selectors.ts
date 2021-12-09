import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AppState } from "../app.state";
import { createUserInfoSelector } from "../utils/users.utils";
import { UserUpdateState } from "./user-update.state";

export const userUpdateFeatureKey = "userUpdate";

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
