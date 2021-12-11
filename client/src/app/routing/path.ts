export enum StaticPath {
  register = "/register",
  users = "/users",
  currentUser = "/user/current",
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
  user = "user/:userId",
  person = "person/:personId",
}

export class DynamicPath {
  public static user(userId: number): string {
    return `/user/${userId}`;
  }

  public static person(personId: number): string {
    return `/person/${personId}`;
  }
}
