import { Component } from "@angular/core";
import { StaticPath } from "src/app/routing/paths";

@Component({
  templateUrl: "./not-authorized.component.html",
})
export class NotAuthorizedComponent {
  readonly staticPath = StaticPath;
}
