export enum StaticPath {
  root = "/",
  home = "/home",
  login = "/login",
  notAuthorized = "/not-authorized",
  pathNotFound = "/path-not-found",
  resourceNotFound = "/resource-not-found",
  userRegistration = "/users/registration",
  usersList = "/users",
  currentUser = "/users/current",
  import = "/import",
  people = "/people",
}

export enum PathTemplate {
  user = "users/:userId",
  person = "person/:personId",
}

export class DynamicPath {
  public static user(userId: number): string {
    return `/users/${userId}`;
  }

  public static person(personId: number): string {
    return `/person/${personId}`;
  }
}
