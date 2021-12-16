import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AppState } from "../../app.state";
import { UserRegistrationState } from "./user-registration.state";

export const userRegistrationFeatureKey = "userRegistration";

export const selectUserRegistrationFeature = createFeatureSelector<
  AppState,
  UserRegistrationState
>(userRegistrationFeatureKey);

export const selectUserUpdateSuccess = createSelector(
  selectUserRegistrationFeature,
  (state: UserRegistrationState) => state.success
);

export const selectUserFullnameValidationError = createSelector(
  selectUserRegistrationFeature,
  (state: UserRegistrationState) => state.userFullNameValidationError
);
