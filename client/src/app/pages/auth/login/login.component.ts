import { Component } from "@angular/core";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { AppState } from "src/app/state/app.state";
import { login } from "src/app/state/auth/auth.actions";
import { selectLoginFailedCount } from "src/app/state/auth/auth.selectors";
import { RequiredValidation } from "src/app/validations/required.validation";
import { UsernameValidation } from "src/app/validations/users/username.validation";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
})
export class LoginComponent {
  readonly usernameValidation: UsernameValidation;
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

    this.usernameValidation = new UsernameValidation();
    this.passwordValidation = new RequiredValidation("Password");
  }

  login(): void {
    this.store.dispatch(
      login({
        username: this.usernameValidation.value,
        password: this.passwordValidation.value,
      })
    );
  }
}
