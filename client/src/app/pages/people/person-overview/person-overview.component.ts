import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { filter, map } from "rxjs/operators";
import { Person } from "src/app/api/model/person";
import { StaticPath } from "src/app/routing/paths";
import { AppState } from "src/app/state/app.state";
import { loadPersonToUpdate } from "src/app/state/people/person-update/person-update.actions";
import { selectEditedPerson } from "src/app/state/people/person-update/person-update.selectors";

import { isId } from "../../utils/validations.utils";

interface IPersonOverviewComponentData {
  person: Person;
}

@Component({
  templateUrl: "./person-overview.component.html",
  styleUrls: ["./person-overview.component.css"],
})
export class PersonOverviewComponent implements OnInit {
  readonly personOverviewComponentData$: Observable<IPersonOverviewComponentData>;

  private readonly targetPerson$: Observable<Person>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>
  ) {
    this.targetPerson$ = this.store.select(selectEditedPerson);

    this.personOverviewComponentData$ = this.targetPerson$.pipe(
      filter((targetPerson) => targetPerson.personId !== undefined),
      map((targetPerson) => ({
        person: targetPerson,
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
