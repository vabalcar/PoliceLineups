import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-not-found",
  templateUrl: "./not-found.component.html",
})
export class NotFoundComponent {
  readonly url = this.router.url;

  constructor(private router: Router) {}
}
