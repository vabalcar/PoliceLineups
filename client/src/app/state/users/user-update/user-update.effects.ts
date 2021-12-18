import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { exhaustMap, map, mergeMap, tap } from "rxjs/operators";
import { DefaultService } from "src/app/api/api/default.service";
import { StaticPath } from "src/app/routing/paths";

import { logoutAction } from "../../auth/auth.actions";
import { selectCurrentUserInfo } from "../../auth/auth.selectors";
import { catchBeError } from "../../utils/errors.utils";
import { IUserInfo } from "../utils/IUserInfo";
import {
  currentUserDeletionSuccessful,
  currentUserFullNameUpdateSuccessful,
  deleteUser,
  loadUserToUpdate,
  updateUserFullName,
  updateUserPassword,
  updateUserRole,
  userDeletionFailed,
  userDeletionSuccessful,
  userFullNameUpdateSuccessful,
  userToUpdateLoaded,
  userUpdateFailed,
  userPasswordUpdateSuccessful,
  userRoleUpdateSuccessful,
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

  updateFullName$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateUserFullName),
      exhaustMap((action) =>
        !action.targetUserId
          ? this.api.updateCurrentUser({ fullName: action.newFullName }).pipe(
              map((response) =>
                !response.error
                  ? currentUserFullNameUpdateSuccessful({
                      fullName: action.newFullName,
                    })
                  : userUpdateFailed()
              ),
              catchBeError()
            )
          : this.api
              .updateUser(
                {
                  fullName: action.newFullName,
                },
                action.targetUserId
              )
              .pipe(
                map((response) =>
                  !response.error
                    ? userFullNameUpdateSuccessful({
                        fullName: action.newFullName,
                      })
                    : userUpdateFailed()
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
              ? userPasswordUpdateSuccessful()
              : userUpdateFailed()
          ),
          catchBeError()
        )
      )
    )
  );

  updateRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateUserRole),
      exhaustMap((action) =>
        (!action.targetUserId
          ? this.api.updateCurrentUser({ isAdmin: action.isAdmin })
          : this.api.updateUser(
              {
                isAdmin: action.isAdmin,
              },
              action.targetUserId
            )
        ).pipe(
          map((response) =>
            !response.error ? userRoleUpdateSuccessful() : userUpdateFailed()
          ),
          catchBeError()
        )
      )
    )
  );

  deleteUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteUser),
      exhaustMap((action) =>
        !action.targetUserId
          ? this.api.removeCurrentUser().pipe(
              map((response) =>
                !response.error
                  ? currentUserDeletionSuccessful()
                  : userDeletionFailed()
              ),
              catchBeError()
            )
          : this.api.removeUser(action.targetUserId).pipe(
              map((response) =>
                !response.error
                  ? userDeletionSuccessful()
                  : userDeletionFailed()
              ),
              catchBeError()
            )
      )
    )
  );

  logoutOnCurrentUserDeletionSuccessful$ = createEffect(() =>
    this.actions$.pipe(
      ofType(currentUserDeletionSuccessful),
      mergeMap((_) => of(logoutAction()))
    )
  );

  redirectToUsersListOnUserDeletionSuccessful$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(userDeletionSuccessful),
        tap(() => this.router.navigateByUrl(StaticPath.users))
      ),
    {
      dispatch: false,
    }
  );

  constructor(
    private actions$: Actions,
    private api: DefaultService,
    private router: Router,
    private store: Store
  ) {}
}
