import { Injectable } from "@angular/core";
import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { exhaustMap, map, mergeMap } from "rxjs/operators";
import { DefaultService } from "src/app/api/api/default.service";
import { BlobsService } from "src/app/services/blobs/blobs.service";

import { convertToLocalDateTime } from "../../utils/date.utils";
import { catchBeError } from "../../utils/errors.utils";
import {
  addPersonToLineup,
  removePersonFromLineup,
} from "../lineup-update/lineup-update.actions";
import { selectLineupPeople } from "../lineup-update/lineup-update.selectors";
import {
  lineupRecommendationsLoaded,
  loadLineupRecommendations,
  recommendedPeoplePhotosLoaded,
} from "./lineup-recommendations.actions";

@Injectable()
export class LineupRecommendationsEffects {
  loadLineupRecommendations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadLineupRecommendations),
      exhaustMap((action) =>
        this.api.getLineupRecommendations(action.people).pipe(
          map((response) =>
            lineupRecommendationsLoaded({
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

  lineupRecommendationsLoaded$ = createEffect(() =>
    this.actions$.pipe(
      ofType(lineupRecommendationsLoaded),
      mergeMap((action) =>
        this.blobs
          .getPhotos(action.people)
          .pipe(
            map(
              (people) => recommendedPeoplePhotosLoaded({ people }),
              catchBeError()
            )
          )
      )
    )
  );

  addPersonToLineup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addPersonToLineup),
      concatLatestFrom(() => this.store.select(selectLineupPeople)),
      map(([_, people]) => loadLineupRecommendations({ people }))
    )
  );

  removePersonFromLineup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(removePersonFromLineup),
      concatLatestFrom(() => this.store.select(selectLineupPeople)),
      map(([_, people]) => loadLineupRecommendations({ people }))
    )
  );

  constructor(
    private actions$: Actions,
    private api: DefaultService,
    private blobs: BlobsService,
    private store: Store
  ) {}
}
