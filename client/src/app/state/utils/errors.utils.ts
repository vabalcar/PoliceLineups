import { HttpErrorResponse } from "@angular/common/http";
import { TypedAction } from "@ngrx/store/src/models";
import { iif, Observable, of, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";

import { beFailed } from "../app.actions";

export const catchBeError = <T, R extends string>(
  status?: number,
  project?: (beFailedProps: ReturnType<typeof beFailed>) => TypedAction<R>
) =>
  catchError<T, Observable<T | TypedAction<R> | ReturnType<typeof beFailed>>>(
    (error) =>
      iif(
        status !== undefined
          ? () => error instanceof HttpErrorResponse && status === error.status
          : () => error instanceof HttpErrorResponse,
        project
          ? of(beFailed({ errorResponse: error })).pipe(map(project))
          : of(beFailed({ errorResponse: error })),
        throwError(error)
      )
  );
