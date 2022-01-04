import { createSelector, Selector } from "@ngrx/store";
import { Person } from "src/app/api/model/person";

import { AppState } from "../state/app.state";
import { pick } from "../state/utils/object.utils";

export const createPersonSelector = <TFeatureState extends Person>(
  featureSelector: Selector<AppState, TFeatureState>
) =>
  createSelector(featureSelector, (state: TFeatureState) =>
    pick(
      state,
      "personId",
      "photoBlobName",
      "fullName",
      "birthDate",
      "nationality"
    )
  );
