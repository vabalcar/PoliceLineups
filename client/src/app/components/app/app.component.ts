import { Component } from "@angular/core";
import { Store } from "@ngrx/store";
import { combineLatest, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { StaticPath } from "src/app/routing/paths";
import { AppState } from "src/app/state/app.state";
import { logout } from "src/app/state/auth/auth.actions";
import {
  selectCurrentUserFullName,
  selectCurrentUserIsAdmin,
  selectIsLoggedIn,
} from "src/app/state/auth/auth.selectors";
import { toggleMenuDrawer } from "src/app/state/menu/menu.actions";
import { selectIsMenuDrawerOpened } from "src/app/state/menu/menu.selectors";
import { environment } from "src/environments/environment";

interface AppComponentData {
  isLoggedIn?: boolean;
  isAdmin?: boolean;
  fullName?: string;
  isMenuDrawerOpened: boolean;
}

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  readonly staticPath = StaticPath;

  readonly appComponentData$: Observable<AppComponentData>;

  private readonly isLoggedIn$: Observable<boolean>;
  private readonly isAdmin$: Observable<boolean>;
  private readonly fullName$: Observable<string>;
  private readonly isDrawerMenuOpened$: Observable<boolean>;

  constructor(private store: Store<AppState>) {
    this.isLoggedIn$ = this.store.select(selectIsLoggedIn);
    this.isAdmin$ = this.store.select(selectCurrentUserIsAdmin);
    this.fullName$ = this.store.select(selectCurrentUserFullName);
    this.isDrawerMenuOpened$ = this.store.select(selectIsMenuDrawerOpened);

    this.appComponentData$ = combineLatest([
      this.isLoggedIn$,
      this.isAdmin$,
      this.fullName$,
      this.isDrawerMenuOpened$,
    ]).pipe(
      map(([isLoggedIn, isAdmin, fullName, isMenuDrawerOpened]) => ({
        isLoggedIn,
        isAdmin,
        fullName,
        isMenuDrawerOpened,
      }))
    );
  }

  toggleMenuDrawer(): void {
    this.store.dispatch(toggleMenuDrawer());
  }

  logout(): void {
    this.store.dispatch(logout());
  }

  openServerAdministrationPanel(): void {
    window.location.assign(environment.externalApps.serverAdministrationPanel);
  }
}
