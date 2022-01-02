import { Component, Input } from "@angular/core";
import { MatFormFieldAppearance } from "@angular/material/form-field";
import { EmailValidation } from "src/app/validations/users/email.validation";

@Component({
  selector: "app-email-selector",
  templateUrl: "./email-selector.component.html",
})
export class EmailSelectorComponent {
  @Input("appValidation")
  emailValidation: EmailValidation;

  @Input("appAppearance")
  appearance: MatFormFieldAppearance = "fill";
}
