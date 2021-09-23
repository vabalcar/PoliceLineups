import { Component } from "@angular/core";
import { Store } from "@ngrx/store";
import { tap } from "rxjs/operators";

import { AppState } from "src/app/state/app.reducer";
import {
  logoutAction,
  selectAuthIsAdmin,
  selectAuthUserFullName,
  selectIsLoggedIn,
  selectIsLoggedOut,
} from "src/app/state/auth/auth.reducer";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  isLoggedIn$ = this.store.select(selectIsLoggedIn);
  isLoggedOut$ = this.store.select(selectIsLoggedOut).pipe(
    tap((isLoggedOut) => {
      if (this.drawerOpened && isLoggedOut) {
        this.drawerOpened = false;
      }
    })
  );
  isAdminLoggedIn$ = this.store.select(selectAuthIsAdmin);
  userFullName$ = this.store.select(selectAuthUserFullName);

  drawerOpened = false;

  constructor(private store: Store<AppState>) {}

  logout() {
    this.store.dispatch(logoutAction());
  }
}
