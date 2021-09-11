import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../auth.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
})
export class RegisterComponent implements OnInit {
  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {}

  register(event: Event): void {
    event.preventDefault();
    const target = event.target as Element;
    const username = (target.querySelector("#username") as HTMLInputElement)
      .value;
    const password = (target.querySelector("#password") as HTMLInputElement)
      .value;
    const passwordAgain = (
      target.querySelector("#password-again") as HTMLInputElement
    ).value;
    const fullName = (target.querySelector("#fullname") as HTMLInputElement)
      .value;
    const email = (target.querySelector("#email") as HTMLInputElement).value;
  }
}
