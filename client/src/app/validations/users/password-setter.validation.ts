import { combineLatest } from "rxjs";
import { map } from "rxjs/operators";

import { ErrorPublisher } from "../utils/ErrorPublisher";
import { MultiFormValidation } from "../utils/MultiFormValidation";
import { ObservableFormControl } from "../utils/ObservableFormControl";
import { MinLengthValidationErrorProps } from "../utils/ValidationError";

export enum PasswordValidationFormControls {
  password,
  passwordAgain,
}

export class PasswordSetterValidation extends MultiFormValidation<
  string,
  PasswordValidationFormControls
> {
  public get value(): string {
    return this.formControls.get(PasswordValidationFormControls.password).value;
  }

  constructor() {
    const formControls = new Map<
      PasswordValidationFormControls,
      ObservableFormControl<string>
    >([
      [
        PasswordValidationFormControls.password,
        new ObservableFormControl(
          undefined,
          ([validationErrorType, validationErrorProps]) => {
            switch (validationErrorType) {
              case "required":
                return "Password is required";
              case "minlength":
                validationErrorProps =
                  validationErrorProps as MinLengthValidationErrorProps;
                return `Password has to be at least ${validationErrorProps.requiredLength} characters long`;
            }
          }
        ),
      ],
      [
        PasswordValidationFormControls.passwordAgain,
        new ObservableFormControl(),
      ],
    ]);

    super(
      formControls,
      formControls.get(PasswordValidationFormControls.password).value$,
      new ErrorPublisher([
        formControls.get(PasswordValidationFormControls.password)
          .validationError$,
        combineLatest([
          formControls.get(PasswordValidationFormControls.password).value$,
          formControls.get(PasswordValidationFormControls.passwordAgain).value$,
        ]).pipe(
          map(([password, passwordAgain]) =>
            password === passwordAgain ? null : "passwords don't match"
          )
        ),
      ])
    );
  }
}
