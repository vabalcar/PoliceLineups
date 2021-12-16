import { Observable } from "rxjs";
import { BeValidation } from "./utils/BeValidation";
import { FormValidation } from "./utils/FormValidation";
import { ErrorPublisher } from "./utils/ErrorPublisher";
import { ObservableFormControl } from "./utils/ObservableFormControl";

export class FullNameValidation extends FormValidation<string> {
  constructor(
    backendValidation: BeValidation<string>,
    defaultValue$?: Observable<string>
  ) {
    const formControl = new ObservableFormControl(([validationErrorType]) => {
      switch (validationErrorType) {
        case "required":
          return "Full name is required";
      }
    }, defaultValue$);

    super(
      formControl,
      new ErrorPublisher(
        [formControl.validationError$],
        [backendValidation.error$]
      ),
      backendValidation
    );
  }
}
