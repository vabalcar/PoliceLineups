import { createEntityAdapter, EntityAdapter } from "@ngrx/entity";
import { createFeatureSelector, createSelector } from "@ngrx/store";
import { PersonWithPhotoUrl } from "src/app/utils/PersonWithPhotoUrl";

import { AppState } from "../../app.state";
import { LineupUpdateState } from "./lineup-update.state";

export const lineupUpdateFeatureKey = "lineupUpdate";

export const adapter: EntityAdapter<PersonWithPhotoUrl> = createEntityAdapter({
  selectId: (person) => person.personId,
});

const { selectAll } = adapter.getSelectors();

export const selectLineupUpdateFeature = createFeatureSelector<
  AppState,
  LineupUpdateState
>(lineupUpdateFeatureKey);

export const selectLineupPeople = createSelector(
  selectLineupUpdateFeature,
  selectAll
);
