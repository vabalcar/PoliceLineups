import { Component } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { AppState } from "src/app/state/app.reducer";
import { selectUrl } from "src/app/state/router/router.selectors";

@Component({
  selector: "app-not-found",
  templateUrl: "./not-found.component.html",
})
export class NotFoundComponent {
  readonly url: Observable<string>;

  constructor(private store: Store<AppState>) {
    this.url = this.store.select(selectUrl);
  }
}
