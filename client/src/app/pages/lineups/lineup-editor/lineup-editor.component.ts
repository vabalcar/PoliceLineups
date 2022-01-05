import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { BehaviorSubject, Observable, of } from "rxjs";
import { map } from "rxjs/operators";
import { Person } from "src/app/api/model/person";
import { FilterChipData } from "src/app/components/lineups/filter-chip-list/FilterChipData";
import { AppState } from "src/app/state/app.state";
import {
  addPersonToLineup,
  initializeLineup,
  removePersonFromLineup,
  saveNewLineup,
} from "src/app/state/lineups/lineup-update/lineup-update.actions";
import { selectLineupPeople } from "src/app/state/lineups/lineup-update/lineup-update.selectors";
import { loadPeopleList } from "src/app/state/people/people-list/people-list.actions";
import { selectPeopleList } from "src/app/state/people/people-list/people-list.selectors";
import { PersonWithPhotoUrl } from "src/app/utils/PersonWithPhotoUrl";
import { FullNameValidation } from "src/app/validations/full-name.validation";
import { LineupNameValidation } from "src/app/validations/lineups/lineup-name.validation";
import { AgeValidation } from "src/app/validations/people/age.validation";
import { NationalityValidation } from "src/app/validations/people/nationality.validation";

@Component({
  templateUrl: "./lineup-editor.component.html",
})
export class LineupEditorComponent implements OnInit {
  readonly fullNameValidation: FullNameValidation;
  readonly minAgeValidation: AgeValidation;
  readonly maxAgeValidation: AgeValidation;
  readonly nationalityValidation: NationalityValidation;

  readonly lineupNameValidation: LineupNameValidation;

  readonly filterChipsData: Array<FilterChipData>;

  readonly filteredPeople$: Observable<Array<PersonWithPhotoUrl>>;
  readonly lineupPeople$: Observable<Array<PersonWithPhotoUrl>>;
  readonly lineupPeopleSubject: BehaviorSubject<Array<PersonWithPhotoUrl>>;

  constructor(private store: Store<AppState>) {
    this.filteredPeople$ = store.select(selectPeopleList);
    this.lineupPeople$ = store.select(selectLineupPeople);

    this.lineupPeopleSubject = new BehaviorSubject([]);
    this.lineupPeople$.subscribe(this.lineupPeopleSubject);

    this.fullNameValidation = new FullNameValidation();
    this.minAgeValidation = new AgeValidation();
    this.maxAgeValidation = new AgeValidation();
    this.nationalityValidation = new NationalityValidation();

    this.lineupNameValidation = new LineupNameValidation();

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
  }

  ngOnInit(): void {
    this.store.dispatch(initializeLineup());
  }

  searchForPeople(): void {
    this.store.dispatch(
      loadPeopleList({
        fullName: this.fullNameValidation.value,
        minAge: this.minAgeValidation.value,
        maxAge: this.maxAgeValidation.value,
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

  isInLineup(person: Person): Observable<boolean> {
    return of(
      this.lineupPeopleSubject
        .getValue()
        .findIndex(
          (personInLineup) => personInLineup.personId === person.personId
        ) !== -1
    );
  }
}
