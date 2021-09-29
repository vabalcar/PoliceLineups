import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { exhaustMap, map, mergeMap, tap } from "rxjs/operators";
import { DefaultService } from "src/app/api/api/default.service";
import { selectCurrentUserInfo, IUserInfo } from "../auth/auth.reducer";
import { catchBeError } from "../utils/errors.utils";
import {
  loadUserToUpdate,
  updateUserFullName,
  updateUserPassword,
  userFullNameUpdateSucessful,
  userFullnameUpdateValidated,
  userToUpdateLoaded,
  userUpdateFailed,
  userUpdatePasswordSuccessful,
  validateUserFullnameUpdate,
} from "./user-update.reducer";

@Injectable()
export class UserUpdateEffects {
  loadUserToUpdate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadUserToUpdate),
      mergeMap((action) =>
        (!action.targetUsername
          ? this.store.select(selectCurrentUserInfo)
          : this.api.getUser(action.targetUsername).pipe(
              map(
                (response) =>
                  ({
                    username: response.username,
                    userFullName: response.name,
                    isAdmin: response.isAdmin,
                  } as IUserInfo)
              )
            )
        ).pipe(
          map((userInfo) =>
            userToUpdateLoaded({
              ...userInfo,
            })
          ),
          catchBeError()
        )
      )
    )
  );

  updatePassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateUserPassword),
      exhaustMap((action) =>
        (!action.targetUsername
          ? this.api.updateCurrentUser({ password: action.newPassword })
          : this.api.updateUser(
              {
                password: action.newPassword,
              },
              action.targetUsername
            )
        ).pipe(
          map((response) =>
            response.success
              ? userUpdatePasswordSuccessful()
              : userUpdateFailed()
          ),
          catchBeError()
        )
      )
    )
  );

  updateFullName$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateUserFullName),
      exhaustMap((action) =>
        (!action.targetUsername
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
          ),
          catchBeError()
        )
      )
    )
  );

  validateFullnameUpdate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(validateUserFullnameUpdate),
      mergeMap((action) =>
        this.api.validateUserUpdate({ name: action.newFullName }).pipe(
          map((response) =>
            userFullnameUpdateValidated({
              userFullNameUpdateValidationError: response.validationError,
            })
          ),
          catchBeError()
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private api: DefaultService,
    private store: Store
  ) {}
}
