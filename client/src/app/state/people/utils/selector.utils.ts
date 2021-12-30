import { createSelector, Selector } from "@ngrx/store";
import { Person } from "src/app/api/model/person";

import { AppState } from "../../app.state";
import { pick } from "../../utils/object.utils";

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
