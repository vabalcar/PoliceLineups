import {
  createAction,
  createFeatureSelector,
  createReducer,
  createSelector,
  on,
  props,
} from "@ngrx/store";
import { AppState } from "../app.reducer";
import { AuthState } from "../auth/auth.reducer";

export const userUpdateFeatureKey = "userUpdate";

// State
export interface UserUpdateState {
  success?: boolean;
}

// Selectors
export const selectUserUpdateFeature = createFeatureSelector<
  AppState,
  UserUpdateState
>(userUpdateFeatureKey);

export const selectUserUpdateSuccess = createSelector(
  selectUserUpdateFeature,
  (state: UserUpdateState) => state.success
);

// Actions
export const updateUserFullNameAction = createAction(
  "[User update] update user full name",
  props<{ selfUpdate: boolean; targetUsername?: string; newFullName: string }>()
);

export const updateUserPasswordAction = createAction(
  "[User update] update password",
  props<{ selfUpdate: boolean; targetUsername?: string; newPassword: string }>()
);

export const userUpdateFailed = createAction("[User update] failed");
export const userUpdateSuccessful = createAction("[User update] successful");
export const userFullNameUpdateSucessful = createAction(
  "[User update] fullname successful",
  props<Pick<AuthState, "userFullName">>()
);

// State manipulation
export const initialState: UserUpdateState = {};

export const userUpdateReducer = createReducer(
  initialState,
  on(updateUserFullNameAction, () => initialState),
  on(updateUserPasswordAction, () => initialState),
  on(userUpdateFailed, () => ({
    success: false,
  })),
  on(userUpdateSuccessful, () => ({
    success: true,
  })),
  on(userFullNameUpdateSucessful, () => ({
    success: true,
  }))
);
