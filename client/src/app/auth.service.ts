import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable, of } from "rxjs";
import { Store } from "@ngrx/store";
import { loginAction, loginFailedAction, logoutAction } from "./auth.reducer";
import { DefaultService } from "./api/api/default.service";
import * as fromAuth from "./auth.reducer";
import { map, tap } from "rxjs/operators";
import { AuthResponse } from "./api/model/authResponse";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private static readonly redirectedLoginUrlPrefix = "/login";

  readonly isLoggedIn$: Observable<boolean>;
  readonly isAdmin$: Observable<boolean>;
  readonly userFullName$: Observable<string>;

  private readonly token$: Observable<string>;

  private readonly isLoggedInSubject$: BehaviorSubject<boolean> =
    new BehaviorSubject(false);
  private readonly isAdminSubject$: BehaviorSubject<boolean> =
    new BehaviorSubject(false);
  private readonly userFullNameSubject$: BehaviorSubject<string> =
    new BehaviorSubject(null);
  private readonly tokenSubject$: BehaviorSubject<string> = new BehaviorSubject(
    null
  );

  get isLoggedIn(): boolean {
    return this.isLoggedInSubject$.getValue();
  }

  get isAdmin(): boolean {
    return this.isAdminSubject$.getValue();
  }

  get userFullName(): string {
    return this.userFullNameSubject$.getValue();
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

    this.userFullName$ = this.store.select(fromAuth.selectAuthUserFullName);
    this.userFullName$.subscribe(this.userFullNameSubject$);

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

  login(username: string, password: string): Observable<boolean> {
    const targetPath = this.getTargetPath();
    return this.api
      .login({
        username,
        password,
      })
      .pipe(
        tap((response) => {
          if (!response.success) {
            this.store.dispatch(loginFailedAction());
            return;
          }

          this.store.dispatch(
            loginAction({
              token: response.authToken,
              isAdmin: response.isAdmin,
              userFullName: response.userFullName,
            })
          );
          this.router.navigateByUrl(targetPath);
        })
      )
      .pipe(map((response) => response.success));
  }

  logout(): void {
    this.store.dispatch(logoutAction());
    this.router.navigateByUrl("/home");
  }

  private getTargetPath() {
    const url = this.router.url;
    return url.startsWith(AuthService.redirectedLoginUrlPrefix) &&
      url.length !== AuthService.redirectedLoginUrlPrefix.length
      ? url.substring(AuthService.redirectedLoginUrlPrefix.length)
      : "/";
  }
}
