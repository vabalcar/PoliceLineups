import { Component } from "@angular/core";
import { Store } from "@ngrx/store";
import { combineLatest, Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { StaticPath } from "src/app/routing/paths";
import { AppState } from "src/app/state/app.state";
import { logout } from "src/app/state/auth/auth.actions";
import {
  selectCurrentUserFullName,
  selectCurrentUserIsAdmin,
  selectIsLoggedIn,
} from "src/app/state/auth/auth.selectors";
import { environment } from "src/environments/environment";

interface IAppComponentData {
  isLoggedIn?: boolean;
  isAdmin?: boolean;
  fullName?: string;
}

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  drawerOpened = false;

  readonly staticPath = StaticPath;

  readonly appComponentData$: Observable<IAppComponentData>;

  private readonly isLoggedIn$: Observable<boolean>;
  private readonly isAdmin$: Observable<boolean>;
  private readonly fullName$: Observable<string>;

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

    this.appComponentData$ = combineLatest([
      this.isLoggedIn$,
      this.isAdmin$,
      this.fullName$,
    ]).pipe(
      map(([isLoggedIn, isAdmin, fullName]) => ({
        isLoggedIn,
        isAdmin,
        fullName,
      }))
    );
  }

  logout(): void {
    this.store.dispatch(logout());
  }

  openServerAdministrationPanel(): void {
    window.location.assign(environment.externalApps.serverAdministrationPanel);
  }
}
