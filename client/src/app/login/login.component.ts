import { Component, OnInit, Input } from "@angular/core";
import { AuthService } from "../auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  private static readonly redirectedLoginUrlPrefix = "/login";

  username: string;
  password: string;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {}

  login(event: Event): void {
    event.preventDefault();

    const path = this.getOriginallyRedirectedPath();
    this.auth.login(this.username, this.password, path);
  }

  private getOriginallyRedirectedPath() {
    const url = this.router.url;
    return url.startsWith(LoginComponent.redirectedLoginUrlPrefix) &&
      url.length !== LoginComponent.redirectedLoginUrlPrefix.length
      ? url.substring(LoginComponent.redirectedLoginUrlPrefix.length)
      : "/";
  }
}
