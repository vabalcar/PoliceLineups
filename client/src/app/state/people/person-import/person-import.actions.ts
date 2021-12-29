import { createAction, props } from "@ngrx/store";
import { Person } from "src/app/api/model/person";

export const importPerson = createAction(
  "[Person import] request",
  props<Person>()
);

export const personImportSuccessful = createAction("[Person import] success");

export const personImportFailed = createAction(
  "[Person import] failure",
  props<{ error: string }>()
);
