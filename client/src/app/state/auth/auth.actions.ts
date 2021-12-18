import { createAction, props } from "@ngrx/store";

import { AuthState } from "./auth.state";

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
