import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Store } from "@ngrx/store";
import { BehaviorSubject, combineLatest, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { AppState } from "src/app/state/app.reducer";
import {
  IUserInfo,
  selectCurrentUserUsername,
} from "src/app/state/auth/auth.reducer";
import {
  loadUserToUpdate,
  selectEditedUserInfo,
  selectUserFullnameUpdateValidationError,
  updateUserFullName,
  updateUserPassword,
  validateUserFullnameUpdate,
} from "src/app/state/user-update/user-update.reducer";
import {
  ErrorPublisher,
  MinLengthValidationErrorProps,
  ObservableFormControl,
} from "src/app/components/utils/forms.utils";

@Component({
  selector: "app-user-settings",
  templateUrl: "./user-settings.component.html",
})
export class UserSettingsComponent implements OnInit {
  readonly targetUserData$: Observable<{
    isEditingSelf: boolean;
    targetUserUsername: string;
  }>;

  readonly fullNameFormControl: ObservableFormControl<string>;
  readonly fullNameUpdateErrorPublisher: ErrorPublisher;

  readonly passwordFormControl: ObservableFormControl<string>;
  readonly passwordAgainFormControl: ObservableFormControl<string>;
  readonly passwordUpdateErrorPublisher: ErrorPublisher;

  private readonly loggedInUserUsername$: Observable<string>;
  private readonly targetUserInfo$: Observable<IUserInfo>;
  private readonly targetUserUsernameSubject$: BehaviorSubject<
    string | undefined
  >;

  constructor(private route: ActivatedRoute, private store: Store<AppState>) {
    this.loggedInUserUsername$ = this.store.select(selectCurrentUserUsername);
    this.targetUserInfo$ = this.store.select(selectEditedUserInfo);

    this.targetUserUsernameSubject$ = new BehaviorSubject(undefined);
    this.targetUserInfo$
      .pipe(map((editedUserInfo) => editedUserInfo.username))
      .subscribe(this.targetUserUsernameSubject$);

    this.targetUserData$ = combineLatest([
      this.loggedInUserUsername$,
      this.targetUserUsernameSubject$,
    ]).pipe(
      map(([loggedInUserUsername, targetUserUsername]) => ({
        isEditingSelf: loggedInUserUsername === targetUserUsername,
        targetUserUsername,
      }))
    );

    this.fullNameFormControl = new ObservableFormControl(
      this.targetUserInfo$.pipe(
        map((targetUserInfo) => targetUserInfo.userFullName)
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
      .pipe(map((params) => params.get("username")))
      .subscribe((editedUserUsernameFromRoute) =>
        this.store.dispatch(
          loadUserToUpdate({
            targetUsername: editedUserUsernameFromRoute ?? undefined,
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
        targetUsername: this.targetUserUsernameSubject$.getValue(),
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
        targetUsername: this.targetUserUsernameSubject$.getValue(),
        newPassword: this.passwordFormControl.currentValue,
      })
    );
  }
}
