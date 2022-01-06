import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { filter, map } from "rxjs/operators";
import { Lineup } from "src/app/api/model/lineup";
import { DynamicPath, StaticPath } from "src/app/routing/paths";
import { AppState } from "src/app/state/app.state";
import { loadLineup } from "src/app/state/lineups/lineup-update/lineup-update.actions";
import {
  selectLineup,
  selectLineupPeople,
} from "src/app/state/lineups/lineup-update/lineup-update.selectors";
import { PersonWithPhotoUrl } from "src/app/utils/PersonWithPhotoUrl";
import { isId } from "../../utils/validations.utils";

@Component({
  templateUrl: "./lineup-overview.component.html",
  styleUrls: ["./lineup-overview.component.css"],
})
export class LineupOverviewComponent implements OnInit {
  readonly dynamicPath = DynamicPath;

  readonly lineup$: Observable<Lineup>;
  readonly lineupPeople$: Observable<Array<PersonWithPhotoUrl>>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>
  ) {
    this.lineup$ = store
      .select(selectLineup)
      .pipe(filter((lineup) => lineup !== undefined));
    this.lineupPeople$ = store.select(selectLineupPeople);
  }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        map((params) =>
          params.has("lineupId") ? +params.get("lineupId") : undefined
        )
      )
      .subscribe((targetLineupId) =>
        isId(targetLineupId)
          ? this.store.dispatch(
              loadLineup({
                lineupId: targetLineupId,
              })
            )
          : this.router.navigateByUrl(StaticPath.pathNotFound)
      );
  }
}
