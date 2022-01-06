import { createReducer, on } from "@ngrx/store";

import {
  initializeLineup,
  loadLineup,
} from "../lineup-update/lineup-update.actions";
import {
  initLineupRecommendations,
  lineupRecommendationsLoaded,
  loadLineupRecommendations,
  recommendedPeoplePhotosLoaded,
} from "./lineup-recommendations.actions";
import { adapter } from "./lineup-recommendations.selectors";
import { LineupRecommendationsState } from "./lineup-recommendations.state";

export const initialState: LineupRecommendationsState =
  adapter.getInitialState();

export const lineupRecommendationsReducer = createReducer(
  initialState,
  on(initializeLineup, () => initialState),
  on(loadLineup, () => initialState),
  on(initLineupRecommendations, () => initialState),
  on(loadLineupRecommendations, () => initialState),
  on(lineupRecommendationsLoaded, (state, { people }) =>
    adapter.setAll(people, state)
  ),
  on(recommendedPeoplePhotosLoaded, (state, { people }) =>
    adapter.setAll(people, state)
  )
);
