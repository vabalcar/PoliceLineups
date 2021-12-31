import { Component, OnInit } from "@angular/core";
import { SafeUrl } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { combineLatest, Observable } from "rxjs";
import { filter, map } from "rxjs/operators";
import { Person } from "src/app/api/model/person";
import { DynamicPath, StaticPath } from "src/app/routing/paths";
import { AppState } from "src/app/state/app.state";
import { loadPersonToUpdate } from "src/app/state/people/person-update/person-update.actions";
import {
  selectEditedPerson,
  selectPersonPhotoUrl,
} from "src/app/state/people/person-update/person-update.selectors";

import { isId } from "../../utils/validations.utils";

interface IPersonOverviewComponentData {
  person: Person;
  personPhotoUrl: SafeUrl;
}

@Component({
  templateUrl: "./person-overview.component.html",
  styleUrls: ["./person-overview.component.css"],
})
export class PersonOverviewComponent implements OnInit {
  readonly dynamicPath = DynamicPath;

  readonly personOverviewComponentData$: Observable<IPersonOverviewComponentData>;

  private readonly targetPerson$: Observable<Person>;
  private readonly targetPersonPhotoUrl$: Observable<SafeUrl>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>
  ) {
    this.targetPerson$ = this.store.select(selectEditedPerson);
    this.targetPersonPhotoUrl$ = this.store.select(selectPersonPhotoUrl);

    this.personOverviewComponentData$ = combineLatest([
      this.targetPerson$,
      this.targetPersonPhotoUrl$,
    ]).pipe(
      filter(([targetPerson, _]) => targetPerson.personId !== undefined),
      map(([targetPerson, targetPersonPhotoUrl]) => ({
        person: targetPerson,
        personPhotoUrl: targetPersonPhotoUrl,
      }))
    );
  }

  ngOnInit() {
    this.route.paramMap
      .pipe(
        map((params) =>
          params.has("personId") ? +params.get("personId") : undefined
        )
      )
      .subscribe((targetPersonId) =>
        isId(targetPersonId)
          ? this.store.dispatch(
              loadPersonToUpdate({
                targetPersonId,
              })
            )
          : this.router.navigateByUrl(StaticPath.pathNotFound)
      );
  }
}
