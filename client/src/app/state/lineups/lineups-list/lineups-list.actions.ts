import { createAction, props } from "@ngrx/store";
import { LineupOverview } from "src/app/api/model/lineupOverview";

export const loadAllLineups = createAction("[Lineups list] load all lineups");
export const loadCurrentUserLineups = createAction(
  "[Lineups list] load current user lineups"
);

export const lineupsListLoaded = createAction(
  "[Lineups list] loaded",
  props<{ lineups: LineupOverview[] }>()
);
