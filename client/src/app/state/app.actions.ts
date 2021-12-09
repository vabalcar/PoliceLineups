import { HttpErrorResponse } from "@angular/common/http";
import { createAction, props } from "@ngrx/store";

export const beFailed = createAction(
  "BE failed",
  props<{ errorResponse: HttpErrorResponse }>()
);
