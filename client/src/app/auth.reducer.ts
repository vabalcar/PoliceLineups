import { Action, ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';

// State
export interface State {
  auth: AuthState;
}

export const reducers: ActionReducerMap<State> = {
  auth: authReducer,
  
};

export const authReducerFeatureKey = 'authReducer';

export interface AuthState {
  token: string;
}

export const initialAuthState: AuthState = {
  token: ''
};

function _newState(state: AuthState, update) : AuthState {
  const newState = Object.assign({}, state, update);
  //localStorage.setItem(authReducerFeatureKey, JSON.stringify(newState));
  return newState;
}

function _retrieveSavedState(): AuthState {
  const serializedState = localStorage.getItem(authReducerFeatureKey);
  return serializedState ? JSON.parse(serializedState) as AuthState : null;
}

function _deleteSavedState() {
  localStorage.removeItem(authReducerFeatureKey);
}

// Actions

const LOGIN_ACTION = 'login';
const LOGIN_FAILED_ACTION = 'login-failed';
const LOGOUT_ACTION = 'logout';

export class LoginAction implements Action {
  readonly type = LOGIN_ACTION;
  constructor(public token: string) {
  }
}

export class LoginFailedAction implements Action {
  readonly type = LOGIN_FAILED_ACTION;
}

export class LogoutAction implements Action {
  readonly type = LOGOUT_ACTION;
}

//Reducers

export function authReducer(state: AuthState = initialAuthState, action: Action) {
  switch(action.type) {
    case LOGIN_ACTION:
      return _newState(state, { token: (action as LoginAction).token });
    case LOGIN_FAILED_ACTION:
    case LOGOUT_ACTION:
      _deleteSavedState();
      return initialAuthState;
    default:
      return initialAuthState;
  }
}

// export function reducer(state: AuthState | undefined, action: Action) {
//   return authReducer(state, action);
// }

// Selectors

export const featureKey = 'auth';

export const selectAuth = createFeatureSelector<AuthState>('auth');

export const selectAccessToken = createSelector(
  selectAuth,
  (state: AuthState) => state.token
);