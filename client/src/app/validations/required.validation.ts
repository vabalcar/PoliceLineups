import { Observable } from "rxjs";

import { BeValidation } from "./utils/BeValidation";
import { ErrorPublisher } from "./utils/ErrorPublisher";
import { FormValidation } from "./utils/FormValidation";
import { ObservableFormControl } from "./utils/ObservableFormControl";

export class RequiredValidation<T> extends FormValidation<T> {
  constructor(
    inputName: string,
    defaultValue$?: Observable<T>,
    beValidation?: BeValidation<T>
  ) {
    const formControl = new ObservableFormControl(
      defaultValue$,
      ([validationErrorType]) => {
        switch (validationErrorType) {
          case "required":
            return `${inputName} is required`;
        }
      }
    );

    super(
      formControl,
      new ErrorPublisher(
        [formControl.validationError$],
        beValidation ? [beValidation.error$] : undefined
      ),
      beValidation
    );
  }
}
