import { Component, OnInit, ViewChild } from "@angular/core";
import { MatStepper } from "@angular/material/stepper";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { BehaviorSubject, Observable, of } from "rxjs";
import { map } from "rxjs/operators";
import { LineupOverview } from "src/app/api/model/lineupOverview";
import { Person } from "src/app/api/model/person";
import { FilterChipData } from "src/app/components/lineups/filter-chip-list/FilterChipData";
import { StaticPath } from "src/app/routing/paths";
import { AppState } from "src/app/state/app.state";
import { selectLineupRecommendations } from "src/app/state/lineups/lineup-recommendations/lineup-recommendations.selectors";
import {
  addPersonToLineup,
  deleteLineup,
  initializeLineup,
  loadLineup,
  removePersonFromLineup,
  saveExistingLineup,
  saveNewLineup,
} from "src/app/state/lineups/lineup-update/lineup-update.actions";
import {
  selectLineup,
  selectLineupPeople,
  selectWerePeopleEditedAfterLoad,
} from "src/app/state/lineups/lineup-update/lineup-update.selectors";
import {
  initPeopleList,
  loadPeopleList,
} from "src/app/state/people/people-list/people-list.actions";
import { selectPeopleList } from "src/app/state/people/people-list/people-list.selectors";
import { PersonWithPhotoUrl } from "src/app/utils/PersonWithPhotoUrl";
import { FullNameValidation } from "src/app/validations/full-name.validation";
import { LineupNameValidation } from "src/app/validations/lineups/lineup-name.validation";
import { AgeValidation } from "src/app/validations/people/age.validation";
import { NationalityValidation } from "src/app/validations/people/nationality.validation";

import { isId } from "../../utils/validations.utils";

@Component({
  templateUrl: "./lineup-editor.component.html",
  styleUrls: ["./lineup-editor.component.css"],
})
export class LineupEditorComponent implements OnInit {
  @ViewChild("stepper") stepper: MatStepper;

  readonly fullNameValidation: FullNameValidation;
  readonly minAgeValidation: AgeValidation;
  readonly maxAgeValidation: AgeValidation;
  readonly nationalityValidation: NationalityValidation;

  readonly lineupNameValidation: LineupNameValidation;

  readonly filterChipsData: Array<FilterChipData>;

  readonly filteredPeople$: Observable<Array<PersonWithPhotoUrl>>;

  readonly recommendedPeople$: Observable<Array<PersonWithPhotoUrl>>;

  readonly lineup$: Observable<LineupOverview>;
  readonly lineupIdSubject$: BehaviorSubject<number | undefined>;
  readonly lineupPeople$: Observable<Array<PersonWithPhotoUrl>>;
  readonly lineupPeopleSubject$: BehaviorSubject<Array<PersonWithPhotoUrl>>;
  readonly lineupPeopleEdited$: Observable<boolean>;
  readonly lineupPeopleEditedSubject$: BehaviorSubject<boolean>;

