import { Observable } from "rxjs";

import { BeValidation } from "./BeValidation";
import { ErrorPublisher } from "./ErrorPublisher";

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
    protected readonly beValidation?: BeValidation<T>
  ) {}

  triggerBeValidation(): void {
    if (
      !this.beValidation ||
      this.pristine ||
      this.errorPublisher.isFeErrorState()
    ) {
      return;
    }

    this.beValidation.validationTrigger(this.value);
  }

  triggerBeRevalidation(): void {
    if (!this.errorPublisher.isBeErrorState()) {
      return;
    }

    this.beValidation.validationTrigger(this.value);
  }

  abstract clearValue(emitEvent: boolean): void;
}
