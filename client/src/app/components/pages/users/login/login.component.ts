import { Component } from "@angular/core";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { AppState } from "src/app/state/app.state";

import { loginAction } from "src/app/state/auth/auth.actions";
import { selectLoginFailedCount } from "src/app/state/auth/auth.selectors";
import { RequiredValidation } from "src/app/validations/required.validation";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
})
export class LoginComponent {
  readonly usernameValidation: RequiredValidation<string>;
  readonly passwordValidation: RequiredValidation<string>;

  readonly loginFailedCountSubscription: Subscription;

  constructor(private store: Store<AppState>) {
    this.loginFailedCountSubscription = this.store
      .select(selectLoginFailedCount)
      .subscribe((count) => {
        if (count > 0) {
          this.usernameValidation?.clearValue();
          this.passwordValidation?.clearValue();
        }
      });

    this.usernameValidation = new RequiredValidation();
    this.passwordValidation = new RequiredValidation();
  }

  login(): void {
    this.store.dispatch(
      loginAction({
        username: this.usernameValidation.value,
        password: this.passwordValidation.value,
      })
    );
  }
}
