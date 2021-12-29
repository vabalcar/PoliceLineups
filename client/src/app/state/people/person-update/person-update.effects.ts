import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { exhaustMap, map, mergeMap, tap } from "rxjs/operators";
import { DefaultService } from "src/app/api/api/default.service";
import { StaticPath } from "src/app/routing/paths";
import { NotificationsService } from "src/app/services/notifications.service";

import { catchBeError } from "../../utils/errors.utils";
import {
  deletePerson,
  loadPersonToUpdate,
  personDeletionFailed,
  personDeletionSuccessful,
  personFullNameUpdateSuccessful,
  personToUpdateLoaded,
  personUpdateFailed,
  updatePersonFullName,
} from "./person-update.actions";

@Injectable()
export class PersonUpdateEffects {
  loadPersonToUpdate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadPersonToUpdate),
      mergeMap((action) =>
        this.api.getPerson(action.targePersonId).pipe(
          map((person) =>
            personToUpdateLoaded({
              ...person,
            })
          ),
          catchBeError()
        )
      )
    )
  );

  updatePersonFullName$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updatePersonFullName),
      exhaustMap((action) =>
        this.api
          .updatePerson(
            {
              fullName: action.newFullName,
            },
            action.targetPersonId
          )
          .pipe(
            map((response) =>
              !response.error
                ? personFullNameUpdateSuccessful()
                : personUpdateFailed({ error: response.error })
            ),
            catchBeError()
          )
      )
    )
  );

  personUpdateFailed$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(personUpdateFailed),
        tap((action) =>
          this.notifications.showNotification(
            `Person update failed: ${action.error}`
          )
        )
      ),
    {
      dispatch: false,
    }
  );

  deletePerson$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deletePerson),
      exhaustMap((action) =>
        this.api.removePerson(action.targetPersonId).pipe(
          map((response) =>
            !response.error
              ? personDeletionSuccessful()
              : personDeletionFailed({ error: response.error })
          ),
          catchBeError()
        )
      )
    )
  );

  personDeletionSuccessful$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(personDeletionSuccessful),
        tap(() => this.router.navigateByUrl(StaticPath.peopleList)),
        tap(() =>
          this.notifications.showNotification(
            "Person has been deleted successfully"
          )
        )
      ),
    {
      dispatch: false,
    }
  );

  personDeletionFailed$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(personDeletionFailed),
        tap((action) =>
          this.notifications.showNotification(
            `Person deletion failed: ${action.error}`
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
    private router: Router,
    private notifications: NotificationsService
  ) {}
}
