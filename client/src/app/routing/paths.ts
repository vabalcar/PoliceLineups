export enum StaticPath {
  root = "/",
  home = "/home",
  login = "/login",
  notAuthorized = "/not-authorized",
  pathNotFound = "/path-not-found",
  resourceNotFound = "/resource-not-found",
  usersList = "/users",
  userRegistration = "/users/registration",
  currentUserOverview = "/users/current",
  currentUserSettings = "/users/current/settings",
  peopleList = "/people",
  personImport = "/people/import",
  currentUserLineupsList = "/user/current/lineups",
  allLineupsList = "/lineups",
  newLineup = "/lineups/new",
}

export enum PathTemplate {
  userOverview = "users/:userId",
  userSettings = "users/:userId/settings",
  personOverview = "people/:personId",
  personEdit = "people/:personId/edit",
  lineupOverview = "lineups/:lineupId",
  lineupEdit = "lineups/:lineupId/edit",
}

export class DynamicPath {
  public static userOverview(userId: number): string {
    return `/users/${userId}`;
  }

  public static userSettings(userId: number): string {
    return `/users/${userId}/settings`;
  }

  public static personOverview(personId: number): string {
    return `/people/${personId}`;
  }

  public static personEdit(personId: number): string {
    return `/people/${personId}/edit`;
  }

  public static lineupOverview(lineupId: number): string {
    return `/lineups/${lineupId}`;
  }

  public static lineupEdit(lineupId: number): string {
    return `/lineups/${lineupId}/edit`;
  }
}
