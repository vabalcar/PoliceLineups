import { Component } from "@angular/core";
import { StaticPath } from "src/app/routing/path";

@Component({
  selector: "app-not-authorized",
  templateUrl: "./not-authorized.component.html",
})
export class NotAuthorizedComponent {
  readonly staticPath = StaticPath;
}
