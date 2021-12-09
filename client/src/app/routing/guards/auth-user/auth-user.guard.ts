import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/state/app.state";

import { selectIsLoggedIn } from "src/app/state/auth/auth.selectors";
import { ObservableAuthGuard } from "../auth-observable.guard";

@Injectable({
  providedIn: "root",
})
export class UserAuthGuard extends ObservableAuthGuard {
  constructor(protected router: Router, private store: Store<AppState>) {
    super(router, store.select(selectIsLoggedIn));
  }
}
