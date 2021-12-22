import { createAction, props } from "@ngrx/store";
import { UserWithPassword } from "src/app/api/model/userWithPassword";

import { UserRegistrationState } from "./user-registration.state";

export const validateUserName = createAction(
  "[User registration] username validation",
  props<{ username: string }>()
);

export const usernameValidated = createAction(
  "[User registration] username validated",
  props<Pick<UserRegistrationState, "usernameValidationError">>()
);

export const registerUser = createAction(
  "[User registration] request",
  props<UserWithPassword>()
);

export const userRegistrationSuccessful = createAction(
  "[User registration] success"
);

export const userRegistrationFailed = createAction(
  "[User registration] failure",
  props<{ error: string }>()
);
