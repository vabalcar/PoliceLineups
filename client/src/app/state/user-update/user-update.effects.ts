import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { exhaustMap, map, mergeMap } from "rxjs/operators";
import { DefaultService } from "src/app/api/api/default.service";
import { selectCurrentUserInfo } from "../auth/auth.selectors";
import { catchBeError } from "../utils/errors.utils";
import { IUserInfo } from "../utils/user-info";
import {
  loadUserToUpdate,
  userToUpdateLoaded,
  updateUserPassword,
  userUpdatePasswordSuccessful,
  userUpdateFailed,
  updateUserFullName,
  currentUserFullNameUpdateSuccessful,
  userFullNameUpdateSucessful,
  validateUserFullnameUpdate,
  userFullnameUpdateValidated,
} from "./user-update.actions";

@Injectable()
export class UserUpdateEffects {
  loadUserToUpdate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadUserToUpdate),
      mergeMap((action) =>
        (!action.targetUserId
          ? this.store.select(selectCurrentUserInfo)
          : this.api.getUser(action.targetUserId).pipe(
              map(
                (response) =>
                  ({
                    userId: action.targetUserId,
                    username: response.username,
                    isAdmin: response.isAdmin,
                    fullName: response.fullName,
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
        (!action.targetUserId
          ? this.api.updateCurrentUser({ password: action.newPassword })
          : this.api.updateUser(
              {
                password: action.newPassword,
              },
              action.targetUserId
            )
        ).pipe(
          map((response) =>
            !response.error
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
        (!action.targetUserId
          ? this.api.updateCurrentUser({ fullName: action.newFullName })
          : this.api.updateUser(
              {
                fullName: action.newFullName,
              },
              action.targetUserId
            )
        ).pipe(
          map((response) =>
            !response.error
              ? !action.targetUserId
                ? currentUserFullNameUpdateSuccessful({
                    fullName: action.newFullName,
                  })
                : userFullNameUpdateSucessful({
                    fullName: action.newFullName,
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
        this.api.validateUserUpdate({ fullName: action.newFullName }).pipe(
          map((response) =>
            userFullnameUpdateValidated({
              userFullNameUpdateValidationError: response.error,
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
