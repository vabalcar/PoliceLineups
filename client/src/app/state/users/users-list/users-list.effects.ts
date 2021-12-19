import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { exhaustMap, map } from "rxjs/operators";
import { DefaultService } from "src/app/api/api/default.service";

import { catchBeError } from "../../utils/errors.utils";
import { loadUsersList, usersListLoaded } from "./users-list.actions";

@Injectable()
export class UsersListEffects {
  loadUsersList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadUsersList),
      exhaustMap(() =>
        this.api.getUsers().pipe(
          map((response) => usersListLoaded({ users: response })),
          catchBeError()
        )
      )
    )
  );

  constructor(private actions$: Actions, private api: DefaultService) {}
}
