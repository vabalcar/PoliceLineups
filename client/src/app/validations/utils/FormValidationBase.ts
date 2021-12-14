import { Observable } from "rxjs";
import { ErrorPublisher } from "./ErrorPublisher";
import { BeValidation } from "./BeValidation";

export abstract class FormValidationBase<T> {
  abstract get pristine(): boolean;
  abstract get value(): T;

  get error$(): Observable<string> {
    return this.errorPublisher.error$;
  }

  get invalid(): boolean {
    return this.pristine || this.errorPublisher.isErrorState();
  }

  constructor(
    readonly value$: Observable<T>,
    readonly errorPublisher: ErrorPublisher,
    protected readonly backendValidation?: BeValidation<T>
  ) {
    if (backendValidation) {
      this.value$.subscribe(this.backendValidation.validationEventDispatch);
    }
  }

  abstract clearValue(): void;
}
