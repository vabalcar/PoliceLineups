import { createEntityAdapter, EntityAdapter } from "@ngrx/entity";
import { createFeatureSelector, createSelector } from "@ngrx/store";
import { PersonWithPhotoUrl } from "src/app/utils/PersonWithPhotoUrl";

import { AppState } from "../../app.state";
import { LineupRecommendationsState } from "./lineup-recommendations.state";

export const lineupRecommendationsFeatureKey = "lineupRecommendations";

export const adapter: EntityAdapter<PersonWithPhotoUrl> = createEntityAdapter({
  selectId: (person) => person.personId,
});

const { selectAll } = adapter.getSelectors();

export const selectLineupRecommendationsFeature = createFeatureSelector<
  AppState,
  LineupRecommendationsState
>(lineupRecommendationsFeatureKey);

export const selectLineupRecommendations = createSelector(
  selectLineupRecommendationsFeature,
  selectAll
);
