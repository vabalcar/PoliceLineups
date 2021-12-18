import { Observable } from "rxjs";

import { BeValidation } from "./utils/BeValidation";
import { ErrorPublisher } from "./utils/ErrorPublisher";
import { FormValidation } from "./utils/FormValidation";
import { ObservableFormControl } from "./utils/ObservableFormControl";

export class RequiredValidation<T> extends FormValidation<T> {
  constructor(
    defaultValue$?: Observable<T>,
    backendValidation?: BeValidation<T>
  ) {
    const formControl = new ObservableFormControl(([validationErrorType]) => {
      switch (validationErrorType) {
        case "required":
          return "This value is required";
      }
    }, defaultValue$);

    super(
      formControl,
      new ErrorPublisher(
        [formControl.validationError$],
        backendValidation ? [backendValidation.error$] : undefined
      ),
      backendValidation
    );
  }
}
