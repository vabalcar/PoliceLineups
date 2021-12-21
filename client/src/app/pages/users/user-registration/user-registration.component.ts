import { Component } from "@angular/core";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/state/app.state";
import {
  registerUser,
  validateUserName,
} from "src/app/state/users/user-registration/user-registration.actions";
import { selectUsernameValidationError } from "src/app/state/users/user-registration/user-registration.selectors";
import { EmailValidation } from "src/app/validations/users/email.validation";
import { FullNameValidation } from "src/app/validations/users/full-name.validation";
import {
  PasswordSetterValidation,
  PasswordValidationFormControls,
} from "src/app/validations/users/password-setter.validation";
import { UsernameValidation } from "src/app/validations/users/username.validation";
import { BeValidation } from "src/app/validations/utils/BeValidation";
import { ObservableFormControl } from "src/app/validations/utils/ObservableFormControl";

@Component({
  templateUrl: "./user-registration.component.html",
})
export class UserRegistrationComponent {
  readonly passwordValidationFormControls = PasswordValidationFormControls;

  readonly isAdminFormControl: ObservableFormControl<boolean>;
  readonly usernameValidation: UsernameValidation;
  readonly fullNameValidation: FullNameValidation;
  readonly passwordSetterValidation: PasswordSetterValidation;
  readonly emailValidation: EmailValidation;

  constructor(private store: Store<AppState>) {
    this.isAdminFormControl = new ObservableFormControl<boolean>();
    this.usernameValidation = new UsernameValidation(
      new BeValidation(
        (username) => this.store.dispatch(validateUserName({ username })),
        this.store.select(selectUsernameValidationError)
      )
    );
    this.fullNameValidation = new FullNameValidation();
    this.passwordSetterValidation = new PasswordSetterValidation();
    this.emailValidation = new EmailValidation();
  }

  register(): void {
    this.store.dispatch(
      registerUser({
        isAdmin: !!this.isAdminFormControl.value,
        username: this.usernameValidation.value,
        fullName: this.fullNameValidation.value,
        password: this.passwordSetterValidation.value,
        email: this.emailValidation.value,
      })
    );

    this.clearForm();
  }

  private clearForm() {
    this.isAdminFormControl.clearValue();
    this.usernameValidation.clearValue();
    this.fullNameValidation.clearValue();
    this.passwordSetterValidation.clearValue();
    this.emailValidation.clearValue();
  }
}
