import { Component, Input } from "@angular/core";
import { MatFormFieldAppearance } from "@angular/material/form-field";
import { FullNameValidation } from "src/app/validations/full-name.validation";

@Component({
  selector: "app-lineup-name-selector",
  templateUrl: "./lineup-name-selector.component.html",
})
export class LineupNameSelectorComponent {
  @Input("appValidation")
  lineupNameValidation: FullNameValidation;

  @Input("appAppearance")
  appearance: MatFormFieldAppearance = "fill";

  @Input("appRequired")
  required = false;
}
