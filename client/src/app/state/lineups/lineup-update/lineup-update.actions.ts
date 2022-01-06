import { createAction, props } from "@ngrx/store";
import { LineupOverview } from "src/app/api/model/lineupOverview";
import { Person } from "src/app/api/model/person";
import { PersonWithPhotoUrl } from "../../../utils/PersonWithPhotoUrl";

export const loadLineup = createAction(
  "[Lineup update] load",
  props<{ lineupId: number }>()
);

export const lineupLoaded = createAction(
  "[Lineup update] people loaded",
  props<{ lineup: LineupOverview; people: Person[] }>()
);

export const lineupPeoplePhotosLoaded = createAction(
  "[Lineup update] people photos loaded",
  props<{ people: PersonWithPhotoUrl[] }>()
);

export const initializeLineup = createAction("[Lineup update] initialize");

export const addPersonToLineup = createAction(
  "[Lineup update] add person to lineup",
  props<{ person: PersonWithPhotoUrl }>()
);

export const removePersonFromLineup = createAction(
  "[Lineup update] remove person from lineup",
  props<{ personId: number }>()
);

export const saveNewLineup = createAction(
  "[Lineup update] save new lineup",
  props<{ name: string }>()
);

export const lineupSavingSuccessful = createAction(
  "[Lineup update] lineup saving successful"
);

export const lineupSavingFailed = createAction(
  "[Lineup update] lineup saving failed",
  props<{ error: string }>()
);

export const deleteLineup = createAction(
  "[Lineup update] delete lineup",
  props<{ lineupId: number }>()
);

export const lineupDeletionSuccessful = createAction(
  "[Lineup update] lineup deletion successful"
);

export const lineupDeletionFailed = createAction(
  "[Lineup update] lineup deletion failed",
  props<{ error: string }>()
);
