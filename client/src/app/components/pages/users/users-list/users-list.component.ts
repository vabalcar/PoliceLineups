import { Component, OnInit, ViewChild } from "@angular/core";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Store } from "@ngrx/store";
import { map } from "rxjs/operators";
import { User } from "src/app/api/model/user";
import { DynamicPath } from "src/app/routing/paths";
import { AppState } from "src/app/state/app.state";
import { loadUsersListAction } from "src/app/state/users/users-list/users-list.actions";
import { selectUsersList } from "src/app/state/users/users-list/users-list.selectors";

@Component({
  selector: "app-users-list",
  templateUrl: "./users-list.component.html",
})
export class UsersListComponent implements OnInit {
  @ViewChild(MatSort)
  readonly sort: MatSort;

  readonly dynamicPath = DynamicPath;

  readonly user$ = this.store.select(selectUsersList).pipe(
    map((users) => {
      const usersSource = new MatTableDataSource(users);
      usersSource.sort = this.sort;
      return usersSource;
    })
  );

  readonly displayedTableColumns: (keyof User)[] = [
    "username",
    "fullName",
    "isAdmin",
  ];

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.store.dispatch(loadUsersListAction());
  }
}
