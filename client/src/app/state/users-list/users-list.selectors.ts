import { EntityAdapter, createEntityAdapter } from "@ngrx/entity";
import { createFeatureSelector, createSelector } from "@ngrx/store";
import { User } from "src/app/api/model/user";
import { AppState } from "../app.state";
import { UsersListState } from "./users-list.state";

export const usersListFeatureKey = "usersList";

export const adapter: EntityAdapter<User> = createEntityAdapter<User>({
  selectId: (user: User) => user.userId,
});

const { selectAll } = adapter.getSelectors();

export const selectUsersListFeature = createFeatureSelector<
  AppState,
  UsersListState
>(usersListFeatureKey);

export const selectUsersList = createSelector(
  selectUsersListFeature,
  selectAll
);
