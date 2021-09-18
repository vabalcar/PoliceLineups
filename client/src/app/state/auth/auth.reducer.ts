import {
  createAction,
  createFeatureSelector,
  createReducer,
  createSelector,
  on,
  props,
} from "@ngrx/store";
import { AppState } from "../app.reducer";

export const authFeatureName = "auth";

// States
export interface AuthState {
  username: string;
  password: string;
  token: string;
  isAdmin: boolean;
  userFullName: string;
}

const retrieveSavedAuthState = (): AuthState | undefined => {
  const serializedState = localStorage.getItem(authFeatureName);
  if (!serializedState) {
    return undefined;
  }

  return JSON.parse(serializedState) as AuthState;
};

// Actions
export const loginAction = createAction(
  "[Auth] login",
  props<{ username: string; password: string }>()
);

export const loginSuccessfulAction = createAction(
  "[Auth] login successful",
  props<{ token: string; isAdmin: boolean; userFullName: string }>()
);

export const loginFailedAction = createAction("[Auth] login failed");

export const logoutAction = createAction("[Auth] logout");

// State manupilation
const defaultAuthState: AuthState = {
  username: null,
  password: null,
  token: null,
  isAdmin: false,
  userFullName: null,
};

export const initialAuthState: AuthState =
  retrieveSavedAuthState() ?? defaultAuthState;

const updateAuthState = (
  state: AuthState,
  update: Partial<AuthState>
): AuthState => {
  const updatedState = Object.assign({}, state, update);
  localStorage.setItem(authFeatureName, JSON.stringify(updatedState));
  return updatedState;
};

const resetAuthState = () => {
  localStorage.removeItem(authFeatureName);
  return defaultAuthState;
};

export const authReducer = createReducer(
  initialAuthState,
  on(loginAction, updateAuthState),
  on(loginSuccessfulAction, updateAuthState),
  on(loginFailedAction, resetAuthState),
  on(logoutAction, resetAuthState)
);

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

export const selectAuthUserFullName = createSelector(
  selectAuthFeature,
  (state: AuthState) => state.userFullName
);
