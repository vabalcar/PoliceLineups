import { createAction, props } from "@ngrx/store";
import { PeopleBody } from "src/app/api/model/peopleBody";

export const importPerson = createAction(
  "[Person import] request",
  props<PeopleBody>()
);

export const personImportSuccessful = createAction("[Person import] success");

export const personImportFailed = createAction(
  "[Person import] failure",
  props<{ error: string }>()
);
