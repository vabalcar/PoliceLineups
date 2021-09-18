import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { tap } from "rxjs/operators";

import { AppState } from "src/app/state/app.reducer";
import {
  loginAction,
  selectLoginFailedCount,
} from "src/app/state/auth/auth.reducer";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
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

  ngOnInit(): void {}

  login(event: Event): void {
    event.preventDefault();

    this.store.dispatch(
      loginAction({ username: this.username, password: this.password })
    );
  }
}
