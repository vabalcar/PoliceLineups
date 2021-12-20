import { Observable } from "rxjs";

import { ErrorPublisher } from "../utils/ErrorPublisher";
import { FormValidation } from "../utils/FormValidation";
import { ObservableFormControl } from "../utils/ObservableFormControl";

export class EmailValidation extends FormValidation<string> {
  constructor(defaultValue$?: Observable<string>) {
    const formControl = new ObservableFormControl(
      defaultValue$,
      ([validationErrorType]) => {
        switch (validationErrorType) {
          case "required":
          case "email":
            return `A valid email address is required`;
        }
      }
    );

    super(formControl, new ErrorPublisher([formControl.validationError$]));
  }
}
