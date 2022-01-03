import { createReducer, on } from "@ngrx/store";

import { updateState } from "../../utils/reducer.utils";
import {
  loadPersonToUpdate,
  personPhotoLoaded,
  personToUpdateLoaded,
  updatePersonPhoto,
} from "./person-update.actions";
import { PersonUpdateState } from "./person-update.state";

export const initialState: PersonUpdateState = {};

export const personUpdateReducer = createReducer(
  initialState,
  on(loadPersonToUpdate, () => initialState),
  on(personToUpdateLoaded, updateState),
  on(personPhotoLoaded, updateState),
  on(updatePersonPhoto, (state, action) =>
    updateState(state, { photoUrl: action.newPhoto.url })
  )
);
