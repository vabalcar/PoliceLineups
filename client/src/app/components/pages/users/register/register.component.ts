import { Component } from "@angular/core";

import { DefaultService } from "src/app/api/api/default.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
})
export class RegisterComponent {
  username: string;
  password: string;
  passwordAgain: string;
  isAdmin = false;
  fullName: string;

  constructor(private api: DefaultService) {}

  register(event: Event): void {
    event.preventDefault();

    if (this.password !== this.passwordAgain) {
      // TODO: notification
      return;
    }

    this.api
      .addUser({
        username: this.username,
        password: this.password,
        fullName: this.fullName,
        isAdmin: this.isAdmin,
      })
      .subscribe((response) => {
        // TODO: close registeration form and display notification
      });
  }
}
