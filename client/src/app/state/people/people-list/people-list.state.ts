import { EntityState } from "@ngrx/entity";
import { Person } from "src/app/api/model/person";

export type PeopleListState = EntityState<Person>;
