import { Component } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { StaticPath } from "src/app/routing/paths";
import { AppState } from "src/app/state/app.state";
import { selectUrl } from "src/app/state/router/router.selectors";

@Component({
  templateUrl: "./path-not-found.component.html",
})
export class PathNotFoundComponent {
  readonly staticPath = StaticPath;

  readonly url$: Observable<string>;

  constructor(private store: Store<AppState>) {
    this.url$ = this.store
      .select(selectUrl)
      .pipe(map((url) => (url === StaticPath.pathNotFound ? undefined : url)));
  }
}
