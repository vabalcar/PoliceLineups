import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { exhaustMap, filter, map, mergeMap } from "rxjs/operators";
import { DefaultService } from "src/app/api/api/default.service";
import { BlobsService } from "src/app/services/blobs/blobs.service";

import { convertToLocalDateTime } from "../../utils/date.utils";
import { catchBeError } from "../../utils/errors.utils";
import {
  loadPeopleList,
  loadPeoplePhotos,
  peopleListLoaded,
  peoplePhotosLoaded,
} from "./people-list.actions";

@Injectable()
export class PeopleListEffects {
  loadPeopleList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadPeopleList),
      exhaustMap((action) =>
        this.api
          .getPeople(
            action.fullName,
            action.minAge,
            action.maxAge,
            action.nationality
          )
          .pipe(
            map((response) =>
              peopleListLoaded({
                people: response.map((person) => ({
                  ...person,
                  birthDate: convertToLocalDateTime(person.birthDate),
                })),
                loadPeoplePhotos: action.withPhoto,
              })
            ),
            catchBeError()
          )
      )
    )
  );

  peopleListLoaded$ = createEffect(() =>
    this.actions$.pipe(
      ofType(peopleListLoaded),
      filter((action) => action.loadPeoplePhotos),
      mergeMap((action) => of(loadPeoplePhotos({ people: action.people })))
    )
  );

  loadPeoplePhotos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadPeoplePhotos),
      mergeMap((action) =>
        this.blobs
          .getPhotos(action.people)
          .pipe(map((people) => peoplePhotosLoaded({ people }), catchBeError()))
      )
    )
  );

  constructor(
    private actions$: Actions,
    private api: DefaultService,
    private blobs: BlobsService
  ) {}
}
