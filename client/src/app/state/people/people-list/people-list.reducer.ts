import { createReducer, on } from "@ngrx/store";

import { loadPeopleList, peopleListLoaded } from "./people-list.actions";
import { adapter } from "./people-list.selectors";
import { PeopleListState } from "./people-list.state";

export const initialState: PeopleListState = adapter.getInitialState();

export const peopleListReducer = createReducer(
  initialState,
  on(loadPeopleList, () => initialState),
  on(peopleListLoaded, (state, { people }) => adapter.setAll(people, state))
);
