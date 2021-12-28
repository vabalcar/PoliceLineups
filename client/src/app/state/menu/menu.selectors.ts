import { createFeatureSelector, createSelector } from "@ngrx/store";

import { AppState } from "../app.state";
import { MenuState } from "./menu.state";

export const menuFeatureName = "menu";

export const selectMenuFeature = createFeatureSelector<AppState, MenuState>(
  menuFeatureName
);

export const selectIsMenuDrawerOpened = createSelector(
  selectMenuFeature,
  (state: MenuState) => state.isMenuDrawerOpened
);
