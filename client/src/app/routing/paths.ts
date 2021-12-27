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
  import = "/import",
  people = "/people",
}

export enum PathTemplate {
  userOverview = "users/:userId",
  userSettings = "users/:userId/settings",
  person = "person/:personId",
}

export class DynamicPath {
  public static userOverview(userId: number): string {
    return `/users/${userId}`;
  }

  public static userSettings(userId: number): string {
    return `/users/${userId}/settings`;
  }

  public static person(personId: number): string {
    return `/person/${personId}`;
  }
}
