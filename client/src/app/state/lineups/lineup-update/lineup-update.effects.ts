import { Injectable } from "@angular/core";
import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { exhaustMap, map, mergeMap } from "rxjs/operators";
import { DefaultService } from "src/app/api/api/default.service";
import { BlobsService } from "src/app/services/blobs/blobs.service";

import { convertToLocalDateTime } from "../../utils/date.utils";
import { catchBeError } from "../../utils/errors.utils";
import { pick } from "../../utils/object.utils";
import {
  lineupPeopleLoaded,
  lineupPeoplePhotosLoaded,
  loadLineup,
  newLineupSaved,
  saveNewLineup,
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
            lineupPeopleLoaded({
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
          .pipe(map((_) => newLineupSaved()))
      )
    )
  );

  constructor(
    private actions$: Actions,
    private api: DefaultService,
    private blobs: BlobsService,
    private store: Store
  ) {}
}
