import { createReducer, on } from "@ngrx/store";

import {
  loadUsersListAction,
  usersListLoadedAction,
} from "./users-list.actions";
import { adapter } from "./users-list.selectors";
import { UsersListState } from "./users-list.state";

export const initialState: UsersListState = adapter.getInitialState();

export const usersListReducer = createReducer(
  initialState,
  on(loadUsersListAction, () => initialState),
  on(usersListLoadedAction, (state, { users }) => adapter.setAll(users, state))
);
