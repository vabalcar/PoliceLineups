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
  on(personPhotoLoaded, (state, action) =>
    state.personId === action.personId
      ? updateState(state, { photoUrl: action.photoUrl })
      : state
  ),
  on(updatePersonPhoto, (state, action) =>
    updateState(state, { photoUrl: action.newPhoto.url })
  )
);
