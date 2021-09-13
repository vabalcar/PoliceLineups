import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { Store } from "@ngrx/store";
import { LoginAction, LoginFailedAction, LogoutAction } from "./auth.reducer";
import { DefaultService } from "./api/api/default.service";
import { Action } from "@ngrx/store";
import * as fromAuth from "./auth.reducer";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private token$: Observable<string>;

  get isLoggedIn(): boolean {
    return this.api.configuration.accessToken !== undefined;
  }

  constructor(
    private router: Router,
    private store: Store<fromAuth.AppState>,
    private api: DefaultService
  ) {
    this.token$ = this.store.select(fromAuth.selectAuthToken);

    this.token$.subscribe((value) => {
      this.api.configuration.accessToken = value;
    });
  }

  canAccess(path: string): boolean {
    return this.isLoggedIn;
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
          ? new LoginAction(response.authToken)
          : new LoginFailedAction();

        this.store.dispatch(action);
        this.router.navigateByUrl(response.path);
      });
  }

  logout(): void {
    this.store.dispatch(new LogoutAction());
  }
}
