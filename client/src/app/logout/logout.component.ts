import { ThrowStmt } from "@angular/compiler";
import { Component, OnInit } from "@angular/core";
import { AuthService } from "../auth.service";

@Component({
  selector: "app-logout",
  templateUrl: "./logout.component.html",
  styleUrls: ["./logout.component.css"],
})
export class LogoutComponent implements OnInit {
  message = "";

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    if (this.auth.isLoggedIn) {
      this.auth.logout();
      this.message = "logged out";
    } else {
      this.message = "no action needed";
    }
  }
}
