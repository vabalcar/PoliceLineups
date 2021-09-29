import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import {
  createAction,
  createFeatureSelector,
  createReducer,
  createSelector,
  on,
  props,
} from "@ngrx/store";
import { User } from "src/app/api/model/user";
import { AppState } from "../app.reducer";

export const usersListFeatureKey = "usersList";

// State
export type UsersListState = EntityState<User>;

export const adapter: EntityAdapter<User> = createEntityAdapter<User>({
  selectId: (user: User) => user.username,
});

// Selectors
const { selectAll } = adapter.getSelectors();

export const selectUsersListFeature = createFeatureSelector<
  AppState,
  UsersListState
>(usersListFeatureKey);

export const selectUsersList = createSelector(
  selectUsersListFeature,
  selectAll
);

// Actions
export const loadUsersListAction = createAction("[Users list] load");

export const usersListLoadedAction = createAction(
  "[Users list] loaded",
  props<{ users: User[] }>()
);

// State manipulation
export const initialState: UsersListState = adapter.getInitialState();

export const usersListReducer = createReducer(
  initialState,
  on(loadUsersListAction, () => initialState),
  on(usersListLoadedAction, (state, { users }) => adapter.setAll(users, state))
);
