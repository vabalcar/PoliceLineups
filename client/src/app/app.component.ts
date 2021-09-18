import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import {
  AppState,
  logoutAction,
  selectAuthIsAdmin,
  selectAuthUserFullName,
  selectIsLoggedIn,
  selectIsLoggedOut,
} from "./auth.reducer";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  isLoggedIn$ = this.store.select(selectIsLoggedIn);
  isLoggedOut$ = this.store.select(selectIsLoggedOut);
  isAdminLoggedIn$ = this.store.select(selectAuthIsAdmin);
  userFullName$ = this.store.select(selectAuthUserFullName);

  constructor(private store: Store<AppState>) {}

  ngOnInit() {}

  logout() {
    this.store.dispatch(logoutAction());
  }
}
