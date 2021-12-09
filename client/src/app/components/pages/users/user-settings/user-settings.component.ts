import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Store } from "@ngrx/store";
import { BehaviorSubject, combineLatest, Observable } from "rxjs";
import { map } from "rxjs/operators";
import {
  selectEditedUserInfo,
  selectUserFullnameUpdateValidationError,
} from "src/app/state/user-update/user-update.selectors";
import {
  ErrorPublisher,
  MinLengthValidationErrorProps,
  ObservableFormControl,
} from "src/app/components/utils/forms.utils";
import { AppState } from "src/app/state/app.state";
import { selectCurrentUserUserId } from "src/app/state/auth/auth.selectors";
import {
  loadUserToUpdate,
  updateUserFullName,
  updateUserPassword,
  validateUserFullnameUpdate,
} from "src/app/state/user-update/user-update.actions";
import { IUserInfo } from "src/app/state/utils/user-info";

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
  readonly userSettingsComponentData$: Observable<IUserSettingsComponentData>;

  readonly fullNameFormControl: ObservableFormControl<string>;
  readonly fullNameUpdateErrorPublisher: ErrorPublisher;

  readonly passwordFormControl: ObservableFormControl<string>;
  readonly passwordAgainFormControl: ObservableFormControl<string>;
  readonly passwordUpdateErrorPublisher: ErrorPublisher;

  private readonly loggedInUserId$: Observable<number>;
  private readonly targetUserInfo$: Observable<IUserInfo>;
  private readonly userSettingsComponentDataSubject$: BehaviorSubject<
    IUserSettingsComponentData | undefined
  >;

  constructor(private route: ActivatedRoute, private store: Store<AppState>) {
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

    this.fullNameFormControl = new ObservableFormControl(
      this.targetUserInfo$.pipe(
        map((targetUserInfo) => targetUserInfo.fullName)
      ),
      ([validationErrorType]) => {
        switch (validationErrorType) {
          case "required":
            return "Full name is required";
        }
      }
    );
    this.fullNameUpdateErrorPublisher = new ErrorPublisher(
      [this.fullNameFormControl.validationError$],
      [this.store.select(selectUserFullnameUpdateValidationError)]
    );

    this.passwordFormControl = new ObservableFormControl(
      undefined,
      ([validationErrorType, validationErrorProps]) => {
        switch (validationErrorType) {
          case "required":
            return "Password is required";
          case "minlength":
            validationErrorProps =
              validationErrorProps as MinLengthValidationErrorProps;
            return `Password has to be at least ${validationErrorProps.requiredLength} characters long`;
        }
      }
    );
    this.passwordAgainFormControl = new ObservableFormControl();
    this.passwordUpdateErrorPublisher = new ErrorPublisher([
      this.passwordFormControl.validationError$,
      combineLatest([
        this.passwordFormControl.value$,
        this.passwordAgainFormControl.value$,
      ]).pipe(
        map(([password, passwordAgain]) =>
          password === passwordAgain ? null : "passwords don't match"
        )
      ),
    ]);
  }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(map((params) => params.get("userId")))
      .subscribe((editedUserIdFromRoute) =>
        this.store.dispatch(
          loadUserToUpdate({
            targetUserId: parseInt(editedUserIdFromRoute, 10),
          })
        )
      );

    this.fullNameFormControl.value$.subscribe((value) =>
      this.store.dispatch(
        validateUserFullnameUpdate({ newFullName: value ?? "" })
      )
    );
  }

  fullNameUpdateDisabled(): boolean {
    return (
      this.fullNameFormControl.pristine ||
      this.fullNameUpdateErrorPublisher.isErrorState()
    );
  }

  updateUserFullName(): void {
    this.store.dispatch(
      updateUserFullName({
        targetUserId: this.getTargetUserId(
          this.userSettingsComponentDataSubject$.getValue()
        ),
        newFullName: this.fullNameFormControl.currentValue,
      })
    );
  }

  passwordUpdateDisabled(): boolean {
    return (
      this.passwordFormControl.pristine ||
      this.passwordAgainFormControl.pristine ||
      this.passwordUpdateErrorPublisher.isErrorState()
    );
  }

  updateUserPassword(): void {
    this.store.dispatch(
      updateUserPassword({
        targetUserId: this.getTargetUserId(
          this.userSettingsComponentDataSubject$.getValue()
        ),
        newPassword: this.passwordFormControl.currentValue,
      })
    );
  }

  private getTargetUserId(
    userData: IUserSettingsComponentData | undefined
  ): number | undefined {
    return !userData || userData.isEditingSelf ? undefined : userData.userId;
  }
}
