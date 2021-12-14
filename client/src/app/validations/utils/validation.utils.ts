import { FormControl, ValidationErrors } from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";
import {
  BehaviorSubject,
  combineLatest,
  merge,
  Observable,
  of,
  Subscription,
} from "rxjs";
import { filter, map, share } from "rxjs/operators";

export class BeValidation<T> {
  constructor(
    readonly validationEventDispatch: (value: T) => void,
    readonly error$: Observable<string>
  ) {}
}

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
}

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
    backendValidation?: BeValidation<T>
  ) {
    super(formControl.value$, errorPublisher, backendValidation);
  }
}

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
}

export class ErrorPublisher implements ErrorStateMatcher {
  readonly error$: Observable<string | null>;
  readonly feError$: Observable<string | null>;
  readonly beError$: Observable<string | null>;

  private readonly unicastError$: Observable<string | null>;
  private readonly errorSubject$: BehaviorSubject<string | null>;

  constructor(
    feErrorSources?: Observable<string | null>[],
    beErrorSources?: Observable<string | null>[]
  ) {
    const unicastFeError$ = ErrorPublisher.reduceErrorSources(
      feErrorSources?.length ? feErrorSources : [of(null)]
    );

    const unicastBeError$ = ErrorPublisher.reduceErrorSources(
      beErrorSources?.length ? beErrorSources : [of(null)]
    );

    this.unicastError$ = ErrorPublisher.reduceErrorSources([
      unicastFeError$,
      unicastBeError$,
    ]);

    this.errorSubject$ = new BehaviorSubject(null);
    this.unicastError$.subscribe(this.errorSubject$);

    this.feError$ = unicastFeError$.pipe(share());
    this.beError$ = unicastBeError$.pipe(share());
    this.error$ = this.errorSubject$.asObservable().pipe(share());
  }

  private static reduceErrorSources(
    errorSources: Observable<string | null>[]
  ): Observable<string | null> {
    return combineLatest(errorSources).pipe(
      map((errors) => errors.reduce((prev, curr) => (prev ? prev : curr)))
    );
  }

  isErrorState(): boolean {
    return !!this.errorSubject$.getValue();
  }
}

export type RequiredValidationErrorProps = {
  required: boolean;
};

export type MinLengthValidationErrorProps = {
  requiredLength: number;
  actualLength: number;
};

export type ValidationError =
  | ["required", RequiredValidationErrorProps]
  | ["minlength", MinLengthValidationErrorProps];

export class ObservableFormControl<T> extends FormControl {
  readonly validationError$: Observable<string | null>;
  readonly value$: Observable<T>;

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
