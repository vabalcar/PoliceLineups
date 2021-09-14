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
  token?: string;
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
  props<{ token: string }>()
);
export const loginFailedAction = createAction("[Auth] login failed");
export const logoutAction = createAction("[Auth] logout");

// State manupilation
const defaultAuthState: AuthState = {};
const initialAuthState: AuthState =
  retrieveSavedAuthState() ?? defaultAuthState;

const updateAuthState = (
  state: AuthState,
  update: { token: string }
): AuthState => {
  const updatedState = Object.assign({}, state, update);
  localStorage.setItem(authFeatureName, JSON.stringify(updatedState));
  return updatedState;
};

const deleteSavedAuthState = () => {
  localStorage.removeItem(authFeatureName);
  return defaultAuthState;
};

const authReducer = createReducer(
  initialAuthState,
  on(loginAction, updateAuthState),
  on(loginFailedAction, deleteSavedAuthState),
  on(logoutAction, deleteSavedAuthState)
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
