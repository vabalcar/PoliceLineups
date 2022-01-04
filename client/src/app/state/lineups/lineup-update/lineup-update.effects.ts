import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { exhaustMap, map, mergeMap } from "rxjs/operators";
import { DefaultService } from "src/app/api/api/default.service";
import { BlobsService } from "src/app/services/blobs/blobs.service";

import { convertToLocalDateTime } from "../../utils/date.utils";
import { catchBeError } from "../../utils/errors.utils";
import {
  lineupPeopleLoaded,
  lineupPeoplePhotosLoaded,
  loadLineup,
} from "./lineup-update.actions";

@Injectable()
export class LineupUpdateEffects {
  loadLineup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadLineup),
      exhaustMap((action) =>
        this.api.getPeople().pipe(
          map((response) =>
            lineupPeopleLoaded({
              people: response.map((person) => ({
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
      ofType(lineupPeopleLoaded),
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

  constructor(
    private actions$: Actions,
    private api: DefaultService,
    private blobs: BlobsService
  ) {}
}
