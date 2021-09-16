import { Component, OnInit } from "@angular/core";
import { DefaultService } from "../api/api/default.service";

@Component({
  selector: "app-user-settings",
  templateUrl: "./user-settings.component.html",
  styleUrls: ["./user-settings.component.css"],
})
export class UserSettingsComponent implements OnInit {
  username: string;
  password: string;
  passwordAgain: string;
  fullName: string = "Test";
  isAdmin: boolean;

  constructor(private api: DefaultService) {}

  ngOnInit(): void {}

  updateUserPassword(event: Event): void {
    event.preventDefault();

    if (this.password !== this.passwordAgain) {
      // TODO: notification
      return;
    }

    // TODO: call API
  }

  updateUserFullName(event: Event): void {
    event.preventDefault();

    // TODO: call API
  }
}
