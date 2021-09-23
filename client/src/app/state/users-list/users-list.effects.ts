import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { exhaustMap, map } from "rxjs/operators";
import { DefaultService } from "src/app/api/api/default.service";
import {
  loadUsersListAction,
  usersListLoadedAction,
} from "./users-list.reducer";

@Injectable()
export class UsersListEffects {
  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadUsersListAction),
      exhaustMap(() =>
        this.api
          .getUsers()
          .pipe(map((response) => usersListLoadedAction({ users: response })))
      )
    )
  );

  constructor(private actions$: Actions, private api: DefaultService) {}
}
