import { createAction, props } from "@ngrx/store";
import { User } from "src/app/api/model/user";

export const loadUsersListAction = createAction("[Users list] load");

export const usersListLoadedAction = createAction(
  "[Users list] loaded",
  props<{ users: User[] }>()
);
