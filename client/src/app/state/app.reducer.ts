import { routerReducer } from "@ngrx/router-store";
import { ActionReducerMap } from "@ngrx/store";

import { authReducer } from "./auth/auth.reducer";
import { lineupRecommendationsReducer } from "./lineups/lineup-recommendations/lineup-recommendations.reducer";
import { lineupUpdateReducer } from "./lineups/lineup-update/lineup-update.reducer";
import { lineupsListReducer } from "./lineups/lineups-list/lineups-list.reducer";
import { menuReducer } from "./menu/menu.reducer";
import { peopleListReducer } from "./people/people-list/people-list.reducer";
import { personUpdateReducer } from "./people/person-update/person-update.reducer";
import { userRegistrationReducer } from "./users/user-registration/user-registration.reducer";
import { userUpdateReducer } from "./users/user-update/user-update.reducer";
import { usersListReducer } from "./users/users-list/users-list.reducer";

export const reducers: ActionReducerMap<Record<string, unknown>> = {
  router: routerReducer,
  menu: menuReducer,
  auth: authReducer,
  userRegistration: userRegistrationReducer,
  userUpdate: userUpdateReducer,
  usersList: usersListReducer,
  personUpdate: personUpdateReducer,
  peopleList: peopleListReducer,
  lineupUpdate: lineupUpdateReducer,
  lineupsList: lineupsListReducer,
  lineupRecommendations: lineupRecommendationsReducer,
};
