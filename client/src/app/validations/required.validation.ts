import { Observable } from "rxjs";
import { BeValidation } from "./utils/BeValidation";
import { FormValidation } from "./utils/FormValidation";
import { ErrorPublisher } from "./utils/ErrorPublisher";
import { ObservableFormControl } from "./utils/ObservableFormControl";

export class RequiredValidation<T> extends FormValidation<T> {
  constructor(
    backendValidation?: BeValidation<T>,
    defaultValue$?: Observable<T>
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
