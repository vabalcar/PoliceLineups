import { Component, Input } from "@angular/core";
import { MatFormFieldAppearance } from "@angular/material/form-field";
import { UsernameValidation } from "src/app/validations/users/username.validation";

@Component({
  selector: "app-username-selector",
  templateUrl: "./username-selector.component.html",
})
export class UsernameSelectorComponent {
  @Input("appValidation")
  usernameValidation: UsernameValidation;

  @Input("appAppearance")
  appearance: MatFormFieldAppearance = "fill";
}
