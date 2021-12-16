import { createAction, props } from "@ngrx/store";
import { UserWithPassword } from "src/app/api/model/userWithPassword";
import { UserRegistrationState } from "./user-registration.state";

export const validateUserFullname = createAction(
  "[User registration] full name validation",
  props<{ fullName: string }>()
);

export const userFullNameValidated = createAction(
  "[User registration] full name validated",
  props<Pick<UserRegistrationState, "userFullNameValidationError">>()
);

export const registerUser = createAction(
  "[User registration] request",
  props<UserWithPassword>()
);

export const userRegistrationSuccessful = createAction(
  "[User registration] success"
);

export const userRegistrationFailed = createAction(
  "[User registration] failure"
);
