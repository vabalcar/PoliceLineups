import { EntityState } from "@ngrx/entity";
import { LineupOverview } from "src/app/api/model/lineupOverview";
import { PersonWithPhotoUrl } from "src/app/utils/PersonWithPhotoUrl";

export interface LineupUpdateState extends EntityState<PersonWithPhotoUrl> {
  lineup: LineupOverview;
}
