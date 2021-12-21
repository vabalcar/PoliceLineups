export enum StaticPath {
  userRegistration = "/users/registration",
  users = "/users",
  currentUser = "/users/current",
  import = "/import",
  people = "/people",
  login = "/login",
  default = "/",
  home = "/home",
  notAuthorized = "/not-authorized",
  pathNotFound = "/path-not-found",
  resourceNotFound = "/resource-not-found",
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
