import { Component, OnInit, ViewChild } from "@angular/core";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { User } from "src/app/api/model/user";
import { DynamicPath } from "src/app/routing/paths";
import { AppState } from "src/app/state/app.state";
import { loadUsersList } from "src/app/state/users/users-list/users-list.actions";
import { selectUsersList } from "src/app/state/users/users-list/users-list.selectors";
import { getUserRole } from "../utils/user-role.utils";

@Component({
  templateUrl: "./users-list.component.html",
})
export class UsersListComponent implements OnInit {
  @ViewChild(MatSort)
  readonly sort: MatSort;

  readonly dynamicPath = DynamicPath;
  readonly getUserRole = getUserRole;

  readonly user$: Observable<MatTableDataSource<User>>;

  readonly displayedTableColumns: (keyof User)[] = [
    "username",
    "fullName",
    "email",
    "isAdmin",
  ];

  constructor(private store: Store<AppState>) {
    this.user$ = this.store.select(selectUsersList).pipe(
      map((users) => {
        const usersSource = new MatTableDataSource(users);
        usersSource.sort = this.sort;
        return usersSource;
      })
    );
  }

  ngOnInit(): void {
    this.store.dispatch(loadUsersList());
  }
}
