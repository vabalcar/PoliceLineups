import { Component } from "@angular/core";
import { StaticPath } from "src/app/routing/paths";

@Component({
  templateUrl: "./resource-not-found.component.html",
})
export class ResourceNotFoundComponent {
  readonly staticPath = StaticPath;
}
