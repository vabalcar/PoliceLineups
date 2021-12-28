import { createReducer, on } from "@ngrx/store";

import { logout } from "../auth/auth.actions";
import {
  getSavedFeatureState,
  updateSavedFeatureState,
} from "../utils/reducer.utils";
import { toggleMenuDrawer } from "./menu.actions";
import { menuFeatureName } from "./menu.selectors";
import { MenuState } from "./menu.state";

const defaultState: MenuState = {
  isMenuDrawerOpened: false,
};

export const initialState: MenuState =
  getSavedFeatureState<MenuState>(menuFeatureName) ?? defaultState;

const updateState = (state: MenuState, ...updates: Partial<MenuState>[]) =>
  updateSavedFeatureState(menuFeatureName, state, ...updates);

export const menuReducer = createReducer(
  initialState,
  on(toggleMenuDrawer, (state) =>
    updateState(state, { isMenuDrawerOpened: !state.isMenuDrawerOpened })
  ),
  on(logout, (state) => updateState(state, { isMenuDrawerOpened: false }))
);
