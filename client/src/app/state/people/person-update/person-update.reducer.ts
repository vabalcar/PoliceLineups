import { createReducer, on } from "@ngrx/store";

import { updateState } from "../../utils/reducer.utils";
import {
  loadPersonToUpdate,
  personToUpdateLoaded,
} from "./person-update.actions";
import { PersonUpdateState } from "./person-update.state";

export const initialState: PersonUpdateState = {};

export const userUpdateReducer = createReducer(
  initialState,
  on(loadPersonToUpdate, () => initialState),
  on(personToUpdateLoaded, updateState)
);
