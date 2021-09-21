import {
  createAction,
  createFeatureSelector,
  createReducer,
  createSelector,
  on,
  props,
} from "@ngrx/store";
import { AppState } from "../app.reducer";
import { userFullNameUpdateSucessful } from "../user-update/user-update.reducer";
import {
  updateSavedFeatureState,
  getSavedFeatureState,
  deleteSavedFeatureState,
} from "../utils/reducer.utils";

export const authFeatureName = "auth";

// State
export interface AuthState {
  username: string;
  token: string;
  isAdmin: boolean;
  userFullName: string;
  loginFailedCount: number;
}

// Selectors
export const selectAuthFeature = createFeatureSelector<AppState, AuthState>(
  authFeatureName
);

export const selectAuthToken = createSelector(
  selectAuthFeature,
  (state: AuthState) => state.token
);

export const selectIsLoggedIn = createSelector(
  selectAuthFeature,
  (state: AuthState) => !!state.token
);

export const selectIsLoggedOut = createSelector(
  selectAuthFeature,
  (state: AuthState) => !state.token
);

export const selectAuthIsAdmin = createSelector(
  selectAuthFeature,
  (state: AuthState) => state.isAdmin
);

export const selectUsername = createSelector(
  selectAuthFeature,
  (state: AuthState) => state.username
);

export const selectAuthUserFullName = createSelector(
  selectAuthFeature,
  (state: AuthState) => state.userFullName
);

export const selectLoginFailedCount = createSelector(
  selectAuthFeature,
  (state: AuthState) => state.loginFailedCount
);

// Actions
export const loginAction = createAction(
  "[Auth] login",
  props<{ username: string; password: string }>()
);

export const loginSuccessfulAction = createAction(
  "[Auth] login successful",
  props<Pick<AuthState, "username" | "token" | "userFullName" | "isAdmin">>()
);

export const loginFailedAction = createAction("[Auth] login failed");

export const logoutAction = createAction("[Auth] logout");

// State manupilation
const defaultState: AuthState = {
  username: null,
  token: null,
  isAdmin: false,
  userFullName: null,
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
  on(loginFailedAction, (state) =>
    updateState(state, {
      loginFailedCount: state.loginFailedCount + 1,
    })
  ),
  on(userFullNameUpdateSucessful, updateState),
  on(logoutAction, resetState)
);
