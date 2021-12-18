import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { BehaviorSubject, combineLatest, Observable } from "rxjs";
import { map, share } from "rxjs/operators";
import { StaticPath } from "src/app/routing/paths";
import { AppState } from "src/app/state/app.state";
import { selectCurrentUserUserId } from "src/app/state/auth/auth.selectors";
import {
  deleteUser,
  loadUserToUpdate,
  updateUserFullName,
  updateUserPassword,
  updateUserRole,
} from "src/app/state/users/user-update/user-update.actions";
import { selectEditedUserInfo } from "src/app/state/users/user-update/user-update.selectors";
import { IUserInfo } from "src/app/state/users/utils/IUserInfo";
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
  selector: "app-user-settings",
  templateUrl: "./user-settings.component.html",
})
export class UserSettingsComponent implements OnInit {
  readonly passwordValidationFormControls = PasswordValidationFormControls;

  readonly fullNameValidation: FullNameValidation;
  readonly passwordSetterValidation: PasswordSetterValidation;
  readonly isAdminFormControl: ObservableFormControl<boolean>;

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
    this.targetUserInfo$ = this.store
      .select(selectEditedUserInfo)
      .pipe(share());

    this.userSettingsComponentData$ = combineLatest([
      this.loggedInUserId$,
      this.targetUserInfo$,
    ]).pipe(
      map(([loggedInUserId, targetUserInfo]) => ({
        userId: targetUserInfo.userId,
        username: targetUserInfo.username,
        isEditingSelf: loggedInUserId === targetUserInfo.userId,
        isEditingRootUser:
          targetUserInfo.username === environment.rootUser.username,
      }))
    );

    this.userSettingsComponentDataSubject$ = new BehaviorSubject(undefined);
    this.userSettingsComponentData$.subscribe(
      this.userSettingsComponentDataSubject$
    );

    this.fullNameValidation = new FullNameValidation(
      this.targetUserInfo$.pipe(
        map((targetUserInfo) => targetUserInfo.fullName)
      )
    );
    this.passwordSetterValidation = new PasswordSetterValidation();
    this.isAdminFormControl = new ObservableFormControl(
      this.targetUserInfo$.pipe(map((targetUserInfo) => targetUserInfo.isAdmin))
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

  updateUserPassword(): void {
    this.store.dispatch(
      updateUserPassword({
        targetUserId: this.getTargetUserId(
          this.userSettingsComponentDataSubject$.getValue()
        ),
        newPassword: this.passwordSetterValidation.value,
      })
    );
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
