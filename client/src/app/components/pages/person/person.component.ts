import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { DefaultService } from "../../../api/api/default.service";
import { Person } from "../../../api/model/models";

@Component({
  selector: "app-person",
  templateUrl: "./person.component.html",
  styleUrls: ["./person.component.css"],
})
export class PersonComponent implements OnInit {
  person: Person;
  features: Array<any>;

  constructor(private route: ActivatedRoute, private api: DefaultService) {
    this.person = {} as Person;
  }

  static isUppercase(s: string): boolean {
    return s.toUpperCase() === s;
  }

  static parseFeature(feature: string) {
    const featureDesc = feature.split(" ");
    let featureName = "";
    let featureValue = "";

    for (var i = 0; i < featureDesc.length; ++i) {
      if (PersonComponent.isUppercase(featureDesc[i])) {
        if (featureName.length === 0) {
          featureName = featureDesc[i];
        } else {
          featureName += ` ${featureDesc[i]}`;
        }
      } else {
        if (featureValue.length === 0) {
          featureValue = featureDesc[i];
        } else {
          featureValue += ` ${featureDesc[i]}`;
        }
      }
    }

    return { name: featureName, value: featureValue };
  }

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get("id");
    this.api.getPerson(id).subscribe((p) => {
      this.features = p.features.split(",").map(PersonComponent.parseFeature);
      this.person = p;
    });
  }
}
