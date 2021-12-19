import { createReducer, on } from "@ngrx/store";

import { loadUsersList, usersListLoaded } from "./users-list.actions";
import { adapter } from "./users-list.selectors";
import { UsersListState } from "./users-list.state";

export const initialState: UsersListState = adapter.getInitialState();

export const usersListReducer = createReducer(
  initialState,
  on(loadUsersList, () => initialState),
  on(usersListLoaded, (state, { users }) => adapter.setAll(users, state))
);
