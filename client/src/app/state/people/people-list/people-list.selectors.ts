import { createEntityAdapter, EntityAdapter } from "@ngrx/entity";
import { createFeatureSelector, createSelector } from "@ngrx/store";
import { Person } from "src/app/api/model/person";

import { AppState } from "../../app.state";
import { PeopleListState } from "./people-list.state";

export const peopleListFeatureKey = "peopleList";

export const adapter: EntityAdapter<Person> = createEntityAdapter<Person>({
  selectId: (person: Person) => person.personId,
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
