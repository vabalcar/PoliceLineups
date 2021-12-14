import { FormControl, ValidationErrors } from "@angular/forms";
import { BehaviorSubject, merge, Observable, Subscription } from "rxjs";
import { filter, map, share } from "rxjs/operators";
import { ValidationError } from "./ValidationError";

export class ObservableFormControl<T> extends FormControl {
  readonly value$: Observable<T>;
  readonly validationError$: Observable<string | null>;

  private readonly valueSubject$: BehaviorSubject<T>;
  private readonly defaultValueSubscription: Subscription;

  constructor(
    translateValidationError?: (
      validationError: ValidationError
    ) => string | undefined,
    defaultvalue$?: Observable<T>
  ) {
    super();

    this.validationError$ = merge(
      this.statusChanges.pipe(
        filter((status) => status === "INVALID"),
        map(() => this.errors),
        filter((errors) => !!errors),
        map(ObservableFormControl.getFirstValidationError),
        map(
          (validationError) =>
            (translateValidationError &&
              translateValidationError(validationError)) ||
            JSON.stringify(validationError)
        )
      ),
      this.statusChanges.pipe(
        filter((status) => status === "VALID"),
        map(() => null)
      )
    );

    this.valueSubject$ = new BehaviorSubject(this.value);
    this.valueChanges.subscribe(this.valueSubject$);
    this.value$ = this.valueSubject$.asObservable().pipe(share());

    this.defaultValueSubscription = defaultvalue$
      ?.pipe(filter((value) => value !== undefined && value !== null))
      .subscribe((value) => {
        if (this.pristine) {
          this.setValue(value);
        }
        this.defaultValueSubscription?.unsubscribe();
      });
  }

  private static getFirstValidationError(
    angularFormsValidationErrors: ValidationErrors
  ): ValidationError | null {
    const validationErrors = Object.entries(
      angularFormsValidationErrors
    ) as ValidationError[];
    return validationErrors.length > 0 ? validationErrors[0] : null;
  }
}
