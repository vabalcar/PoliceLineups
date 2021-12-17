import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { exhaustMap, map, mergeMap } from "rxjs/operators";
import { DefaultService } from "src/app/api/api/default.service";
import { catchBeError } from "../../utils/errors.utils";
import {
  registerUser,
  usernameValidated,
  userRegistrationSuccessful,
  userRegistrationFailed,
  validateUserName,
} from "./user-registration.actions";

@Injectable()
export class UserRegistrationEffects {
  usernameValidation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(validateUserName),
      mergeMap((action) =>
        this.api.validateNewUser({ username: action.username }).pipe(
          map((response) =>
            usernameValidated({
              usernameValidationError: response.error,
            })
          ),
          catchBeError()
        )
      )
    )
  );

  userRegistration$ = createEffect(() =>
    this.actions$.pipe(
      ofType(registerUser),
      exhaustMap((action) =>
        this.api.addUser(action).pipe(
          map((response) =>
            !response.error
              ? userRegistrationSuccessful()
              : userRegistrationFailed()
          ),
          catchBeError()
        )
      )
    )
  );

  constructor(private actions$: Actions, private api: DefaultService) {}
}
