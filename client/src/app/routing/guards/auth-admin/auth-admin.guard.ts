import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";

import { AppState } from "src/app/state/app.reducer";
import { selectCurrentUserIsAdmin } from "src/app/state/auth/auth.reducer";
import { ObservableAuthGuard } from "../auth-observable.guard";

@Injectable({
  providedIn: "root",
})
export class AdminAuthGuard extends ObservableAuthGuard {
  constructor(protected router: Router, private store: Store<AppState>) {
    super(router, store.select(selectCurrentUserIsAdmin));
  }
}
