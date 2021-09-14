import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate } from "@angular/router";

import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class AdminAuthGuard implements CanActivate {
  constructor(private auth: AuthService) {}

  canActivate(next: ActivatedRouteSnapshot): boolean {
    return this.auth.canAccess(next.url.toString(), true);
  }
}
