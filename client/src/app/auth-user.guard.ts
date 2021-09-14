import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";

import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class UserAuthGuard implements CanActivate {
  constructor(private auth: AuthService) {}

  canActivate(next: ActivatedRouteSnapshot): boolean {
    return this.auth.canAccess(next.url.toString(), false);
  }
}
