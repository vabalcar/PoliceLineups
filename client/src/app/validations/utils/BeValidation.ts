import { Observable } from "rxjs";

export class BeValidation<T> {
  constructor(
    readonly validationEventDispatch: (value: T) => void,
    readonly error$: Observable<string>
  ) {}
}
