import { Component, Input } from "@angular/core";
import { MatFormFieldAppearance } from "@angular/material/form-field";
import { NationalityValidation } from "src/app/validations/people/nationality.validation";

import { nationalities } from "./utils/nationality.utils";

@Component({
  selector: "app-nationality-selector",
  templateUrl: "./nationality-selector.component.html",
})
export class NationalitySelectorComponent {
  @Input("appValidation")
  nationalityValidation: NationalityValidation;

  @Input("appAppearance")
  appearance: MatFormFieldAppearance = "fill";

  @Input("appRequired")
  required = false;

  readonly nationalities = nationalities;
}
