import { EntityState } from "@ngrx/entity";

import { PersonWithPhotoUrl } from "../utils/PersonWithPhotoUrl";

export type PeopleListState = EntityState<PersonWithPhotoUrl>;
