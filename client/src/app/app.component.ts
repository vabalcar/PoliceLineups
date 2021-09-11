import { Component, Inject, OnInit } from "@angular/core";
import { BASE_PATH } from "./api/variables";
import { AuthService } from "./auth.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  title = "client";
  showLogout = false;

  constructor(
    @Inject(BASE_PATH) public backend: string,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.auth.loggedIn.subscribe((loggedIn) => (this.showLogout = loggedIn));
  }
}
