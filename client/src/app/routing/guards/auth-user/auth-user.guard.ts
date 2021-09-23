import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

import { AppState } from "src/app/state/app.reducer";
import { selectIsLoggedIn } from "src/app/state/auth/auth.reducer";

@Injectable({
  providedIn: "root",
})
export class UserAuthGuard implements CanActivate {
  isLoggedIn$ = this.store
    .select(selectIsLoggedIn)
    .pipe(
      tap(
        (authorized) =>
          !authorized && this.router.navigateByUrl("/not-authorized")
      )
    );

  constructor(private store: Store<AppState>, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.isLoggedIn$;
  }
}
