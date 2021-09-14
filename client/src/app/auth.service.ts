import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable } from "rxjs";
import { Store } from "@ngrx/store";
import { loginAction, loginFailedAction, logoutAction } from "./auth.reducer";
import { DefaultService } from "./api/api/default.service";
import { Action } from "@ngrx/store";
import * as fromAuth from "./auth.reducer";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private static readonly redirectedLoginUrlPrefix = "/login";

  readonly isLoggedIn$: Observable<boolean>;
  readonly isAdmin$: Observable<boolean>;

  private readonly token$: Observable<string>;

  private readonly isLoggedInSubject$: BehaviorSubject<boolean> =
    new BehaviorSubject(false);
  private readonly isAdminSubject$: BehaviorSubject<boolean> =
    new BehaviorSubject(false);
  private readonly tokenSubject$: BehaviorSubject<string> = new BehaviorSubject(
    null
  );

  get isLoggedIn(): boolean {
    return this.isLoggedInSubject$.getValue();
  }

  get isAdmin(): boolean {
    return this.isAdminSubject$.getValue();
  }

  constructor(
    private router: Router,
    private store: Store<fromAuth.AppState>,
    private api: DefaultService
  ) {
    this.token$ = this.store.select(fromAuth.selectAuthToken);
    this.token$.subscribe(this.tokenSubject$);

    this.isAdmin$ = this.store.select(fromAuth.selectAuthIsAdmin);
    this.isAdmin$.subscribe(this.isAdminSubject$);

    this.isLoggedIn$ = this.isLoggedInSubject$.asObservable();

    this.tokenSubject$.subscribe((value) => {
      this.isLoggedInSubject$.next(!!value);
      this.api.configuration.accessToken = value;
    });
  }

  canAccess(path: string, adminRoleNeeded: boolean): boolean {
    const canAccess = (!adminRoleNeeded || this.isAdmin) && this.isLoggedIn;
    if (!canAccess) {
      this.router.navigateByUrl(`/login/${path}`);
    }
    return canAccess;
  }

  login(username: string, password: string): void {
    const targetPath = this.getTargetPath();
    this.api
      .login({
        username,
        password,
      })
      .subscribe((response) => {
        const action: Action = response.success
          ? loginAction({
              token: response.authToken,
              isAdmin: response.isAdmin,
            })
          : loginFailedAction();

        this.store.dispatch(action);
        this.router.navigateByUrl(targetPath);
      });
  }

  logout(): void {
    this.store.dispatch(logoutAction());
  }

  private getTargetPath() {
    const url = this.router.url;
    return url.startsWith(AuthService.redirectedLoginUrlPrefix) &&
      url.length !== AuthService.redirectedLoginUrlPrefix.length
      ? url.substring(AuthService.redirectedLoginUrlPrefix.length)
      : "/";
  }
}
