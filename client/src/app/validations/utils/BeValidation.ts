import { Observable } from "rxjs";

export class BeValidation<T> {
  constructor(
    readonly validationTrigger: (value: T) => void,
    readonly error$: Observable<string>
  ) {}
}
