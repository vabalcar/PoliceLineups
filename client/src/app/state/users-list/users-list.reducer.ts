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
import { updateState } from "../utils/reducer.utils";

export const usersListFeatureKey = "usersList";

// State
export interface UsersListState {
  users: User[];
}

// Selectors
export const selectUsersListFeature = createFeatureSelector<
  AppState,
  UsersListState
>(usersListFeatureKey);

export const selectUsersList = createSelector(
  selectUsersListFeature,
  (state: UsersListState) => state.users
);

// Actions
export const loadUsersListAction = createAction("[Users list] load");

export const usersListLoadedAction = createAction(
  "[Users list] loaded",
  props<Pick<UsersListState, "users">>()
);

// State manipulation
export const initialState: UsersListState = {
  users: [],
};

export const usersListReducer = createReducer(
  initialState,
  on(loadUsersListAction, () => initialState),
  on(usersListLoadedAction, updateState)
);
