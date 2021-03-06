import { createAction, props } from "@ngrx/store";

import { AuthState } from "./auth.state";

export const login = createAction(
  "[Auth] login",
  props<{ username: string; password: string }>()
);

export const loginSuccessful = createAction(
  "[Auth] login successful",
  props<Omit<AuthState, "loginFailedCount">>()
);

export const renewInitToken = createAction("[Auth] renew init token");

export const renewToken = createAction("[Auth] renew token");

export const tokenRenewed = createAction(
  "[Auth] token renewed",
  props<Pick<AuthState, "token" | "tokenExpirationDatetime">>()
);

export const loginFailed = createAction(
  "[Auth] login failed",
  props<{ error: string }>()
);

export const logout = createAction("[Auth] logout");
