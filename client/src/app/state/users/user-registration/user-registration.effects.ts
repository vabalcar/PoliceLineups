import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { exhaustMap, map, mergeMap, tap } from "rxjs/operators";
import { DefaultService } from "src/app/api/api/default.service";
import { NotificationsService } from "src/app/services/notifications.service";

import { catchBeError } from "../../utils/errors.utils";
import { omit } from "../../utils/object.utils";
import {
  registerUser,
  usernameValidated,
  userRegistrationFailed,
  userRegistrationSuccessful,
  validateUserName,
} from "./user-registration.actions";

@Injectable()
export class UserRegistrationEffects {
  validateUserName$ = createEffect(() =>
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

  registerUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(registerUser),
      exhaustMap((action) =>
        this.api.addUser(omit(action, "type")).pipe(
          map((response) =>
            !response.error
              ? userRegistrationSuccessful()
              : userRegistrationFailed({ error: response.error })
          ),
          catchBeError()
        )
      )
    )
  );

  userRegistrationSuccessful$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(userRegistrationSuccessful),
        tap(() => this.notifications.showNotification("User registered"))
      ),
    {
      dispatch: false,
    }
  );

  userRegistrationFailed$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(userRegistrationFailed),
        tap((action) =>
          this.notifications.showNotification(
            `User registration failed: ${action.error}`
          )
        )
      ),
    {
      dispatch: false,
    }
  );

  constructor(
    private actions$: Actions,
    private api: DefaultService,
    private notifications: NotificationsService
  ) {}
}