  readonly selectedStepSubject$: BehaviorSubject<number>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<AppState>
  ) {
    this.filteredPeople$ = store.select(selectPeopleList);

    this.recommendedPeople$ = store.select(selectLineupRecommendations);

    this.lineup$ = store.select(selectLineup);
    this.lineupIdSubject$ = new BehaviorSubject(undefined);
    this.lineup$
      .pipe(map((lineup) => lineup?.lineupId))
      .subscribe(this.lineupIdSubject$);

    this.lineupPeople$ = store.select(selectLineupPeople);
    this.lineupPeopleSubject$ = new BehaviorSubject([]);
    this.lineupPeople$.subscribe(this.lineupPeopleSubject$);

    this.lineupPeopleEdited$ = store.select(selectWerePeopleEditedAfterLoad);
    this.lineupPeopleEditedSubject$ = new BehaviorSubject(false);
    this.lineupPeopleEdited$.subscribe(this.lineupPeopleEditedSubject$);

    this.fullNameValidation = new FullNameValidation();
    this.minAgeValidation = new AgeValidation();
    this.maxAgeValidation = new AgeValidation();
    this.nationalityValidation = new NationalityValidation();

    this.lineupNameValidation = new LineupNameValidation(
      this.lineup$.pipe(map((lineup) => lineup?.name))
    );

    this.filterChipsData = [
      {
        validation: this.fullNameValidation,
        message$: this.fullNameValidation.value$.pipe(
          map((value) => (value ? `Full name contains "${value}"` : undefined))
        ),
      },
      {
        validation: this.minAgeValidation,
        message$: this.minAgeValidation.value$.pipe(
          map((value) => (value ? `At least ${value} years old` : undefined))
        ),
      },
      {
        validation: this.maxAgeValidation,
        message$: this.maxAgeValidation.value$.pipe(
          map((value) => (value ? `At most ${value} years old` : undefined))
        ),
      },
      {
        validation: this.nationalityValidation,
        message$: this.nationalityValidation.value$.pipe(
          map((value) => (value ? `${value} nationality` : undefined))
        ),
      },
    ];

    this.selectedStepSubject$ = new BehaviorSubject(0);
  }

  ngOnInit(): void {
    this.store.dispatch(initPeopleList());

    if (this.router.url === StaticPath.newLineup) {
      this.lineupNameValidation.clearValue();
      this.store.dispatch(initializeLineup());
      return;
    }

    this.selectedStepSubject$.next(1);

    this.route.paramMap
      .pipe(
        map((params) =>
          params.has("lineupId") ? +params.get("lineupId") : undefined
        )
      )
      .subscribe((targetLineupId) =>
        isId(targetLineupId)
          ? this.store.dispatch(
              loadLineup({
                lineupId: targetLineupId,
              })
            )
          : this.router.navigateByUrl(StaticPath.pathNotFound)
      );
  }

  isInLineup(person: Person): Observable<boolean> {
    return of(
      this.lineupPeopleSubject$
        .getValue()
        .findIndex(
          (personInLineup) => personInLineup.personId === person.personId
        ) !== -1
    );
  }

  searchForPeople(): void {
    this.store.dispatch(
      loadPeopleList({
        fullName: this.fullNameValidation.value || undefined,
        minAge: this.minAgeValidation.value || undefined,
        maxAge: this.maxAgeValidation.value || undefined,
        nationality: this.nationalityValidation.value || undefined,
        withPhoto: true,
      })
    );
  }

  addPersonToLineup(person: Person): void {
    this.store.dispatch(addPersonToLineup({ person }));
  }

  removePersonFromLineup(person: Person): void {
    this.store.dispatch(removePersonFromLineup({ personId: person.personId }));
  }

  saveNewLineup(): void {
    this.store.dispatch(
      saveNewLineup({ name: this.lineupNameValidation.value })
    );
  }

  saveExistingLineup(): void {
    this.store.dispatch(
      saveExistingLineup({
        lineupId: this.lineupIdSubject$.getValue(),
        name: this.lineupNameValidation.value,
      })
    );
  }

  deleteLineup(): void {
    this.store.dispatch(
      deleteLineup({ lineupId: this.lineupIdSubject$.getValue() })
    );
  }

  isProblemWithLineupName(): boolean {
    return this.lineupIdSubject$.getValue()
      ? this.isSaveButtonDisabledForLineupEditation()
      : this.isSaveButtonDisabledForLineupCreation();
  }

  private isSaveButtonDisabledForLineupCreation(): boolean {
    return this.lineupNameValidation.pristineOrInvalid;
  }

  private isSaveButtonDisabledForLineupEditation(): boolean {
    return (
      this.lineupNameValidation.errorPublisher.isErrorState() ||
      (this.lineupNameValidation.pristine &&
        !this.lineupPeopleEditedSubject$.getValue())
    );
  }
}
