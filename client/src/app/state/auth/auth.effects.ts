import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import {
  Actions,
  concatLatestFrom,
  createEffect,
  ofType,
  OnInitEffects,
} from "@ngrx/effects";
import { Action, Store } from "@ngrx/store";
import { exhaustMap, filter, map, tap } from "rxjs/operators";
import { DefaultService } from "src/app/api/api/default.service";
import { NotificationsService } from "src/app/services/notifications.service";
import { AppState } from "../app.reducer";
import { convertToLocalDateTime } from "../utils/date.utils";
import { catchBeError } from "../utils/errors.utils";
import { HttpStatusCode } from "../utils/http-status-code.utils";
import {
  loginAction,
  loginFailedAction,
  loginSuccessfulAction,
  logoutAction,
  renewInitTokenAction,
  renewTokenAction,
  selectAuthToken,
  tokenRenewed,
} from "./auth.reducer";
import { AuthTokenRenewalScheduler } from "./auth.utils";

@Injectable()
export class AuthEffects implements OnInitEffects {
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loginAction),
      exhaustMap((action) =>
        this.api
          .login({ username: action.username, password: action.password })
          .pipe(
            map((authResponse) =>
              authResponse.success
                ? loginSuccessfulAction({
                    userId: authResponse.userId,
                    username: action.username,
                    token: authResponse.authToken,
                    tokenExpirationDatetime: convertToLocalDateTime(
                      authResponse.tokenExpirationDatetime
                    ),
                    fullName: authResponse.userFullName,
                    isAdmin: !!authResponse.isAdmin,
                  })
                : loginFailedAction()
            ),
            catchBeError()
          )
      )
    )
  );

  loginSuccessful$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loginSuccessfulAction),
        tap((action) =>
          this.authTokenRenewalScheduler.scheduleAuthRenewal(
            action.tokenExpirationDatetime
          )
        ),
        tap(() => this.router.navigateByUrl("/"))
      ),
    {
      dispatch: false,
    }
  );

  renewInitAuthToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(renewInitTokenAction),
      concatLatestFrom(() => this.store.select(selectAuthToken)),
      filter(([, token]) => !!token),
      map(() => renewTokenAction())
    )
  );

  renewAuthToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(renewTokenAction),
      exhaustMap(() =>
        this.api.renewAuthToken().pipe(
          map((response) =>
            tokenRenewed({
              token: response.authToken,
              tokenExpirationDatetime: convertToLocalDateTime(
                response.tokenExpirationDatetime
              ),
            })
          ),
          tap((action) =>
            this.authTokenRenewalScheduler.scheduleAuthRenewal(
              action.tokenExpirationDatetime
            )
          ),
          catchBeError(HttpStatusCode.Unauthorized, () => logoutAction()),
          catchBeError()
        )
      )
    )
  );

  loginFailed$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loginFailedAction),
        tap(() => this.notifications.showNotification("Login failed"))
      ),
    {
      dispatch: false,
    }
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(logoutAction),
        tap(() => this.authTokenRenewalScheduler.cancelScheduledAuthRenewal()),
        tap(() => this.router.navigateByUrl("/")),
        tap(() =>
          this.notifications.showNotification("You have been logged out")
        )
      ),
    {
      dispatch: false,
    }
  );

  setTokenForApiCalls = this.store
    .select(selectAuthToken)
    .subscribe((token) => (this.api.configuration.accessToken = token));

  private authTokenRenewalScheduler: AuthTokenRenewalScheduler;

  constructor(
    private actions$: Actions,
    private api: DefaultService,
    private router: Router,
    private store: Store<AppState>,
    private notifications: NotificationsService
  ) {
    this.authTokenRenewalScheduler = new AuthTokenRenewalScheduler(store);
  }

  ngrxOnInitEffects(): Action {
    return renewInitTokenAction();
  }
}
