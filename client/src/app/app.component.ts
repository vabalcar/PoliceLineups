import { Component, OnInit } from "@angular/core";
import { AuthService } from "./auth.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  isLoggedIn = false;
  isAdminLoggedIn = false;
  userFullName: string;

  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.auth.isLoggedIn$.subscribe((loggedIn) => (this.isLoggedIn = loggedIn));
    this.auth.isAdmin$.subscribe((isAdmin) => (this.isAdminLoggedIn = isAdmin));
    this.auth.userFullName$.subscribe(
      (userFullName) => (this.userFullName = userFullName)
    );
  }

  logout() {
    this.auth.logout();
  }
}
