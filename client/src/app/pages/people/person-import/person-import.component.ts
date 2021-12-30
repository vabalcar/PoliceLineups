import { Component } from "@angular/core";
import { Store } from "@ngrx/store";
import { FileHandle } from "src/app/directives/drop-zone.directive";
import { AppState } from "src/app/state/app.state";
import { importPerson } from "src/app/state/people/person-import/person-import.actions";
import { FullNameValidation } from "src/app/validations/full-name.validation";
import { RequiredValidation } from "src/app/validations/required.validation";
import { nationalities } from "../utils/nationality.utils";

@Component({
  templateUrl: "./person-import.component.html",
  styleUrls: ["./person-import.component.css"],
})
export class PersonImportComponent {
  readonly nationalities = nationalities;

  files?: FileHandle[];

  readonly fullNameValidation: FullNameValidation;
  readonly birthDateValidation: RequiredValidation<Date>;
  readonly nationalityValidation: RequiredValidation<string>;

  constructor(private store: Store<AppState>) {
    this.fullNameValidation = new FullNameValidation();
    this.birthDateValidation = new RequiredValidation("Birth date");
    this.nationalityValidation = new RequiredValidation("Nationality");
  }

  filesDropped(files: FileHandle[]): void {
    this.files = files;
  }

  isImportDisabled(): boolean {
    return (
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
        photoFile:
          this.files && this.files.length > 0 ? this.files[0].file : new Blob(),
      })
    );
  }
}
