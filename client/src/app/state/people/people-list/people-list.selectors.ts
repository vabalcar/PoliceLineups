import { createEntityAdapter, EntityAdapter } from "@ngrx/entity";
import { createFeatureSelector, createSelector } from "@ngrx/store";

import { AppState } from "../../app.state";
import { PersonWithPhotoUrl } from "../utils/PersonWithPhotoUrl";
import { PeopleListState } from "./people-list.state";

export const peopleListFeatureKey = "peopleList";

export const adapter: EntityAdapter<PersonWithPhotoUrl> = createEntityAdapter({
  selectId: (person) => person.personId,
});

const { selectAll } = adapter.getSelectors();

export const selectPeopleListFeature = createFeatureSelector<
  AppState,
  PeopleListState
>(peopleListFeatureKey);

export const selectPeopleList = createSelector(
  selectPeopleListFeature,
  selectAll
);
