import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { DefaultService } from "src/app/api/api/default.service";
import { Person } from "src/app/api/model/models";

interface IPersonFeature {
  name: string;
  value: string;
}

const isUppercase = (s: string): boolean => s?.toUpperCase() === s;

const parseFeature = (feature: string): IPersonFeature => {
  const featureDescriptions = feature.split(" ");

  const featureName: string = featureDescriptions
    .filter(isUppercase)
    .reduce((prev, curr) => `${prev} ${curr}`);

  const featureValue: string = featureDescriptions.find(
    (description) => !isUppercase(description)
  );

  return { name: featureName, value: featureValue };
};

@Component({
  selector: "app-person",
  templateUrl: "./person.component.html",
  styleUrls: ["./person.component.css"],
})
export class PersonComponent implements OnInit {
  person: Person;
  features: IPersonFeature[];

  constructor(private route: ActivatedRoute, private api: DefaultService) {}

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get("personId");
    this.api.getPerson(id).subscribe((person) => {
      this.features = person.features.split(",").map(parseFeature);
      person.features = undefined;
      this.person = person;
    });
  }
}
