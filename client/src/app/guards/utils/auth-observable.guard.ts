import { CanActivate, Router } from "@angular/router";
import { Observable, Subscription } from "rxjs";
import { filter } from "rxjs/operators";
import { StaticPath } from "src/app/routing/paths";

export abstract class ObservableAuthGuard implements CanActivate {
  protected readonly redirectionOnUnauthorized: Subscription;

  constructor(
    protected router: Router,
    protected readonly isAuthorized$: Observable<boolean>
  ) {
    this.redirectionOnUnauthorized = this.isAuthorized$
      .pipe(filter((isAuthorized) => !isAuthorized))
      .subscribe(() => this.router.navigateByUrl(StaticPath.notAuthorized));
  }

  canActivate(): Observable<boolean> {
    return this.isAuthorized$;
  }
}
