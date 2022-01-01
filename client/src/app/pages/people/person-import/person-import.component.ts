import { Component } from "@angular/core";
import { Store } from "@ngrx/store";
import { BehaviorSubject } from "rxjs";
import { AppState } from "src/app/state/app.state";
import { importPerson } from "src/app/state/people/person-import/person-import.actions";
import { FileHandle } from "src/app/utils/FileHandle";
import { FullNameValidation } from "src/app/validations/full-name.validation";
import { RequiredValidation } from "src/app/validations/required.validation";

import { nationalities } from "../utils/nationality.utils";

@Component({
  templateUrl: "./person-import.component.html",
  styleUrls: ["./person-import.component.css"],
})
export class PersonImportComponent {
  readonly nationalities = nationalities;

  readonly photoSubject$: BehaviorSubject<FileHandle | undefined>;

  readonly fullNameValidation: FullNameValidation;
  readonly birthDateValidation: RequiredValidation<Date>;
  readonly nationalityValidation: RequiredValidation<string>;

  constructor(private store: Store<AppState>) {
    this.photoSubject$ = new BehaviorSubject(undefined);

    this.fullNameValidation = new FullNameValidation();
    this.birthDateValidation = new RequiredValidation("Birth date");
    this.nationalityValidation = new RequiredValidation("Nationality");
  }

  isImportDisabled(): boolean {
    return (
      this.photoSubject$.getValue() === undefined ||
      this.fullNameValidation.invalid ||
      this.birthDateValidation.invalid ||
      this.nationalityValidation.invalid
    );
  }

  importPerson(): void {
    this.store.dispatch(
      importPerson({
        fullName: this.fullNameValidation.value,
        birthDate: this.birthDateValidation.value.toISOString(),
        nationality: this.nationalityValidation.value,
        photoFile: this.photoSubject$.getValue()?.file,
      })
    );
  }
}
