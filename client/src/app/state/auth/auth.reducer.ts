import { createReducer, on } from "@ngrx/store";
import { currentUserFullNameUpdateSuccessful as fullNameUpdated } from "../users/user-update/user-update.actions";
import {
  updateSavedFeatureState,
  getSavedFeatureState,
  deleteSavedFeatureState,
} from "../utils/reducer.utils";
import {
  loginFailedAction,
  loginSuccessfulAction,
  logoutAction,
  tokenRenewed,
} from "./auth.actions";
import { authFeatureName } from "./auth.selectors";
import { AuthState } from "./auth.state";

const defaultState: AuthState = {
  userId: null,
  username: null,
  isAdmin: false,
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
  on(loginSuccessfulAction, (state, actionProps) =>
    updateState(state, actionProps, { loginFailedCount: 0 })
  ),
  on(tokenRenewed, updateState),
  on(loginFailedAction, (state) =>
    updateState(state, {
      loginFailedCount: state.loginFailedCount + 1,
    })
  ),
  on(fullNameUpdated, updateState),
  on(logoutAction, resetState)
);
