import { ErrorStateMatcher } from "@angular/material/core";
import { BehaviorSubject, combineLatest, Observable, of } from "rxjs";
import { map, share } from "rxjs/operators";

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
