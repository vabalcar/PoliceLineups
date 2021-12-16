import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { exhaustMap, map, mergeMap } from "rxjs/operators";
import { DefaultService } from "src/app/api/api/default.service";
import { catchBeError } from "../../utils/errors.utils";
import {
  registerUser,
  userFullNameValidated,
  userRegistrationSuccessful,
  userRegistrationFailed,
  validateUserFullname,
} from "./user-registration.actions";

@Injectable()
export class UserRegistrationEffects {
  validateFullName$ = createEffect(() =>
    this.actions$.pipe(
      ofType(validateUserFullname),
      mergeMap((action) =>
        this.api.validateUserUpdate({ fullName: action.fullName }).pipe(
          map((response) =>
            userFullNameValidated({
              userFullNameValidationError: response.error,
            })
          ),
          catchBeError()
        )
      )
    )
  );

  registerUser$ = createEffect(() =>
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
