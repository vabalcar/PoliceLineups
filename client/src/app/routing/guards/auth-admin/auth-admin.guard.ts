import { Injectable } from "@angular/core";
import { CanActivate } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";

import { AppState } from "src/app/state/app.reducer";
import { selectAuthIsAdmin } from "src/app/state/auth/auth.reducer";

@Injectable({
  providedIn: "root",
})
export class AdminAuthGuard implements CanActivate {
  isAdminLoggedIn$ = this.store.select(selectAuthIsAdmin);

  constructor(private store: Store<AppState>) {}

  canActivate(): Observable<boolean> {
    return this.isAdminLoggedIn$;
  }
}
