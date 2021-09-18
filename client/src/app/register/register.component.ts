import { Component, OnInit } from "@angular/core";
import { DefaultService } from "../api/api/default.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
})
export class RegisterComponent implements OnInit {
  username: string;
  password: string;
  passwordAgain: string;
  fullName: string;
  isAdmin: boolean;

  constructor(private api: DefaultService) {}

  ngOnInit(): void {}

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
        name: this.fullName,
        isAdmin: this.isAdmin,
      })
      .subscribe((response) => {
        // TODO: close registeration form and display notification
      });
  }
}
