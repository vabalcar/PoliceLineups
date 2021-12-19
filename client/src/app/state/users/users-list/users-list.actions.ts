import { createAction, props } from "@ngrx/store";
import { User } from "src/app/api/model/user";

export const loadUsersList = createAction("[Users list] load users list");

export const usersListLoaded = createAction(
  "[Users list] users list loaded",
  props<{ users: User[] }>()
);
