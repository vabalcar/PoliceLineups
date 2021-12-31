import { createAction, props } from "@ngrx/store";

import { PersonUpdateState } from "./person-update.state";

export const loadPersonToUpdate = createAction(
  "[Person update] load person",
  props<{ targetPersonId?: number }>()
);

export const personToUpdateLoaded = createAction(
  "[Person update] load person successful",
  props<PersonUpdateState>()
);

export const personPhotoLoaded = createAction(
  "[Person update] load person photo successful",
  props<Pick<PersonUpdateState, "photoUrl">>()
);

export const updatePersonFullName = createAction(
  "[Person update] update full name",
  props<{ targetPersonId?: number; newFullName: string }>()
);

export const personFullNameUpdateSuccessful = createAction(
  "[Person update] full name update successful"
);

export const updatePersonBirthDate = createAction(
  "[Person update] update birth date",
  props<{ targetPersonId?: number; newBirthDate: Date }>()
);

export const personBirthDateUpdateSuccessful = createAction(
  "[Person update] birth date update successful"
);

export const updatePersonNationality = createAction(
  "[Person update] update nationality",
  props<{ targetPersonId?: number; newNationality: string }>()
);

export const personNationalityUpdateSuccessful = createAction(
  "[Person update] nationality update successful"
);

export const personUpdateFailed = createAction(
  "[Person update] update failed",
  props<{ error: string }>()
);

export const deletePerson = createAction(
  "[Person update] deletion",
  props<{ targetPersonId?: number }>()
);

export const personDeletionSuccessful = createAction(
  "[Person update] deletion successful"
);

export const personDeletionFailed = createAction(
  "[Person update] deletion failed",
  props<{ error: string }>()
);
