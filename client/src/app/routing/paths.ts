export enum StaticPath {
  root = "/",
  home = "/home",
  login = "/login",
  notAuthorized = "/not-authorized",
  pathNotFound = "/path-not-found",
  resourceNotFound = "/resource-not-found",
  userRegistration = "/users/registration",
  usersList = "/users",
  currentUserOverview = "/users/current",
  currentUserSettings = "/users/current/settings",
  personImport = "/people/import",
  peopleList = "/people",
}

export enum PathTemplate {
  userOverview = "users/:userId",
  userSettings = "users/:userId/settings",
  personOverview = "people/:personId",
  personEdit = "people/:personId/edit",
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
}
