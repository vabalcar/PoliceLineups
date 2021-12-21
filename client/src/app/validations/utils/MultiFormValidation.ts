import { Observable } from "rxjs";

import { BeValidation } from "./BeValidation";
import { ErrorPublisher } from "./ErrorPublisher";
import { FormValidationBase } from "./FormValidationBase";
import { ObservableFormControl } from "./ObservableFormControl";

export abstract class MultiFormValidation<T, K> extends FormValidationBase<T> {
  get pristine(): boolean {
    for (const formControl of this.formControls.values()) {
      if (!formControl.pristine) {
        return false;
      }
    }

    return true;
  }

  constructor(
    readonly formControls: Map<K, ObservableFormControl<T>>,
    value$: Observable<T>,
    errorPublisher: ErrorPublisher,
    backendValidation?: BeValidation<T>
  ) {
    super(value$, errorPublisher, backendValidation);
  }

  clearValue(emitEvent: boolean = false): void {
    for (const formControl of this.formControls.values()) {
      formControl.clearValue(emitEvent);
    }
  }
}
