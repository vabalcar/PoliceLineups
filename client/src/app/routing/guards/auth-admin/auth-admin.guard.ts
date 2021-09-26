import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

import { AppState } from "src/app/state/app.reducer";
import { selectCurrentUserIsAdmin } from "src/app/state/auth/auth.reducer";

@Injectable({
  providedIn: "root",
})
export class AdminAuthGuard implements CanActivate {
  isAdminLoggedIn$ = this.store
    .select(selectCurrentUserIsAdmin)
    .pipe(
      tap(
        (authorized) =>
          !authorized && this.router.navigateByUrl("/not-authorized")
      )
    );

  constructor(private store: Store<AppState>, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.isAdminLoggedIn$;
  }
}
