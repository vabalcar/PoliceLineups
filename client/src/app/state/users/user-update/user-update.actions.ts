import { createAction, props } from "@ngrx/store";
import { UserUpdateState } from "./user-update.state";

export const loadUserToUpdate = createAction(
  "[User update] load user",
  props<{ targetUserId?: number }>()
);

export const userToUpdateLoaded = createAction(
  "[User update] load user successful",
  props<Pick<UserUpdateState, "userId" | "fullName">>()
);

export const validateUserFullnameUpdate = createAction(
  "[User update] validate user full name update",
  props<{ newFullName: string }>()
);

export const userFullnameUpdateValidated = createAction(
  "[User update] user full name update validated",
  props<Pick<UserUpdateState, "userFullNameUpdateValidationError">>()
);

export const updateUserFullName = createAction(
  "[User update] update user full name",
  props<{ targetUserId?: number; newFullName: string }>()
);

export const updateUserPassword = createAction(
  "[User update] update password",
  props<{ targetUserId?: number; newPassword: string }>()
);

export const userUpdateFailed = createAction("[User update] failed");

export const userUpdatePasswordSuccessful = createAction(
  "[User update] password successful"
);

export const currentUserFullNameUpdateSuccessful = createAction(
  "[User update] current full name",
  props<Pick<UserUpdateState, "fullName">>()
);

export const userFullNameUpdateSuccessful = createAction(
  "[User update] full name successful",
  props<Pick<UserUpdateState, "fullName">>()
);

export const deleteUser = createAction(
  "[User update] deletion",
  props<{ targetUserId?: number }>()
);

export const currentUserDeletionSuccessful = createAction(
  "[User update] current user deletion successful"
);

export const userDeletionSuccessful = createAction(
  "[User update] user deletion successful"
);

export const userDeletionFailed = createAction("[User update] deletion failed");