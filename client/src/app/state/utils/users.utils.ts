import { createSelector, Selector } from "@ngrx/store";
import { AppState } from "../app.reducer";
import { IUserInfo } from "../auth/auth.reducer";

export const createUserInfoSelector = <TFeatureState extends IUserInfo>(
  featureSelector: Selector<AppState, TFeatureState>
) =>
  createSelector(
    featureSelector,
    (state: TFeatureState) =>
      ({
        username: state.username,
        userFullName: state.userFullName,
        isAdmin: state.isAdmin,
      } as IUserInfo)
  );
