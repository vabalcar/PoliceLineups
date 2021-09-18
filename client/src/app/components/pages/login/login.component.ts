import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";

import { AppState } from "src/app/state/app.reducer";
import { loginAction } from "src/app/state/auth/auth.reducer";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  username?: string;
  password?: string;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {}

  login(event: Event): void {
    event.preventDefault();

    this.store.dispatch(
      loginAction({ username: this.username, password: this.password })
    );

    this.username = undefined;
    this.password = undefined;
  }
}
