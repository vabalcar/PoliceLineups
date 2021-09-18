import { Component, OnInit } from "@angular/core";
import { AuthService } from "../auth.service";

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

    this.auth.login(this.username, this.password).subscribe((success) => {
      if (!success) {
        console.log(`Login failed`);
        this.username = undefined;
        this.password = undefined;
      }
    });
  }
}
