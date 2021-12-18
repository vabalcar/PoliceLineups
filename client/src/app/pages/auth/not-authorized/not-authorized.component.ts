import { Component } from "@angular/core";
import { StaticPath } from "src/app/routing/paths";

@Component({
  selector: "app-not-authorized",
  templateUrl: "./not-authorized.component.html",
})
export class NotAuthorizedComponent {
  readonly staticPath = StaticPath;
}
