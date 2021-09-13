import {
  Action,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
} from "@ngrx/store";

// State
const authReducerName = "authReducer";

export interface AppState {
  auth: AuthState;
}

export interface AuthState {
  token?: string;
}

const retrieveSavedAuthState = (): AuthState | undefined => {
  const serializedState = localStorage.getItem(authReducerName);
  if (!serializedState) {
    return undefined;
  }

  return JSON.parse(serializedState) as AuthState;
};

const initialAuthState: AuthState = retrieveSavedAuthState();

// State manupilation
const updateAuthState = (
  state: AuthState,
  update: { token: string }
): AuthState => {
  const updatedState = Object.assign({}, state, update);
  localStorage.setItem(authReducerName, JSON.stringify(updatedState));
  return updatedState;
};

const deleteSavedAuthState = () => {
  localStorage.removeItem(authReducerName);
};

// Actions
const LOGIN_ACTION = "login";
const LOGIN_FAILED_ACTION = "login-failed";
const LOGOUT_ACTION = "logout";

export class LoginAction implements Action {
  readonly type = LOGIN_ACTION;
  constructor(public token: string) {}
}

export class LoginFailedAction implements Action {
  readonly type = LOGIN_FAILED_ACTION;
}

export class LogoutAction implements Action {
  readonly type = LOGOUT_ACTION;
}

// Reducers
const authReducer = (state: AuthState, action: Action) => {
  switch (action.type) {
    case LOGIN_ACTION:
      return updateAuthState(state, { token: (action as LoginAction).token });
    case LOGIN_FAILED_ACTION:
    case LOGOUT_ACTION:
      deleteSavedAuthState();
      return initialAuthState;
    default:
      return initialAuthState;
  }
};

export const reducers: ActionReducerMap<Record<string, unknown>> = {
  auth: authReducer,
};

// Selectors
export const selectAuthFeature = createFeatureSelector<AppState, AuthState>(
  "auth"
);

export const selectAuthToken = createSelector(
  selectAuthFeature,
  (state: AuthState) => state.token
);
