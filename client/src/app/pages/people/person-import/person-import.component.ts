import { Component } from "@angular/core";
import { Store } from "@ngrx/store";
import { BehaviorSubject } from "rxjs";
import { AppState } from "src/app/state/app.state";
import { importPerson } from "src/app/state/people/person-import/person-import.actions";
import { FileHandle } from "src/app/utils/FileHandle";
import { FullNameValidation } from "src/app/validations/full-name.validation";
import { DateValidation } from "src/app/validations/people/date.validation";
import { NationalityValidation } from "src/app/validations/people/nationality.validation";

@Component({
  templateUrl: "./person-import.component.html",
  styleUrls: ["./person-import.component.css"],
})
export class PersonImportComponent {
  readonly photoSubject$: BehaviorSubject<FileHandle | undefined>;

  readonly fullNameValidation: FullNameValidation;
  readonly birthDateValidation: DateValidation;
  readonly nationalityValidation: NationalityValidation;

  constructor(private store: Store<AppState>) {
    this.photoSubject$ = new BehaviorSubject(undefined);

    this.fullNameValidation = new FullNameValidation();
    this.birthDateValidation = new DateValidation();
    this.nationalityValidation = new NationalityValidation();
  }

  isImportDisabled(): boolean {
    return (
      this.photoSubject$.getValue() === undefined ||
      this.fullNameValidation.pristineOrInvalid ||
      this.birthDateValidation.pristineOrInvalid ||
      this.nationalityValidation.pristineOrInvalid
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
