import { createSelector, Selector } from "@ngrx/store";
import { User } from "src/app/api/model/user";

import { AppState } from "../../app.state";

export const createUserInfoSelector = <TFeatureState extends User>(
  featureSelector: Selector<AppState, TFeatureState>
) =>
  createSelector(featureSelector, (state: TFeatureState) => ({
    ...state,
  }));
