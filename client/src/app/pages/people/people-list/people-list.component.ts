import { Component, OnInit, ViewChild } from "@angular/core";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Person } from "src/app/api/model/person";
import { DynamicPath } from "src/app/routing/paths";
import { AppState } from "src/app/state/app.state";
import { loadPeopleList } from "src/app/state/people/people-list/people-list.actions";
import { selectPeopleList } from "src/app/state/people/people-list/people-list.selectors";

@Component({
  templateUrl: "./people-list.component.html",
})
export class PeopleListComponent implements OnInit {
  @ViewChild(MatSort)
  readonly sort: MatSort;

  readonly dynamicPath = DynamicPath;

  readonly people$: Observable<MatTableDataSource<Person>>;

  readonly displayedTableColumns: (keyof Person)[] = [
    "fullName",
    "birthDate",
    "nationality",
  ];

  constructor(private store: Store<AppState>) {
    this.people$ = this.store.select(selectPeopleList).pipe(
      map((people) => {
        const usersSource = new MatTableDataSource(people);
        usersSource.sort = this.sort;
        return usersSource;
      })
    );
  }

  ngOnInit(): void {
    this.store.dispatch(loadPeopleList({}));
  }
}
