import { BeValidation } from "./BeValidation";
import { ErrorPublisher } from "./ErrorPublisher";
import { FormValidationBase } from "./FormValidationBase";
import { ObservableFormControl } from "./ObservableFormControl";

export abstract class FormValidation<T> extends FormValidationBase<T> {
  get pristine(): boolean {
    return this.formControl.pristine;
  }

  get value(): T {
    return this.formControl.value;
  }

  constructor(
    readonly formControl: ObservableFormControl<T>,
    errorPublisher: ErrorPublisher,
    beValidation?: BeValidation<T>
  ) {
    super(formControl.value$, errorPublisher, beValidation);
  }

  clearValue(emitEvent: boolean = false): void {
    this.formControl.clearValue(emitEvent);
  }

  markAsPristine(): void {
    this.formControl.markAsPristine();
  }
}
