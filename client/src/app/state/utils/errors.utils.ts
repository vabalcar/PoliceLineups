import { HttpErrorResponse } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { beFailed } from "../app.reducer";

export const catchBeError = <T>() =>
  catchError<T, Observable<ReturnType<typeof beFailed>> | Observable<T>>(
    (error, caught) =>
      error instanceof HttpErrorResponse
        ? of(beFailed({ errorResponse: error }))
        : caught
  );
