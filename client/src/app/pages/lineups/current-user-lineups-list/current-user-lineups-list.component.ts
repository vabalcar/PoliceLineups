import { Component, OnInit, ViewChild } from "@angular/core";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { LineupOverview } from "src/app/api/model/lineupOverview";
import { DynamicPath } from "src/app/routing/paths";
import { AppState } from "src/app/state/app.state";
import { loadCurrentUserLineups } from "src/app/state/lineups/lineups-list/lineups-list.actions";
import { selectLineupsList } from "src/app/state/lineups/lineups-list/lineups-list.selectors";

@Component({
  templateUrl: "./current-user-lineups-list.component.html",
})
export class CurrentUserLineupsListComponent implements OnInit {
  @ViewChild(MatSort)
  readonly sort: MatSort;

  readonly dynamicPath = DynamicPath;

  readonly lineups$: Observable<MatTableDataSource<LineupOverview>>;

  readonly displayedTableColumns: (keyof LineupOverview)[] = [
    "name",
    "lastEditDateTime",
  ];

  constructor(private store: Store<AppState>) {
    this.lineups$ = this.store.select(selectLineupsList).pipe(
      map((lineups) => {
        const lineupsSource = new MatTableDataSource(lineups);
        lineupsSource.sort = this.sort;
        return lineupsSource;
      })
    );
  }

  ngOnInit(): void {
    this.store.dispatch(loadCurrentUserLineups());
  }
}
