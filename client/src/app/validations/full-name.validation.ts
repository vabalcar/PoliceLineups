import { Observable } from "rxjs";
import {
  ErrorPublisher,
  ObservableFormControl,
  FormValidation,
  BeValidation,
} from "./utils/validation.utils";

export class FullNameValidation extends FormValidation<string> {
  constructor(
    backendValidation: BeValidation<string>,
    defaultValue$: Observable<string>
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
