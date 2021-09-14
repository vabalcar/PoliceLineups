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

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {}

  login(event: Event): void {
    event.preventDefault();

    const urlPrefix = "/login";
    const url = this.router.url;
    const path =
      url.startsWith(urlPrefix) && url.length !== urlPrefix.length
        ? url.substring(urlPrefix.length)
        : "/";

    this.auth.login(this.username, this.password, path);
  }
}
