import { Component, OnInit, Input } from "@angular/core";
import { AuthService } from "../auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  username: string;
  password: string;

  constructor(private auth: AuthService) {}

  ngOnInit(): void {}

  login(event: Event): void {
    event.preventDefault();

    this.auth.login(this.username, this.password);
  }
}
