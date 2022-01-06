import { createAction, props } from "@ngrx/store";
import { Person } from "src/app/api/model/person";
import { PersonWithPhotoUrl } from "../../../utils/PersonWithPhotoUrl";

export const initPeopleList = createAction("[People list] init people list");

export const loadPeopleList = createAction(
  "[People list] load people list",
  props<{
    fullName?: string;
    minAge?: number;
    maxAge?: number;
    nationality?: string;
    withPhoto?: boolean;
  }>()
);

export const peopleListLoaded = createAction(
  "[People list] people list loaded",
  props<{ people: Person[]; loadPeoplePhotos?: boolean }>()
);

export const loadPeoplePhotos = createAction(
  "[People list] load people photos",
  props<{ people: Person[] }>()
);

export const peoplePhotosLoaded = createAction(
  "[People list] people photos loaded",
  props<{ people: PersonWithPhotoUrl[] }>()
);
