import { Component, Input } from "@angular/core";
import { MatFormFieldAppearance } from "@angular/material/form-field";
import { AgeValidation } from "src/app/validations/people/age.validation";

@Component({
  selector: "app-age-selector",
  templateUrl: "./age-selector.component.html",
})
export class AgeSelectorComponent {
  @Input("appValidation")
  ageValidation: AgeValidation;

  @Input("appAppearance")
  appearance: MatFormFieldAppearance = "fill";

  @Input("appRequired")
  required = false;

  @Input("appLabel")
  label = "Age";
}
