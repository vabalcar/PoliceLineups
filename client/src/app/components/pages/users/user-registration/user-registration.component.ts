import { Component } from "@angular/core";
import { Store } from "@ngrx/store";

import { AppState } from "src/app/state/app.state";
import {
  registerUser,
  validateUserFullname,
} from "src/app/state/users/user-registration/user-registration.actions";
import { selectUserFullnameValidationError } from "src/app/state/users/user-registration/user-registration.selectors";
import { FullNameValidation } from "src/app/validations/full-name.validation";
import {
  PasswordValidation,
  PasswordValidationFormControls,
} from "src/app/validations/password.validation";
import { RequiredValidation } from "src/app/validations/required.validation";
import { BeValidation } from "src/app/validations/utils/BeValidation";
import { ObservableFormControl } from "src/app/validations/utils/ObservableFormControl";

@Component({
  selector: "app-register",
  templateUrl: "./user-registration.component.html",
})
export class UserRegistrationComponent {
  readonly passwordValidationFormControls = PasswordValidationFormControls;

  readonly usernameValidation: RequiredValidation<string>;
  readonly passwordValidation: PasswordValidation;
  readonly fullNameValidation: FullNameValidation;
  readonly isAdminFormControl: ObservableFormControl<boolean>;

  constructor(private store: Store<AppState>) {
    this.usernameValidation = new RequiredValidation();
    this.passwordValidation = new PasswordValidation();
    this.fullNameValidation = new FullNameValidation(
      new BeValidation(
        (fullName) => this.store.dispatch(validateUserFullname({ fullName })),
        this.store.select(selectUserFullnameValidationError)
      )
    );
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
