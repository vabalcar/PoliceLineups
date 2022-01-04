import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { exhaustMap, map } from "rxjs/operators";
import { DefaultService } from "src/app/api/api/default.service";

import { catchBeError } from "../../utils/errors.utils";
import {
  lineupsListLoaded,
  loadAllLineups,
  loadCurrentUserLineups,
} from "./lineups-list.actions";

@Injectable()
export class LineupsListEffects {
  loadCurrentUserLineups$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCurrentUserLineups),
      exhaustMap((_) =>
        this.api.getLineupsForCurrentUser().pipe(
          map((lineups) => lineupsListLoaded({ lineups })),
          catchBeError()
        )
      )
    )
  );

  loadAllLineups$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadAllLineups),
      exhaustMap((_) =>
        this.api.getLineups().pipe(
          map((lineups) => lineupsListLoaded({ lineups })),
          catchBeError()
        )
      )
    )
  );

  constructor(private actions$: Actions, private api: DefaultService) {}
}
