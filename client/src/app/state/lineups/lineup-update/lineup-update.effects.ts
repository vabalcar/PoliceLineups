import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { exhaustMap, map, mergeMap, tap } from "rxjs/operators";
import { DefaultService } from "src/app/api/api/default.service";
import { StaticPath } from "src/app/routing/paths";
import { BlobsService } from "src/app/services/blobs/blobs.service";
import { NotificationsService } from "src/app/services/notifications/notifications.service";

import { convertToLocalDateTime } from "../../utils/date.utils";
import { catchBeError } from "../../utils/errors.utils";
import { omit, pick } from "../../utils/object.utils";
import {
  lineupLoaded,
  lineupPeoplePhotosLoaded,
  loadLineup,
  lineupSavingSuccessful as lineupSavingSuccessful,
  deleteLineup,
  saveNewLineup,
  lineupDeletionSuccessful,
  lineupDeletionFailed,
  lineupSavingFailed as lineupSavingFailed,
  saveExistingLineup,
} from "./lineup-update.actions";
import { selectLineupPeople } from "./lineup-update.selectors";

@Injectable()
export class LineupUpdateEffects {
  loadLineup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadLineup),
      exhaustMap((action) =>
        this.api.getLineup(action.lineupId).pipe(
          map((response) =>
            lineupLoaded({
              lineup: {
                ...omit(response, "people"),
                lastEditDateTime: convertToLocalDateTime(
                  response.lastEditDateTime
                ),
              },
              people: response.people.map((person) => ({
                ...person,
                birthDate: convertToLocalDateTime(person.birthDate),
              })),
            })
          ),
          catchBeError()
        )
      )
    )
  );

  lineupPeopleLoaded$ = createEffect(() =>
    this.actions$.pipe(
      ofType(lineupLoaded),
      mergeMap((action) =>
        this.blobs
          .getPhotos(action.people)
          .pipe(
            map(
              (people) => lineupPeoplePhotosLoaded({ people }),
              catchBeError()
            )
          )
      )
    )
  );

  saveNewLineup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(saveNewLineup),
      concatLatestFrom(() =>
        this.store
          .select(selectLineupPeople)
          .pipe(
            map((people) => people.map((person) => pick(person, "personId")))
          )
      ),
      mergeMap(([action, peopleWithIdOnly]) =>
        this.api
          .addLineup({ name: action.name, people: peopleWithIdOnly })
          .pipe(
            map((response) =>
              !response.error
                ? lineupSavingSuccessful({ newLineup: true })
                : lineupSavingFailed({ error: response.error })
            ),
            catchBeError()
          )
      )
    )
  );

  saveExistingLineup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(saveExistingLineup),
      concatLatestFrom(() => this.store.select(selectLineupPeople)),
      exhaustMap(([action, lineupPeople]) =>
        this.api
          .updateLineup(
            { name: action.name, people: lineupPeople },
            action.lineupId
          )
          .pipe(
            map((response) =>
              !response.error
                ? lineupSavingSuccessful({ newLineup: false })
                : lineupSavingFailed({ error: response.error })
            ),
            catchBeError()
          )
      )
    )
  );

  lineupSavingSuccessful$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(lineupSavingSuccessful),
        tap(() => this.notifications.showNotification("Lineup saved")),
        tap(
          (action) =>
            action.newLineup &&
            this.router.navigateByUrl(StaticPath.currentUserLineupsList)
        )
      ),
    {
      dispatch: false,
    }
  );

  lineupSavingFailed$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(lineupSavingFailed),
        tap((action) =>
          this.notifications.showNotification(
            `Lineup saving failed: ${action.error}`
          )
        )
      ),
    {
      dispatch: false,
    }
  );

  deleteLineup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteLineup),
      mergeMap((action) =>
        this.api.removeLineup(action.lineupId).pipe(
          map((response) =>
            !response.error
              ? lineupDeletionSuccessful()
              : lineupDeletionFailed({ error: response.error })
          ),
          catchBeError()
        )
      )
    )
  );

  lineupDeletionSuccessful$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(lineupDeletionSuccessful),
        tap(() => this.router.navigateByUrl(StaticPath.currentUserLineupsList)),
        tap(() =>
          this.notifications.showNotification(
            "Lineup has been deleted successfully"
          )
        )
      ),
    {
      dispatch: false,
    }
  );

  lineupDeletionFailed$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(lineupDeletionFailed),
        tap((action) =>
          this.notifications.showNotification(
            `Lineup deletion failed: ${action.error}`
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
    private blobs: BlobsService,
    private store: Store,
    private router: Router,
    private notifications: NotificationsService
  ) {}
}
