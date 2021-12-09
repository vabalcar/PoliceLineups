import { Component } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { AppState } from "src/app/state/app.state";
import { selectUrl } from "src/app/state/router/router.selectors";

@Component({
  selector: "app-not-found",
  templateUrl: "./not-found.component.html",
})
export class NotFoundComponent {
  readonly url: Observable<string>;

  constructor(private store: Store<AppState>) {
    this.url = this.store
      .select(selectUrl)
      .pipe(map((url) => (url === "/not-found" ? undefined : url)));
  }
}
