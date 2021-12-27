import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { exhaustMap, map, mergeMap, tap } from "rxjs/operators";
import { DefaultService } from "src/app/api/api/default.service";
import { StaticPath } from "src/app/routing/paths";
import { NotificationsService } from "src/app/services/notifications.service";

import { logout } from "../../auth/auth.actions";
import { selectCurrentUserInfo } from "../../auth/auth.selectors";
import { catchBeError } from "../../utils/errors.utils";
import {
  currentUserDeletionSuccessful,
  currentUserEmailUpdateSuccessful,
  currentUserFullNameUpdateSuccessful,
  deleteUser,
  loadUserToUpdate,
  updateUserEmail,
  updateUserFullName,
  updateUserPassword,
  updateUserRole,
  userDeletionFailed,
  userDeletionSuccessful,
  userEmailUpdateSuccessful,
  userFullNameUpdateSuccessful,
  userPasswordUpdateSuccessful,
  userRoleUpdateSuccessful,
  userToUpdateLoaded,
  userUpdateFailed,
} from "./user-update.actions";

@Injectable()
export class UserUpdateEffects {
  loadUserToUpdate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadUserToUpdate),
      concatLatestFrom((action) =>
        action.targetUserId
          ? of(undefined)
          : this.store.select(selectCurrentUserInfo)
      ),
      mergeMap(([action, currentUser]) =>
        (currentUser
          ? of(currentUser)
          : this.api.getUser(action.targetUserId)
        ).pipe(
          map((user) =>
            userToUpdateLoaded({
              ...user,
            })
          ),
          catchBeError()
        )
      )
    )
  );

  updateUserRole$ = createEffect(() =>
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
            !response.error
              ? userRoleUpdateSuccessful()
              : userUpdateFailed({ error: response.error })
          ),
          catchBeError()
        )
      )
    )
  );

  updateUserEmail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateUserEmail),
      exhaustMap((action) =>
        !action.targetUserId
          ? this.api.updateCurrentUser({ email: action.newEmail }).pipe(
              map((response) =>
                !response.error
                  ? currentUserEmailUpdateSuccessful({
                      email: action.newEmail,
                    })
                  : userUpdateFailed({ error: response.error })
              ),
              catchBeError()
            )
          : this.api
              .updateUser(
                {
                  email: action.newEmail,
                },
                action.targetUserId
              )
              .pipe(
                map((response) =>
                  !response.error
                    ? userEmailUpdateSuccessful()
                    : userUpdateFailed({ error: response.error })
                ),
                catchBeError()
              )
      )
    )
  );

  updateUserFullName$ = createEffect(() =>
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
                  : userUpdateFailed({ error: response.error })
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
                    ? userFullNameUpdateSuccessful()
                    : userUpdateFailed({ error: response.error })
                ),
                catchBeError()
              )
      )
    )
  );

  updateUserPassword$ = createEffect(() =>
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
              : userUpdateFailed({ error: response.error })
          ),
          catchBeError()
        )
      )
    )
  );

  userPasswordUpdateSuccessful$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(userPasswordUpdateSuccessful),
        tap(() =>
          this.notifications.showNotification("Password successfully updated")
        )
      ),
    {
      dispatch: false,
    }
  );

  userUpdateFailed$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(userUpdateFailed),
        tap((action) =>
          this.notifications.showNotification(
            `User update failed: ${action.error}`
          )
        )
      ),
    {
      dispatch: false,
    }
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
                  : userDeletionFailed({ error: response.error })
              ),
              catchBeError()
            )
          : this.api.removeUser(action.targetUserId).pipe(
              map((response) =>
                !response.error
                  ? userDeletionSuccessful()
                  : userDeletionFailed({ error: response.error })
              ),
              catchBeError()
            )
      )
    )
  );

  currentUserDeletionSuccessful$ = createEffect(() =>
    this.actions$.pipe(
      ofType(currentUserDeletionSuccessful),
      tap(() =>
        this.notifications.showNotification(
          "Your account has been deleted successfully"
        )
      ),
      mergeMap((_) => of(logout()))
    )
  );

  userDeletionSuccessful$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(userDeletionSuccessful),
        tap(() => this.router.navigateByUrl(StaticPath.usersList)),
        tap(() =>
          this.notifications.showNotification(
            "User has been deleted successfully"
          )
        )
      ),
    {
      dispatch: false,
    }
  );

  userDeletionFailed$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(userDeletionFailed),
        tap((action) =>
          this.notifications.showNotification(
            `User deletion failed: ${action.error}`
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
    private router: Router,
    private store: Store,
    private notifications: NotificationsService
  ) {}
}
