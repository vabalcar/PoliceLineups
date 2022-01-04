import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { exhaustMap, map, mergeMap, tap } from "rxjs/operators";
import { DefaultService } from "src/app/api/api/default.service";
import { StaticPath } from "src/app/routing/paths";
import { BlobsService } from "src/app/services/blobs/blobs.service";
import { NotificationsService } from "src/app/services/notifications/notifications.service";

import { convertToLocalDateTime } from "../../utils/date.utils";
import { catchBeError } from "../../utils/errors.utils";
import {
  deletePerson,
  loadPersonPhoto,
  loadPersonToUpdate,
  personBirthDateUpdateSuccessful,
  personDeletionFailed,
  personDeletionSuccessful,
  personFullNameUpdateSuccessful,
  personNationalityUpdateSuccessful,
  personPhotoLoaded,
  personPhotoUpdateSuccessful,
  personToUpdateLoaded,
  personUpdateFailed,
  updatePersonBirthDate,
  updatePersonFullName,
  updatePersonNationality,
  updatePersonPhoto,
} from "./person-update.actions";
import { selectPersonPhotoBlobName } from "./person-update.selectors";

@Injectable()
export class PersonUpdateEffects {
  loadPersonToUpdate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadPersonToUpdate),
      mergeMap((action) =>
        this.api.getPerson(action.targetPersonId).pipe(
          map((person) =>
            personToUpdateLoaded({
              ...person,
              birthDate: convertToLocalDateTime(person.birthDate),
            })
          ),
          catchBeError()
        )
      )
    )
  );

  personToUpdateLoaded$ = createEffect(() =>
    this.actions$.pipe(
      ofType(personToUpdateLoaded),
      mergeMap((action) =>
        of(
          loadPersonPhoto({
            personId: action.personId,
            photoBlobName: action.photoBlobName,
          })
        )
      )
    )
  );

  loadPersonPhoto$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadPersonPhoto),
      mergeMap((action) =>
        this.blobs.getBlob(action.photoBlobName).pipe(
          map((photoBlobHandle) =>
            personPhotoLoaded({
              personId: action.personId,
              photoUrl: photoBlobHandle.url,
            })
          ),
          catchBeError()
        )
      )
    )
  );

  updatePersonPhoto$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updatePersonPhoto),
      concatLatestFrom(() => this.store.select(selectPersonPhotoBlobName)),
      exhaustMap(([action, blobName]) =>
        this.api.updateBlobForm(action.newPhoto.blob, blobName).pipe(
          map((response) =>
            !response.error
              ? personPhotoUpdateSuccessful()
              : personUpdateFailed({ error: response.error })
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

  updatePersonBirthDate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updatePersonBirthDate),
      exhaustMap((action) =>
        this.api
          .updatePerson(
            {
              birthDate: action.newBirthDate,
            },
            action.targetPersonId
          )
          .pipe(
            map((response) =>
              !response.error
                ? personBirthDateUpdateSuccessful()
                : personUpdateFailed({ error: response.error })
            ),
            catchBeError()
          )
      )
    )
  );

  updatePersonNationality$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updatePersonNationality),
      exhaustMap((action) =>
        this.api
          .updatePerson(
            {
              nationality: action.newNationality,
            },
            action.targetPersonId
          )
          .pipe(
            map((response) =>
              !response.error
                ? personNationalityUpdateSuccessful()
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
    private notifications: NotificationsService,
    private blobs: BlobsService,
    private store: Store
  ) {}
}
