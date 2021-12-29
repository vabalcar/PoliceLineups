import { createAction, props } from "@ngrx/store";

import { PersonUpdateState } from "./person-update.state";

export const loadPersonToUpdate = createAction(
  "[Person update] load person",
  props<{ targePersonId?: number }>()
);

export const personToUpdateLoaded = createAction(
  "[Person update] load person successful",
  props<PersonUpdateState>()
);

export const updatePersonFullName = createAction(
  "[Person update] update full name",
  props<{ targetPersonId?: number; newFullName: string }>()
);

export const personFullNameUpdateSuccessful = createAction(
  "[Person update] full name update successful"
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
