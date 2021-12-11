import { Component } from "@angular/core";
import { StaticPath } from "src/app/routing/path";

@Component({
  selector: "app-not-found",
  templateUrl: "./not-found.component.html",
})
export class NotFoundComponent {
  readonly staticPath = StaticPath;
}
