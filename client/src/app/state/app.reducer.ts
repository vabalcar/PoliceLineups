import { ActionReducerMap } from "@ngrx/store";

import { authReducer, AuthState } from "./auth/auth.reducer";

export interface AppState {
  auth: AuthState;
}

export const reducers: ActionReducerMap<Record<string, unknown>> = {
  auth: authReducer,
};
