import { Component, OnInit, Input } from "@angular/core";
import { AuthService } from "../auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {}

  login(event: Event): void {
    event.preventDefault();
    const target = event.target as Element;
    const username = (target.querySelector("#username") as HTMLInputElement)
      .value;
    const password = (target.querySelector("#password") as HTMLInputElement)
      .value;
    const urlPrefix = "/login";
    const url = this.router.url;
    const path =
      url.startsWith(urlPrefix) && url.length !== urlPrefix.length
        ? url.substring(urlPrefix.length)
        : "/";
    this.auth.login(username, password, path);
  }
}
