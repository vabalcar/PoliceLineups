import { Observable } from "rxjs";

import { ErrorPublisher } from "../utils/ErrorPublisher";
import { FormValidation } from "../utils/FormValidation";
import { ObservableFormControl } from "../utils/ObservableFormControl";

export class DateValidation extends FormValidation<Date> {
  constructor(defaultValue$?: Observable<Date>) {
    const formControl = new ObservableFormControl(
      defaultValue$,
      ([validationErrorType]) => {
        switch (validationErrorType) {
          case "required":
          case "matDatepickerParse":
            return "A valid date is required";
        }
      }
    );

    super(formControl, new ErrorPublisher([formControl.validationError$]));
  }
}
