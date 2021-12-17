import { createReducer, on } from "@ngrx/store";
import { updateState } from "../../utils/reducer.utils";
import { usernameValidated } from "./user-registration.actions";
import { UserRegistrationState } from "./user-registration.state";

export const initialState: UserRegistrationState = {};

export const userRegistrationReducer = createReducer(
  initialState,
  on(usernameValidated, updateState)
);
