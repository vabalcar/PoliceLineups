import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { tap } from "rxjs/operators";

import { StaticPath } from "../routing/paths";
import { NotificationsService } from "../services/notifications/notifications.service";
import { beFailed } from "./app.actions";

@Injectable()
export class AppEffects {
  beFailed$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(beFailed),
        tap((action) =>
          this.notifications.showNotification(action.errorResponse.message)
        ),
        tap((action) => {
          if (action.errorResponse.status === 404) {
            this.router.navigateByUrl(StaticPath.resourceNotFound);
          }
        })
      ),
    {
      dispatch: false,
    }
  );

  constructor(
    private actions$: Actions,
    private notifications: NotificationsService,
    private router: Router
  ) {}
}
