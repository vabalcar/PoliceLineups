import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { exhaustMap, map, tap } from "rxjs/operators";
import { DefaultService } from "./api/api/default.service";
import {
  loginAction,
  loginActionType,
  loginFailedAction,
  loginSuccessfulAction,
  logoutAction,
} from "./auth.reducer";

@Injectable()
export class AuthEffects {
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
                    token: authResponse.authToken,
                    userFullName: authResponse.userFullName,
                    isAdmin: !!authResponse.isAdmin,
                  })
                : loginFailedAction()
            )
          )
      )
    )
  );

  loginSuccessful$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loginSuccessfulAction),
        tap((action) => (this.api.configuration.accessToken = action.token)),
        tap(() => this.router.navigateByUrl(this.getTargetPath()))
      ),
    {
      dispatch: false,
    }
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(logoutAction),
        tap(() => (this.api.configuration.accessToken = undefined)),
        tap(() => this.router.navigateByUrl("/"))
      ),
    {
      dispatch: false,
    }
  );

  constructor(
    private actions$: Actions,
    private api: DefaultService,
    private router: Router
  ) {}

  private getTargetPath() {
    const redirectedLoginUrlPrefix = "/login";
    const url = this.router.url;
    return url.startsWith(redirectedLoginUrlPrefix) &&
      url.length !== redirectedLoginUrlPrefix.length
      ? url.substring(redirectedLoginUrlPrefix.length)
      : "/";
  }
}
