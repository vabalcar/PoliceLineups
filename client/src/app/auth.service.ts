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
  readonly isLoggedIn$;

  private token$: Observable<string>;
  private isLoggedInSubject$: BehaviorSubject<boolean> = new BehaviorSubject(
    false
  );

  get isLoggedIn(): boolean {
    return this.isLoggedInSubject$.getValue();
  }

  constructor(
    private router: Router,
    private store: Store<fromAuth.AppState>,
    private api: DefaultService
  ) {
    this.isLoggedIn$ = this.isLoggedInSubject$.asObservable();
    this.token$ = this.store.select(fromAuth.selectAuthToken);
    this.token$.subscribe((value) => {
      this.api.configuration.accessToken = value;
      this.isLoggedInSubject$.next(!!value);
    });
  }

  canAccess(path: string): boolean {
    const loggedIn = this.isLoggedIn;
    if (!loggedIn) {
      this.router.navigateByUrl(`/login/${path}`);
    }
    return loggedIn;
  }

  login(username: string, password: string, path: string): void {
    this.api
      .login({
        username,
        password,
        path,
      })
      .subscribe((response) => {
        const action: Action = response.success
          ? loginAction({ token: response.authToken })
          : loginFailedAction();

        this.store.dispatch(action);
        this.router.navigateByUrl(response.path);
      });
  }

  logout(): void {
    this.store.dispatch(logoutAction());
  }
}
