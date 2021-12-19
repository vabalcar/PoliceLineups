import { createFeatureSelector, createSelector } from "@ngrx/store";

import { AppState } from "../app.state";
import { createUserInfoSelector } from "../users/utils/selector.utils";
import { AuthState } from "./auth.state";

export const authFeatureName = "auth";

export const selectAuthFeature = createFeatureSelector<AppState, AuthState>(
  authFeatureName
);

export const selectToken = createSelector(
  selectAuthFeature,
  (state: AuthState) => state.token
);

export const selectIsLoggedIn = createSelector(
  selectAuthFeature,
  (state: AuthState) => !!state.token
);

export const selectCurrentUserIsAdmin = createSelector(
  selectAuthFeature,
  (state: AuthState) => state.isAdmin
);

export const selectCurrentUserUserId = createSelector(
  selectAuthFeature,
  (state: AuthState) => state.userId
);

export const selectCurrentUserUsername = createSelector(
  selectAuthFeature,
  (state: AuthState) => state.userId
);

export const selectCurrentUserFullName = createSelector(
  selectAuthFeature,
  (state: AuthState) => state.fullName
);

export const selectLoginFailedCount = createSelector(
  selectAuthFeature,
  (state: AuthState) => state.loginFailedCount
);

export const selectCurrentUserInfo = createUserInfoSelector(selectAuthFeature);
