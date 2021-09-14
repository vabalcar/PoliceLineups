import { Component, Inject, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { BASE_PATH } from "./api/variables";
import { AuthService } from "./auth.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  showLogout = false;

  constructor(
    @Inject(BASE_PATH) public backend: string,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.auth.isLoggedIn$.subscribe((loggedIn) => (this.showLogout = loggedIn));
  }

  redirectToLogin() {
    this.router.navigateByUrl("/login");
  }

  logout() {
    this.auth.logout();
  }
}
