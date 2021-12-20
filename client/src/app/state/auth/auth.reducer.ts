import { createReducer, on } from "@ngrx/store";

import {
  currentUserEmailUpdateSuccessful as emailUpdated,
  currentUserFullNameUpdateSuccessful as fullNameUpdated,
} from "../users/user-update/user-update.actions";
import {
  deleteSavedFeatureState,
  getSavedFeatureState,
  updateSavedFeatureState,
} from "../utils/reducer.utils";
import {
  loginFailed,
  loginSuccessful,
  logout,
  tokenRenewed,
} from "./auth.actions";
import { authFeatureName } from "./auth.selectors";
import { AuthState } from "./auth.state";

const defaultState: AuthState = {
  userId: null,
  username: null,
  isAdmin: false,
  email: null,
  fullName: null,
  token: null,
  tokenExpirationDatetime: null,
  loginFailedCount: 0,
};

export const initialState: AuthState =
  getSavedFeatureState<AuthState>(authFeatureName) ?? defaultState;

const updateState = (state: AuthState, ...updates: Partial<AuthState>[]) =>
  updateSavedFeatureState(authFeatureName, state, ...updates);

const resetState = () => {
  deleteSavedFeatureState(authFeatureName);
  return defaultState;
};

export const authReducer = createReducer(
  initialState,
  on(loginSuccessful, (state, actionProps) =>
    updateState(state, actionProps, { loginFailedCount: 0 })
  ),
  on(tokenRenewed, updateState),
  on(loginFailed, (state) =>
    updateState(state, {
      loginFailedCount: state.loginFailedCount + 1,
    })
  ),
  on(emailUpdated, updateState),
  on(fullNameUpdated, updateState),
  on(logout, resetState)
);
