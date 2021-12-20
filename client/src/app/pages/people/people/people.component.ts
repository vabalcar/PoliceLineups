import { Component } from "@angular/core";
import { map } from "rxjs/operators";
import { DefaultService } from "src/app/api/api/default.service";
import { DynamicPath } from "src/app/routing/paths";

const PEOPLE_LIMIT = 30;

@Component({
  templateUrl: "./people.component.html",
  styleUrls: ["./people.component.css"],
})
export class PeopleComponent {
  people = this.api
    .getPeople()
    .pipe(map((people) => people.slice(0, PEOPLE_LIMIT)));

  readonly dynamicPath = DynamicPath;

  constructor(private api: DefaultService) {}
}
