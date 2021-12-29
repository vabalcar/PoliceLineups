import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { DefaultService } from "src/app/api/api/default.service";
import { Person } from "src/app/api/model/models";

@Component({
  templateUrl: "./person.component.html",
  styleUrls: ["./person.component.css"],
})
export class PersonComponent implements OnInit {
  person: Person;

  constructor(private route: ActivatedRoute, private api: DefaultService) {}

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get("personId");
    this.api.getPerson(id).subscribe((person) => {
      this.person = person;
    });
  }
}
