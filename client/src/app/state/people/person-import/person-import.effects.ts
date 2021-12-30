import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { exhaustMap, map, tap } from "rxjs/operators";
import { DefaultService } from "src/app/api/api/default.service";
import { NotificationsService } from "src/app/services/notifications.service";

import { catchBeError } from "../../utils/errors.utils";
import {
  importPerson,
  personImportFailed,
  personImportSuccessful,
} from "./person-import.actions";

@Injectable()
export class PersonImportEffects {
  importPerson$ = createEffect(() =>
    this.actions$.pipe(
      ofType(importPerson),
      exhaustMap((action) =>
        this.api
          .addPersonForm(
            action.fullName,
            action.birthDate,
            action.nationality,
            action.photoFile
          )
          .pipe(
            map((response) =>
              !response.error
                ? personImportSuccessful()
                : personImportFailed({ error: response.error })
            ),
            catchBeError()
          )
      )
    )
  );

  personImportSuccessful$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(personImportSuccessful),
        tap(() => this.notifications.showNotification("Person imported"))
      ),
    {
      dispatch: false,
    }
  );

  personImportFailed$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(personImportFailed),
        tap((action) =>
          this.notifications.showNotification(
            `Person import failed: ${action.error}`
          )
        )
      ),
    {
      dispatch: false,
    }
  );

  constructor(
    private actions$: Actions,
    private api: DefaultService,
    private notifications: NotificationsService
  ) {}
}
