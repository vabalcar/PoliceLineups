import { createReducer, on } from "@ngrx/store";

import { personPhotoLoaded } from "../person-update/person-update.actions";
import {
  initPeopleList,
  loadPeopleList,
  peopleListLoaded,
  peoplePhotosLoaded,
} from "./people-list.actions";
import { adapter } from "./people-list.selectors";
import { PeopleListState } from "./people-list.state";

export const initialState: PeopleListState = adapter.getInitialState();

export const peopleListReducer = createReducer(
  initialState,
  on(initPeopleList, () => initialState),
  on(loadPeopleList, () => initialState),
  on(peopleListLoaded, (state, { people }) => adapter.setAll(people, state)),
  on(personPhotoLoaded, (state, action) =>
    adapter.updateOne(
      { id: action.personId, changes: { photoUrl: action.photoUrl } },
      state
    )
  ),
  on(peoplePhotosLoaded, (state, { people }) => adapter.setAll(people, state))
);
