import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { exhaustMap, map } from "rxjs/operators";
import { DefaultService } from "src/app/api/api/default.service";
import { catchBeError } from "../utils/errors.utils";
import {
  loadUsersListAction,
  usersListLoadedAction,
} from "./users-list.actions";

@Injectable()
export class UsersListEffects {
  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadUsersListAction),
      exhaustMap(() =>
        this.api.getUsers().pipe(
          map((response) => usersListLoadedAction({ users: response })),
          catchBeError()
        )
      )
    )
  );

  constructor(private actions$: Actions, private api: DefaultService) {}
}
