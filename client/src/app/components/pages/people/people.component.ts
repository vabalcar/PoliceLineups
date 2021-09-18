import { Component, OnInit } from "@angular/core";

import { DefaultService } from "src/app/api/api/default.service";
import { Person } from "src/app/api/model/models";

@Component({
  selector: "app-people",
  templateUrl: "./people.component.html",
  styleUrls: ["./people.component.css"],
})
export class PeopleComponent implements OnInit {
  people: Person[];

  constructor(private api: DefaultService) {}

  ngOnInit() {
    this.api.getPeople().subscribe((p) => (this.people = p));
  }
}
