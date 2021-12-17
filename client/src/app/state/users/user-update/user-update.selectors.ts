import { createFeatureSelector } from "@ngrx/store";
import { AppState } from "../../app.state";
import { createUserInfoSelector } from "../utils/selector.utils";
import { UserUpdateState } from "./user-update.state";

export const userUpdateFeatureKey = "userUpdate";

export const selectUserUpdateFeature = createFeatureSelector<
  AppState,
  UserUpdateState
>(userUpdateFeatureKey);

export const selectEditedUserInfo = createUserInfoSelector(
  selectUserUpdateFeature
);
