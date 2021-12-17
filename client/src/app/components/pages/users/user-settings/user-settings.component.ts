import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";

import { BehaviorSubject, combineLatest, Observable } from "rxjs";
import { map } from "rxjs/operators";

import { StaticPath } from "src/app/routing/paths";
import { AppState } from "src/app/state/app.state";
import { selectCurrentUserUserId } from "src/app/state/auth/auth.selectors";
import {
  deleteUser,
  loadUserToUpdate,
  updateUserFullName,
  updateUserPassword,
} from "src/app/state/users/user-update/user-update.actions";
import { selectEditedUserInfo } from "src/app/state/users/user-update/user-update.selectors";
import { IUserInfo } from "src/app/state/users/utils/IUserInfo";
import {
  PasswordSetterValidation,
  PasswordValidationFormControls,
} from "src/app/validations/password-setter.validation";
import { RequiredValidation } from "src/app/validations/required.validation";

interface IUserSettingsComponentData {
  userId: number;
  username: string;
  isEditingSelf: boolean;
}

@Component({
  selector: "app-user-settings",
  templateUrl: "./user-settings.component.html",
})
export class UserSettingsComponent implements OnInit {
  readonly passwordValidationFormControls = PasswordValidationFormControls;

  readonly fullNameValidation: RequiredValidation<string>;
  readonly passwordValidation: PasswordSetterValidation;

  readonly userSettingsComponentData$: Observable<IUserSettingsComponentData>;

  private readonly loggedInUserId$: Observable<number>;
  private readonly targetUserInfo$: Observable<IUserInfo>;
  private readonly userSettingsComponentDataSubject$: BehaviorSubject<
    IUserSettingsComponentData | undefined
  >;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>
  ) {
    this.loggedInUserId$ = this.store.select(selectCurrentUserUserId);
    this.targetUserInfo$ = this.store.select(selectEditedUserInfo);

    this.userSettingsComponentData$ = combineLatest([
      this.loggedInUserId$,
      this.targetUserInfo$,
    ]).pipe(
      map(([loggedInUserId, targetUserInfo]) => ({
        userId: targetUserInfo.userId,
        username: targetUserInfo.username,
        isEditingSelf: loggedInUserId === targetUserInfo.userId,
      }))
    );

    this.userSettingsComponentDataSubject$ = new BehaviorSubject(undefined);
    this.userSettingsComponentData$.subscribe(
      this.userSettingsComponentDataSubject$
    );

    this.fullNameValidation = new RequiredValidation(
      this.targetUserInfo$.pipe(
        map((targetUserInfo) => targetUserInfo.fullName)
      )
    );
    this.passwordValidation = new PasswordSetterValidation();
  }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        map((params) =>
          params.has("userId") ? +params.get("userId") : undefined
        )
      )
      .subscribe((targetUserId) =>
        targetUserId === undefined || this.isUserId(targetUserId)
          ? this.store.dispatch(
              loadUserToUpdate({
                targetUserId,
              })
            )
          : this.router.navigateByUrl(StaticPath.pathNotFound)
      );
  }

  updateUserFullName(): void {
    this.store.dispatch(
      updateUserFullName({
        targetUserId: this.getTargetUserId(
          this.userSettingsComponentDataSubject$.getValue()
        ),
        newFullName: this.fullNameValidation.value,
      })
    );
  }

  updateUserPassword(): void {
    this.store.dispatch(
      updateUserPassword({
        targetUserId: this.getTargetUserId(
          this.userSettingsComponentDataSubject$.getValue()
        ),
        newPassword: this.passwordValidation.value,
      })
    );
  }

  deleteUser(): void {
    this.store.dispatch(
      deleteUser({
        targetUserId: this.getTargetUserId(
          this.userSettingsComponentDataSubject$.getValue()
        ),
      })
    );
  }

  private getTargetUserId(
    userData: IUserSettingsComponentData | undefined
  ): number | undefined {
    return !userData || userData.isEditingSelf ? undefined : userData.userId;
  }

  private isUserId(n: number): boolean {
    return Number.isInteger(n) && n > 0;
  }
}
