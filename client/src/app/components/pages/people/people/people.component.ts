import { Component } from "@angular/core";
import { map } from "rxjs/operators";

import { DefaultService } from "src/app/api/api/default.service";

const PEOPLE_LIMIT = 30;

@Component({
  selector: "app-people",
  templateUrl: "./people.component.html",
  styleUrls: ["./people.component.css"],
})
export class PeopleComponent {
  people = this.api
    .getPeople()
    .pipe(map((people) => people.slice(0, PEOPLE_LIMIT)));

  constructor(private api: DefaultService) {}
}
