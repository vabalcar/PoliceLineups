import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { ErrorPublisher } from "../utils/ErrorPublisher";
import { FormValidation } from "../utils/FormValidation";
import { ObservableFormControl } from "../utils/ObservableFormControl";

export class AgeValidation extends FormValidation<number> {
  private static readonly validationErrorMessage = "A valid age is required";

  constructor(defaultValue$?: Observable<number>) {
    const formControl = new ObservableFormControl(
      defaultValue$,
      ([validationErrorType]) => {
        switch (validationErrorType) {
          case "required":
            return AgeValidation.validationErrorMessage;
        }
      }
    );

    super(
      formControl,
      new ErrorPublisher([
        formControl.validationError$,
        formControl.value$.pipe(
          map((age) =>
            (Number.isInteger(age) && age >= 0) || !age
              ? undefined
              : AgeValidation.validationErrorMessage
          )
        ),
      ])
    );
  }
}
