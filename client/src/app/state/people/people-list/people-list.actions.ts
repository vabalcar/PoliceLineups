import { createAction, props } from "@ngrx/store";
import { Person } from "src/app/api/model/person";

export const loadPeopleList = createAction("[People list] load people list");

export const peopleListLoaded = createAction(
  "[People list] people list loaded",
  props<{ people: Person[] }>()
);
