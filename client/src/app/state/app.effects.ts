import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { tap } from "rxjs/operators";
import { NotificationsService } from "../services/notifications.service";
import { beFailed } from "./app.reducer";

@Injectable()
export class AppEffects {
  beFailed$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(beFailed),
        tap((action) =>
          this.notifications.showNotification(action.errorResponse.message)
        )
      ),
    {
      dispatch: false,
    }
  );

  constructor(
    private actions$: Actions,
    private notifications: NotificationsService
  ) {}
}
