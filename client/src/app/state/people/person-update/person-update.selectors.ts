import { createFeatureSelector } from "@ngrx/store";

import { AppState } from "../../app.state";
import { createPersonSelector } from "../utils/selector.utils";
import { PersonUpdateState } from "./person-update.state";

export const personUpdateFeatureKey = "personUpdate";

export const selectPersonUpdateFeature = createFeatureSelector<
  AppState,
  PersonUpdateState
>(personUpdateFeatureKey);

export const selectEditedPerson = createPersonSelector(
  selectPersonUpdateFeature
);
