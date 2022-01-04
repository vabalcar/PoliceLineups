import { Component, OnInit } from "@angular/core";
import { SafeUrl } from "@angular/platform-browser";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { FilterChipData } from "src/app/components/lineups/filter-chip-list/FilterChipData";
import { AppState } from "src/app/state/app.state";
import { loadPeopleList } from "src/app/state/people/people-list/people-list.actions";
import { selectPeopleList } from "src/app/state/people/people-list/people-list.selectors";
import { PersonWithPhotoUrl } from "src/app/state/people/utils/PersonWithPhotoUrl";
import { FullNameValidation } from "src/app/validations/full-name.validation";
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

  readonly filterChipsData: Array<FilterChipData>;

  readonly filteredPeople$: Observable<Array<PersonWithPhotoUrl>>;
  readonly filteredPeoplePhotoUrls$: Observable<Array<SafeUrl>>;

  constructor(private store: Store<AppState>) {
    this.filteredPeople$ = store.select(selectPeopleList);
    this.filteredPeoplePhotoUrls$ = this.filteredPeople$.pipe(
      map((people) => people?.map((person) => person.photoUrl))
    );

    this.fullNameValidation = new FullNameValidation();
    this.minAgeValidation = new AgeValidation();
    this.maxAgeValidation = new AgeValidation();
    this.nationalityValidation = new NationalityValidation();

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
    this.store.dispatch(loadPeopleList({ withPhoto: true }));
  }
}
