import { EntityState } from "@ngrx/entity";
import { PersonWithPhotoUrl } from "src/app/utils/PersonWithPhotoUrl";

export type LineupUpdateState = EntityState<PersonWithPhotoUrl>;
