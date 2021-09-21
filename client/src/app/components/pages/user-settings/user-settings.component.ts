import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Store } from "@ngrx/store";
import { BehaviorSubject, zip } from "rxjs";
import { map } from "rxjs/operators";
import { AppState } from "src/app/state/app.reducer";
import { selectUsername } from "src/app/state/auth/auth.reducer";
import {
  updateUserFullNameAction,
  updateUserPasswordAction,
} from "src/app/state/user-update/user-update.reducer";

@Component({
  selector: "app-user-settings",
  templateUrl: "./user-settings.component.html",
  styleUrls: ["./user-settings.component.css"],
})
export class UserSettingsComponent implements OnInit {
  loggedInUser$ = this.store.select(selectUsername);

  editingUser$ = new BehaviorSubject<string | undefined>(undefined);
  editingUserSubscription = zip(
    this.loggedInUser$,
    this.route.paramMap.pipe(map((params) => params.get("username")))
  )
    .pipe(
      map(
        ([loggedInUser, editingUserFromRoute]) =>
          editingUserFromRoute ?? loggedInUser
      )
    )
    .subscribe(this.editingUser$);

  isEditingSelf$ = zip(this.loggedInUser$, this.editingUser$).pipe(
    map(([loggedInUser, editingUser]) => loggedInUser === editingUser)
  );

  isNotEditingSelf$ = this.isEditingSelf$.pipe(
    map((isEditingSelf) => !isEditingSelf)
  );

  password: string;
  passwordAgain: string;
  fullName: string;
  isAdmin: boolean;

  constructor(private route: ActivatedRoute, private store: Store<AppState>) {}

  ngOnInit(): void {}

  updateUserFullName(): void {
    const targetUser = this.editingUser$.getValue();
    if (targetUser === undefined || !this.fullName) {
      return;
    }

    this.store.dispatch(
      updateUserFullNameAction({
        selfUpdate: targetUser !== undefined,
        targetUsername: targetUser,
        newFullName: this.fullName,
      })
    );
  }

  updateUserPassword(): void {
    const targetUser = this.editingUser$.getValue();
    if (targetUser === undefined || !this.password) {
      return;
    }

    if (this.password !== this.passwordAgain) {
      this.password = undefined;
      this.password = undefined;
      return;
    }

    this.store.dispatch(
      updateUserPasswordAction({
        selfUpdate: targetUser !== undefined,
        targetUsername: targetUser,
        newPassword: this.password,
      })
    );
  }
}
