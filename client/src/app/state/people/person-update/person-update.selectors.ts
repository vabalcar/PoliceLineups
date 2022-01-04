import { createFeatureSelector, createSelector } from "@ngrx/store";

import { createPersonSelector } from "../../../utils/selector.utils";
import { AppState } from "../../app.state";
import { PersonUpdateState } from "./person-update.state";

export const personUpdateFeatureKey = "personUpdate";

export const selectPersonUpdateFeature = createFeatureSelector<
  AppState,
  PersonUpdateState
>(personUpdateFeatureKey);

export const selectEditedPerson = createPersonSelector(
  selectPersonUpdateFeature
);

export const selectPersonPhotoUrl = createSelector(
  selectPersonUpdateFeature,
  (state: PersonUpdateState) => state.photoUrl
);

export const selectPersonPhotoBlobName = createSelector(
  selectPersonUpdateFeature,
  (state: PersonUpdateState) => state.photoBlobName
);
