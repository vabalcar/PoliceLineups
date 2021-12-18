import { Component } from "@angular/core";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/state/app.state";
import {
  registerUser,
  validateUserName,
} from "src/app/state/users/user-registration/user-registration.actions";
import { selectUsernameValidationError } from "src/app/state/users/user-registration/user-registration.selectors";
import { FullNameValidation } from "src/app/validations/users/full-name.validation";
import {
  PasswordSetterValidation,
  PasswordValidationFormControls,
} from "src/app/validations/users/password-setter.validation";
import { UsernameValidation } from "src/app/validations/users/username.validation";
import { BeValidation } from "src/app/validations/utils/BeValidation";
import { ObservableFormControl } from "src/app/validations/utils/ObservableFormControl";

@Component({
  selector: "app-register",
  templateUrl: "./user-registration.component.html",
})
export class UserRegistrationComponent {
  readonly passwordValidationFormControls = PasswordValidationFormControls;

  readonly usernameValidation: UsernameValidation;
  readonly fullNameValidation: FullNameValidation;
  readonly passwordSetterValidation: PasswordSetterValidation;
  readonly isAdminFormControl: ObservableFormControl<boolean>;

  constructor(private store: Store<AppState>) {
    this.usernameValidation = new UsernameValidation(
      new BeValidation(
        (username) => this.store.dispatch(validateUserName({ username })),
        this.store.select(selectUsernameValidationError)
      )
    );
    this.fullNameValidation = new FullNameValidation();
    this.passwordSetterValidation = new PasswordSetterValidation();
    this.isAdminFormControl = new ObservableFormControl<boolean>();
  }

  register(): void {
    this.store.dispatch(
      registerUser({
        username: this.usernameValidation.value,
        password: this.passwordSetterValidation.value,
        fullName: this.fullNameValidation.value,
        isAdmin: !!this.isAdminFormControl.value,
      })
    );
  }
}
