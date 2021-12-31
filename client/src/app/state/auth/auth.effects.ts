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
import { StaticPath } from "src/app/routing/paths";
import { NotificationsService } from "src/app/services/notifications/notifications.service";

import { AppState } from "../app.state";
import { convertToLocalDateTime } from "../utils/date.utils";
import { catchBeError } from "../utils/errors.utils";
import { HttpStatusCode } from "../utils/HttpStatusCode";
import {
  login,
  loginFailed,
  loginSuccessful,
  logout,
  renewInitToken,
  renewToken,
  tokenRenewed,
} from "./auth.actions";
import { selectToken } from "./auth.selectors";
import { TokenRenewalScheduler } from "./utils/TokenRenewalScheduler";

@Injectable()
export class AuthEffects implements OnInitEffects {
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(login),
      exhaustMap((action) =>
        this.api
          .login({ username: action.username, password: action.password })
          .pipe(
            map((response) =>
              !response.error
                ? loginSuccessful({
                    userId: response.userId,
                    username: action.username,
                    isAdmin: !!response.isAdmin,
                    email: response.email,
                    fullName: response.fullName,
                    token: response.authToken,
                    tokenExpirationDatetime: convertToLocalDateTime(
                      response.tokenExpirationDatetime
                    ),
                  })
                : loginFailed({ error: response.error })
            ),
            catchBeError()
          )
      )
    )
  );

  loginSuccessful$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loginSuccessful),
        tap((action) =>
          this.authTokenRenewalScheduler.scheduleTokenRenewal(
            action.tokenExpirationDatetime
          )
        ),
        tap(() => this.router.navigateByUrl(StaticPath.home))
      ),
    {
      dispatch: false,
    }
  );

  loginFailed$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loginFailed),
        tap((action) =>
          this.notifications.showNotification(`Login failed: ${action.error}`)
        )
      ),
    {
      dispatch: false,
    }
  );

  renewInitToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(renewInitToken),
      concatLatestFrom(() => this.store.select(selectToken)),
      filter(([, token]) => !!token),
      map(() => renewToken())
    )
  );

  renewToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(renewToken),
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
            this.authTokenRenewalScheduler.scheduleTokenRenewal(
              action.tokenExpirationDatetime
            )
          ),
          catchBeError(HttpStatusCode.Unauthorized, () => logout()),
          catchBeError()
        )
      )
    )
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(logout),
        tap(() => this.authTokenRenewalScheduler.cancelScheduledTokenRenewal()),
        tap(() => this.router.navigateByUrl(StaticPath.login)),
        tap(() =>
          this.notifications.showNotification("You have been logged out")
        )
      ),
    {
      dispatch: false,
    }
  );

  setTokenForApiCalls = this.store
    .select(selectToken)
    .subscribe((token) => (this.api.configuration.accessToken = token));

  private authTokenRenewalScheduler: TokenRenewalScheduler;

  constructor(
    private actions$: Actions,
    private api: DefaultService,
    private router: Router,
    private store: Store<AppState>,
    private notifications: NotificationsService
  ) {
    this.authTokenRenewalScheduler = new TokenRenewalScheduler(store);
  }

  ngrxOnInitEffects(): Action {
    return renewInitToken();
  }
}
