import { Component, Input } from "@angular/core";
import { MatFormFieldAppearance } from "@angular/material/form-field";
import { FullNameValidation } from "src/app/validations/full-name.validation";

@Component({
  selector: "app-full-name-selector",
  templateUrl: "./full-name-selector.component.html",
})
export class FullNameSelectorComponent {
  @Input("appValidation")
  fullNameValidation: FullNameValidation;

  @Input("appAppearance")
  appearance: MatFormFieldAppearance = "fill";

  @Input("appRequired")
  required = false;
}
