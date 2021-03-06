import { Component, Input } from "@angular/core";
import { MatFormFieldAppearance } from "@angular/material/form-field";
import { DateValidation } from "src/app/validations/people/date.validation";

@Component({
  selector: "app-birth-date-selector",
  templateUrl: "./birth-date-selector.component.html",
})
export class BirthDateSelectorComponent {
  @Input("appValidation")
  birthDateValidation: DateValidation;

  @Input("appAppearance")
  appearance: MatFormFieldAppearance = "fill";

  @Input("appRequired")
  required = false;
}
