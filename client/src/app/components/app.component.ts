import { Component } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { StaticPath } from "../routing/paths";
import { AppState } from "../state/app.state";

import { logoutAction } from "../state/auth/auth.actions";
import {
  selectCurrentUserFullName,
  selectCurrentUserIsAdmin,
  selectIsLoggedIn,
} from "../state/auth/auth.selectors";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  drawerOpened = false;

  readonly staticPath = StaticPath;

  readonly isLoggedIn$: Observable<boolean>;
  readonly isAdmin$: Observable<boolean>;
  readonly fullName$: Observable<string>;

  constructor(private store: Store<AppState>) {
    this.isLoggedIn$ = this.store.select(selectIsLoggedIn).pipe(
      tap((isLoggedIn) => {
        if (!isLoggedIn && this.drawerOpened) {
          this.drawerOpened = false;
        }
      })
    );

    this.isAdmin$ = this.store.select(selectCurrentUserIsAdmin);
    this.fullName$ = this.store.select(selectCurrentUserFullName);
  }

  logout() {
    this.store.dispatch(logoutAction());
  }
}
