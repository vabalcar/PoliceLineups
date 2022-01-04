import { createReducer, on } from "@ngrx/store";

import {
  lineupsListLoaded,
  loadAllLineups,
  loadCurrentUserLineups,
} from "./lineups-list.actions";
import { adapter } from "./lineups-list.selectors";
import { LineupsListState } from "./lineups-list.state";

export const initialState: LineupsListState = adapter.getInitialState();

export const lineupsListReducer = createReducer(
  initialState,
  on(loadCurrentUserLineups, () => initialState),
  on(loadAllLineups, () => initialState),
  on(lineupsListLoaded, (state, { lineups }) => adapter.setAll(lineups, state))
);
