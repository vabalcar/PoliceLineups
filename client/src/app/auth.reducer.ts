import {
  ActionReducerMap,
  createAction,
  createFeatureSelector,
  createReducer,
  createSelector,
  on,
  props,
} from "@ngrx/store";

const authFeatureName = "auth";

// States
export interface AppState {
  auth: AuthState;
}

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
export const loginActionType = "[Auth] login";
export const loginAction = createAction(
  loginActionType,
  props<{ username: string; password: string }>()
);

export const loginSucessfulActionType = "[Auth] login successful";
export const loginSuccessfulAction = createAction(
  loginSucessfulActionType,
  props<{ token: string; isAdmin: boolean; userFullName: string }>()
);

export const loginFailedActionType = "[Auth] login failed";
export const loginFailedAction = createAction(loginFailedActionType);

export const logoutActionType = "[Auth] logout";
export const logoutAction = createAction(logoutActionType);

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

const authReducer = createReducer(
  initialAuthState,
  on(loginAction, updateAuthState),
  on(loginSuccessfulAction, updateAuthState),
  on(loginFailedAction, resetAuthState),
  on(logoutAction, resetAuthState)
);

export const reducers: ActionReducerMap<Record<string, unknown>> = {
  auth: authReducer,
};

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
