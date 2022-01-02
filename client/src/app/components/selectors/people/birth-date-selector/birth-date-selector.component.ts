import { Component, Input } from "@angular/core";
import { MatFormFieldAppearance } from "@angular/material/form-field";
import { RequiredValidation } from "src/app/validations/required.validation";

@Component({
  selector: "app-birth-date-selector",
  templateUrl: "./birth-date-selector.component.html",
})
export class BirthDateSelectorComponent {
  @Input("appValidation")
  birthDateValidation: RequiredValidation<Date>;

  @Input("appAppearance")
  appearance: MatFormFieldAppearance = "fill";
}
