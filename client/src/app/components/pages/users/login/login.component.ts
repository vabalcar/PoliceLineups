import { Component } from "@angular/core";
import { Store } from "@ngrx/store";

import { AppState } from "src/app/state/app.reducer";
import {
  loginAction,
  selectLoginFailedCount,
} from "src/app/state/auth/auth.reducer";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
})
export class LoginComponent {
  username?: string;
  password?: string;

  loginFailedCountSubScription = this.store
    .select(selectLoginFailedCount)
    .subscribe((count) => {
      if (count > 0) {
        this.username = undefined;
        this.password = undefined;
      }
    });

  constructor(private store: Store<AppState>) {}

  login(): void {
    if (!this.username || !this.password) {
      return;
    }

    this.store.dispatch(
      loginAction({ username: this.username, password: this.password })
    );
  }
}
