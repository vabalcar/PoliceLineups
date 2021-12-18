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

export const updateUserFullName = createAction(
  "[User update] update user full name",
  props<{ targetUserId?: number; newFullName: string }>()
);

export const userFullNameUpdateSuccessful = createAction(
  "[User update] full name update successful",
  props<Pick<UserUpdateState, "fullName">>()
);

export const currentUserFullNameUpdateSuccessful = createAction(
  "[User update] current full name update successful",
  props<Pick<UserUpdateState, "fullName">>()
);

export const updateUserPassword = createAction(
  "[User update] update password",
  props<{ targetUserId?: number; newPassword: string }>()
);

export const userPasswordUpdateSuccessful = createAction(
  "[User update] password update successful"
);

export const updateUserRole = createAction(
  "[User update] update role",
  props<{ targetUserId?: number; isAdmin: boolean }>()
);

export const userRoleUpdateSuccessful = createAction(
  "[User update] role update successful"
);

export const userUpdateFailed = createAction("[User update] update failed");

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
