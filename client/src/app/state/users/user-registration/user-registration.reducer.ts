import { createReducer, on } from "@ngrx/store";
import { updateState } from "../../utils/reducer.utils";
import {
  userFullNameValidated,
  userRegistrationSuccessful,
  userRegistrationFailed,
} from "./user-registration.actions";
import { UserRegistrationState } from "./user-registration.state";

export const initialState: UserRegistrationState = {
  success: false,
};

export const userRegistrationReducer = createReducer(
  initialState,
  on(userFullNameValidated, updateState),
  on(userRegistrationFailed, (state) =>
    updateState(state, {
      success: false,
    })
  ),
  on(userRegistrationSuccessful, (state) =>
    updateState(state, {
      success: true,
    })
  )
);
