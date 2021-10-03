import { getSelectors, RouterReducerState } from "@ngrx/router-store";
import { createFeatureSelector } from "@ngrx/store";
import { AppState } from "../app.reducer";

export const routerFeatureKey = "router";

export const selectRouterFeature = createFeatureSelector<
  AppState,
  RouterReducerState
>(routerFeatureKey);

export const {
  selectCurrentRoute,
  selectFragment,
  selectQueryParams,
  selectQueryParam,
  selectRouteParams,
  selectRouteParam,
  selectRouteData,
  selectUrl,
} = getSelectors(selectRouterFeature);
