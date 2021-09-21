import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { exhaustMap, map } from "rxjs/operators";
import { DefaultService } from "src/app/api/api/default.service";
import {
  updateUserFullNameAction,
  updateUserPasswordAction,
  userFullNameUpdateSucessful,
  userUpdateFailed,
  userUpdateSuccessful,
} from "./user-update.reducer";

@Injectable()
export class UserUpdateEffects {
  updatePassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateUserPasswordAction),
      exhaustMap((action) =>
        (action.selfUpdate
          ? this.api.updateCurrentUser({ password: action.newPassword })
          : this.api.updateUser(
              {
                password: action.newPassword,
              },
              action.targetUsername
            )
        ).pipe(
          map((response) =>
            response.success ? userUpdateSuccessful() : userUpdateFailed()
          )
        )
      )
    )
  );

  updateFullName$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateUserFullNameAction),
      exhaustMap((action) =>
        (action.selfUpdate
          ? this.api.updateCurrentUser({ name: action.newFullName })
          : this.api.updateUser(
              {
                name: action.newFullName,
              },
              action.targetUsername
            )
        ).pipe(
          map((response) =>
            response.success
              ? userFullNameUpdateSucessful({
                  userFullName: action.newFullName,
                })
              : userUpdateFailed()
          )
        )
      )
    )
  );

  constructor(private actions$: Actions, private api: DefaultService) {}
}
