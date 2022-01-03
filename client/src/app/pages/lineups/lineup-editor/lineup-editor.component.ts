import { Component } from "@angular/core";
import { map } from "rxjs/operators";
import { FilterChipData } from "src/app/components/lineups/filter-chip-list/FilterChipData";
import { FullNameValidation } from "src/app/validations/full-name.validation";
import { AgeValidation } from "src/app/validations/people/age.validation";
import { NationalityValidation } from "src/app/validations/people/nationality.validation";

@Component({
  templateUrl: "./lineup-editor.component.html",
})
export class LineupEditorComponent {
  readonly fullNameValidation: FullNameValidation;
  readonly minAgeValidation: AgeValidation;
  readonly maxAgeValidation: AgeValidation;
  readonly nationalityValidation: NationalityValidation;

  readonly filterChipsData: Array<FilterChipData>;

  constructor() {
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
}
