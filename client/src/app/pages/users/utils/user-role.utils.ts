export type UserRole = "Admin" | "User";

export const adminRole: UserRole = "Admin";
export const basicUserRole: UserRole = "User";

export const getUserRole = (isAdmin: boolean): UserRole =>
  isAdmin ? adminRole : basicUserRole;
