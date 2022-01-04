import { createEntityAdapter, EntityAdapter } from "@ngrx/entity";
import { createFeatureSelector, createSelector } from "@ngrx/store";
import { LineupOverview } from "src/app/api/model/lineupOverview";

import { AppState } from "../../app.state";
import { LineupsListState } from "./lineups-list.state";

export const lineupsListFeatureKey = "lineupsList";

export const adapter: EntityAdapter<LineupOverview> = createEntityAdapter({
  selectId: (lineup) => lineup.lineupId,
});

const { selectAll } = adapter.getSelectors();

export const selectLineupsListFeature = createFeatureSelector<
  AppState,
  LineupsListState
>(lineupsListFeatureKey);

export const selectLineupsList = createSelector(
  selectLineupsListFeature,
  selectAll
);
