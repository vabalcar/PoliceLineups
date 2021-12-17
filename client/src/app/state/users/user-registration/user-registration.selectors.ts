import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AppState } from "../../app.state";
import { UserRegistrationState } from "./user-registration.state";

export const userRegistrationFeatureKey = "userRegistration";

export const selectUserRegistrationFeature = createFeatureSelector<
  AppState,
  UserRegistrationState
>(userRegistrationFeatureKey);

export const selectUsernameValidationError = createSelector(
  selectUserRegistrationFeature,
  (state: UserRegistrationState) => state.usernameValidationError
);
