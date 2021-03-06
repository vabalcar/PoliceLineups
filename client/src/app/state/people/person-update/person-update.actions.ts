import { createAction, props } from "@ngrx/store";
import { BlobHandle } from "src/app/utils/BlobHandle";

import { PersonUpdateState } from "./person-update.state";

export const loadPersonToUpdate = createAction(
  "[Person update] load person",
  props<{ targetPersonId?: number }>()
);

export const personToUpdateLoaded = createAction(
  "[Person update] load person successful",
  props<PersonUpdateState>()
);

export const loadPersonPhoto = createAction(
  "[Person update] load person photo",
  props<Pick<PersonUpdateState, "personId" | "photoBlobName">>()
);

export const personPhotoLoaded = createAction(
  "[Person update] load person photo successful",
  props<Pick<PersonUpdateState, "personId" | "photoUrl">>()
);

export const updatePersonPhoto = createAction(
  "[Person update] update photo",
  props<{ targetPersonId?: number; newPhoto: BlobHandle }>()
);

export const personPhotoUpdateSuccessful = createAction(
  "[Person update] photo update successful"
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
