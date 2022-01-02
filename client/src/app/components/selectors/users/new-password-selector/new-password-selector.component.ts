import { Component, Input } from "@angular/core";
import { MatFormFieldAppearance } from "@angular/material/form-field";
import {
  PasswordSetterValidation,
  PasswordValidationFormControls,
} from "src/app/validations/users/password-setter.validation";

@Component({
  selector: "app-new-password-selector",
  templateUrl: "./new-password-selector.component.html",
})
export class NewPasswordSelectorComponent {
  @Input("appValidation")
  passwordSetterValidation: PasswordSetterValidation;

  @Input("appAppearance")
  appearance: MatFormFieldAppearance = "fill";

  @Input("appGapWidth")
  gapWidth = "32px";

  readonly passwordValidationFormControls = PasswordValidationFormControls;
}
