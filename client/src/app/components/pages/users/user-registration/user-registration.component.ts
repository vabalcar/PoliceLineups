import { Component } from "@angular/core";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/state/app.state";
import {
  registerUser,
  validateUserName,
} from "src/app/state/users/user-registration/user-registration.actions";
import {
  selectUsernameValidationError,
} from "src/app/state/users/user-registration/user-registration.selectors";
import { RequiredValidation } from "src/app/validations/required.validation";
import {
  PasswordSetterValidation,
  PasswordValidationFormControls,
} from "src/app/validations/users/password-setter.validation";
import { BeValidation } from "src/app/validations/utils/BeValidation";
import {
  ObservableFormControl,
} from "src/app/validations/utils/ObservableFormControl";

@Component({
  selector: "app-register",
  templateUrl: "./user-registration.component.html",
})
export class UserRegistrationComponent {
  readonly passwordValidationFormControls = PasswordValidationFormControls;

  readonly usernameValidation: RequiredValidation<string>;
  readonly passwordValidation: PasswordSetterValidation;
  readonly fullNameValidation: RequiredValidation<string>;
  readonly isAdminFormControl: ObservableFormControl<boolean>;

  constructor(private store: Store<AppState>) {
    this.usernameValidation = new RequiredValidation(
      undefined,
      new BeValidation(
        (username) => this.store.dispatch(validateUserName({ username })),
        this.store.select(selectUsernameValidationError)
      )
    );
    this.passwordValidation = new PasswordSetterValidation();
    this.fullNameValidation = new RequiredValidation<string>();
    this.isAdminFormControl = new ObservableFormControl<boolean>();
  }

  register(): void {
    this.store.dispatch(
      registerUser({
        username: this.usernameValidation.value,
        password: this.passwordValidation.value,
        fullName: this.fullNameValidation.value,
        isAdmin: !!this.isAdminFormControl.value,
      })
    );
  }
}
