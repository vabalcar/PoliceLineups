import { Component } from "@angular/core";
import { StaticPath } from "src/app/routing/paths";

@Component({
  selector: "app-not-found",
  templateUrl: "./resource-not-found.component.html",
})
export class ResourceNotFoundComponent {
  readonly staticPath = StaticPath;
}