import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { BehaviorSubject, combineLatest, Observable } from "rxjs";
import { map } from "rxjs/operators";
import {
  selectEditedUserInfo,
  selectUserFullnameUpdateValidationError,
} from "src/app/state/user-update/user-update.selectors";
import { AppState } from "src/app/state/app.state";
import { selectCurrentUserUserId } from "src/app/state/auth/auth.selectors";
import {
  deleteUser,
  loadUserToUpdate,
  updateUserFullName,
  updateUserPassword,
  validateUserFullnameUpdate,
} from "src/app/state/user-update/user-update.actions";
import { IUserInfo } from "src/app/state/utils/user-info";
import { StaticPath } from "src/app/routing/path";
import {
  PasswordValidation,
  PasswordValidationFormControls,
} from "src/app/validations/password.validation";
import { FullNameValidation } from "src/app/validations/full-name.validation";
import { BeValidation } from "src/app/validations/utils/validation.utils";

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

  readonly userSettingsComponentData$: Observable<IUserSettingsComponentData>;

  readonly passwordValidation: PasswordValidation;
  readonly fullNameValidation: FullNameValidation;

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

    this.passwordValidation = new PasswordValidation();
    this.fullNameValidation = new FullNameValidation(
      new BeValidation(
        (value) =>
          this.store.dispatch(
            validateUserFullnameUpdate({ newFullName: value ?? "" })
          ),
        this.store.select(selectUserFullnameUpdateValidationError)
      ),
      this.targetUserInfo$.pipe(
        map((targetUserInfo) => targetUserInfo.fullName)
      )
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
