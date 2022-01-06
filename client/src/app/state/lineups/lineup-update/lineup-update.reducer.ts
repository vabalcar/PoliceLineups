import { createReducer, on } from "@ngrx/store";

import {
  loadLineup,
  lineupLoaded,
  lineupPeoplePhotosLoaded,
  removePersonFromLineup,
  initializeLineup,
  addPersonToLineup,
} from "./lineup-update.actions";
import { adapter } from "./lineup-update.selectors";
import { LineupUpdateState } from "./lineup-update.state";

export const initialState: LineupUpdateState = {
  ...adapter.getInitialState(),
  lineup: undefined,
};

export const lineupUpdateReducer = createReducer(
  initialState,
  on(initializeLineup, () => initialState),
  on(loadLineup, () => initialState),
  on(lineupLoaded, (state, { lineup, people }) =>
    adapter.setAll(people, { ...state, lineup })
  ),
  on(lineupPeoplePhotosLoaded, (state, { people }) =>
    adapter.setAll(people, state)
  ),
  on(addPersonToLineup, (state, { person }) => adapter.addOne(person, state)),
  on(removePersonFromLineup, (state, { personId }) =>
    adapter.removeOne(personId, state)
  )
);
