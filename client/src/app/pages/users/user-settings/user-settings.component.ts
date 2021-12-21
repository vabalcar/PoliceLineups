import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { BehaviorSubject, combineLatest, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { User } from "src/app/api/model/user";
import { StaticPath } from "src/app/routing/paths";
import { AppState } from "src/app/state/app.state";
import { selectCurrentUserUserId } from "src/app/state/auth/auth.selectors";
import {
  deleteUser,
  loadUserToUpdate,
  updateUserEmail,
  updateUserFullName,
  updateUserPassword,
  updateUserRole,
} from "src/app/state/users/user-update/user-update.actions";
import { selectEditedUserInfo } from "src/app/state/users/user-update/user-update.selectors";
import { EmailValidation } from "src/app/validations/users/email.validation";
import { FullNameValidation } from "src/app/validations/users/full-name.validation";
import {
  PasswordSetterValidation,
  PasswordValidationFormControls,
} from "src/app/validations/users/password-setter.validation";
import { ObservableFormControl } from "src/app/validations/utils/ObservableFormControl";
import { environment } from "src/environments/environment";

interface IUserSettingsComponentData {
  userId: number;
  username: string;
  isEditingSelf: boolean;
  isEditingRootUser: boolean;
}

@Component({
  templateUrl: "./user-settings.component.html",
})
export class UserSettingsComponent implements OnInit {
  readonly passwordValidationFormControls = PasswordValidationFormControls;

  readonly fullNameValidation: FullNameValidation;
  readonly emailValidation: EmailValidation;
  readonly passwordSetterValidation: PasswordSetterValidation;
  readonly isAdminFormControl: ObservableFormControl<boolean>;

  readonly userSettingsComponentData$: Observable<IUserSettingsComponentData>;

  private readonly loggedInUserId$: Observable<number>;
  private readonly targetUser$: Observable<User>;
  private readonly userSettingsComponentDataSubject$: BehaviorSubject<
    IUserSettingsComponentData | undefined
  >;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>
  ) {
    this.loggedInUserId$ = this.store.select(selectCurrentUserUserId);
    this.targetUser$ = this.store.select(selectEditedUserInfo);

    this.userSettingsComponentData$ = combineLatest([
      this.loggedInUserId$,
      this.targetUser$,
    ]).pipe(
      map(([loggedInUserId, targetUser]) => ({
        userId: targetUser.userId,
        username: targetUser.username,
        isEditingSelf: loggedInUserId === targetUser.userId,
        isEditingRootUser:
          targetUser.username === environment.rootUser.username,
      }))
    );

    this.userSettingsComponentDataSubject$ = new BehaviorSubject(undefined);
    this.userSettingsComponentData$.subscribe(
      this.userSettingsComponentDataSubject$
    );

    this.fullNameValidation = new FullNameValidation(
      this.targetUser$.pipe(map((targetUserInfo) => targetUserInfo.fullName))
    );
    this.emailValidation = new EmailValidation(
      this.targetUser$.pipe(map((targetUserInfo) => targetUserInfo.email))
    );
    this.passwordSetterValidation = new PasswordSetterValidation();
    this.isAdminFormControl = new ObservableFormControl(
      this.targetUser$.pipe(map((targetUserInfo) => targetUserInfo.isAdmin))
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

  updateUserEmail(): void {
    this.store.dispatch(
      updateUserEmail({
        targetUserId: this.getTargetUserId(
          this.userSettingsComponentDataSubject$.getValue()
        ),
        newEmail: this.emailValidation.value,
      })
    );
  }

  updateUserPassword(): void {
    this.store.dispatch(
      updateUserPassword({
        targetUserId: this.getTargetUserId(
          this.userSettingsComponentDataSubject$.getValue()
        ),
        newPassword: this.passwordSetterValidation.value,
      })
    );
    this.passwordSetterValidation.clearValue();
  }

  updateUserRole(): void {
    this.store.dispatch(
      updateUserRole({
        targetUserId: this.getTargetUserId(
          this.userSettingsComponentDataSubject$.getValue()
        ),
        isAdmin: !!this.isAdminFormControl.value,
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
