import { Injectable } from "@angular/core";
import { CanActivate } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { AppState, selectIsLoggedIn } from "./auth.reducer";

@Injectable({
  providedIn: "root",
})
export class UserAuthGuard implements CanActivate {
  isLoggedIn$ = this.store.select(selectIsLoggedIn);

  constructor(private store: Store<AppState>) {}

  canActivate(): Observable<boolean> {
    return this.isLoggedIn$;
  }
}
