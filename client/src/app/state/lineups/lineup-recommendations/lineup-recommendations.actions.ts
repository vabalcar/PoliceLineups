import { createAction, props } from "@ngrx/store";
import { Person } from "src/app/api/model/person";
import { PersonWithPhotoUrl } from "src/app/utils/PersonWithPhotoUrl";

export const initLineupRecommendations = createAction(
  "[Lineup recommendations] init lineup recommendations"
);

export const loadLineupRecommendations = createAction(
  "[Lineup recommendations] load lineup recommendations",
  props<{ people: Person[] }>()
);

export const lineupRecommendationsLoaded = createAction(
  "[Lineup recommendations] lineup recommendations loaded",
  props<{ people: Person[] }>()
);

export const recommendedPeoplePhotosLoaded = createAction(
  "[Lineup recommendations] recommended people photos loaded",
  props<{ people: PersonWithPhotoUrl[] }>()
);
