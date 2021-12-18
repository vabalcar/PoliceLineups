import { createSelector, Selector } from "@ngrx/store";

import { AppState } from "../../app.state";
import { IUserInfo } from "./IUserInfo";

export const createUserInfoSelector = <TFeatureState extends IUserInfo>(
  featureSelector: Selector<AppState, TFeatureState>
) =>
  createSelector(
    featureSelector,
    (state: TFeatureState) =>
      ({
        userId: state.userId,
        username: state.username,
        fullName: state.fullName,
        isAdmin: state.isAdmin,
      } as IUserInfo)
  );
