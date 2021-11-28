import {
  createAction,
  createFeatureSelector,
  createReducer,
  createSelector,
  on,
  props,
} from "@ngrx/store";
import { AppState } from "../app.reducer";
import { currentUserFullNameUpdateSuccessful as fullNameUpdated } from "../user-update/user-update.reducer";
import {
  updateSavedFeatureState,
  getSavedFeatureState,
  deleteSavedFeatureState,
} from "../utils/reducer.utils";
import { createUserInfoSelector } from "../utils/users.utils";

export const authFeatureName = "auth";

export interface IUserInfo {
  userId: number;
  username: string;
  isAdmin: boolean;
  fullName: string;
}

// State
export interface AuthState extends IUserInfo {
  token: string;
  tokenExpirationDatetime: Date;
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

// Actions
export const loginAction = createAction(
  "[Auth] login",
  props<{ username: string; password: string }>()
);

export const loginSuccessfulAction = createAction(
  "[Auth] login successful",
  props<
    Pick<
      AuthState,
      | "userId"
      | "username"
      | "isAdmin"
      | "fullName"
      | "token"
      | "tokenExpirationDatetime"
    >
  >()
);

export const renewInitTokenAction = createAction("[Auth] renew init token");

export const renewTokenAction = createAction("[Auth] renew token");

export const tokenRenewed = createAction(
  "[Auth] token renewed",
  props<Pick<AuthState, "token" | "tokenExpirationDatetime">>()
);

export const loginFailedAction = createAction("[Auth] login failed");

export const logoutAction = createAction("[Auth] logout");

// State manupilation
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
