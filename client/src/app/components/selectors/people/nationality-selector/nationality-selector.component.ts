import { Component, Input } from "@angular/core";
import { MatFormFieldAppearance } from "@angular/material/form-field";
import { RequiredValidation } from "src/app/validations/required.validation";

import { nationalities } from "./utils/nationality.utils";

@Component({
  selector: "app-nationality-selector",
  templateUrl: "./nationality-selector.component.html",
})
export class NationalitySelectorComponent {
  @Input("appValidation")
  nationalityValidation: RequiredValidation<string>;

  @Input("appAppearance")
  appearance: MatFormFieldAppearance = "fill";

  readonly nationalities = nationalities;
}
