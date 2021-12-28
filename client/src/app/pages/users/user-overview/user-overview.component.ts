import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { combineLatest, Observable } from "rxjs";
import { filter, map } from "rxjs/operators";
import { User } from "src/app/api/model/user";
import { DynamicPath, StaticPath } from "src/app/routing/paths";
import { AppState } from "src/app/state/app.state";
import { selectCurrentUserUserId } from "src/app/state/auth/auth.selectors";
import { loadUserToUpdate } from "src/app/state/users/user-update/user-update.actions";
import { selectEditedUserInfo } from "src/app/state/users/user-update/user-update.selectors";

import { isId } from "../../utils/validations.utils";
import { getUserRole, UserRole } from "../utils/user-role.utils";

interface IUserOverviewComponentData {
  isOverviewingSelf: boolean;
  user: User;
  userRole: UserRole;
}

@Component({
  templateUrl: "./user-overview.component.html",
  styleUrls: ["./user-overview.component.css"],
})
export class UserOverviewComponent implements OnInit {
  readonly dynamicPath = DynamicPath;

  readonly userOverviewComponentData$: Observable<IUserOverviewComponentData>;

  private readonly loggedInUserId$: Observable<number>;
  private readonly targetUser$: Observable<User>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>
  ) {
    this.loggedInUserId$ = this.store.select(selectCurrentUserUserId);
    this.targetUser$ = this.store.select(selectEditedUserInfo);

    this.userOverviewComponentData$ = combineLatest([
      this.loggedInUserId$,
      this.targetUser$,
    ]).pipe(
      filter(
        ([loggedInUserId, targetUser]) =>
          loggedInUserId !== undefined && targetUser.userId !== undefined
      ),
      map(([loggedInUserId, targetUser]) => ({
        isOverviewingSelf: targetUser.userId === loggedInUserId,
        user: targetUser,
        userRole: getUserRole(targetUser.isAdmin),
      }))
    );
  }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        map((params) =>
          params.has("userId") ? +params.get("userId") : undefined
        )
      )
      .subscribe((targetUserId) =>
        targetUserId === undefined || isId(targetUserId)
          ? this.store.dispatch(
              loadUserToUpdate({
                targetUserId,
              })
            )
          : this.router.navigateByUrl(StaticPath.pathNotFound)
      );
  }
}
