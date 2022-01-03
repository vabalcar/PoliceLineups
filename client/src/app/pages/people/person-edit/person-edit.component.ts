import { Component, OnInit } from "@angular/core";
import { SafeUrl } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { BehaviorSubject, combineLatest, Observable } from "rxjs";
import { filter, map } from "rxjs/operators";
import { Person } from "src/app/api/model/person";
import { StaticPath } from "src/app/routing/paths";
import { AppState } from "src/app/state/app.state";
import {
  deletePerson,
  loadPersonToUpdate,
  updatePersonBirthDate,
  updatePersonFullName,
  updatePersonNationality,
  updatePersonPhoto,
} from "src/app/state/people/person-update/person-update.actions";
import {
  selectEditedPerson,
  selectPersonPhotoUrl,
} from "src/app/state/people/person-update/person-update.selectors";
import { BlobHandle } from "src/app/utils/BlobHandle";
import { FullNameValidation } from "src/app/validations/full-name.validation";
import { DateValidation } from "src/app/validations/people/date.validation";
import { NationalityValidation } from "src/app/validations/people/nationality.validation";

import { isId } from "../../utils/validations.utils";

interface PersonEditComponentData {
  person: Person;
  personPhotoUrl: SafeUrl;
}

@Component({
  templateUrl: "./person-edit.component.html",
  styleUrls: ["./person-edit.component.css"],
})
export class PersonEditComponent implements OnInit {
  readonly newPhotoCandidateSubject$: BehaviorSubject<BlobHandle | undefined>;

  readonly fullNameValidation: FullNameValidation;
  readonly birthDateValidation: DateValidation;
  readonly nationalityValidation: NationalityValidation;

  readonly personEditComponentData$: Observable<PersonEditComponentData>;

  private readonly targetPerson$: Observable<Person>;
  private readonly targetPersonPhotoUrl$: Observable<SafeUrl>;

  private readonly personEditComponentDataSubject$: BehaviorSubject<
    PersonEditComponentData | undefined
  >;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>
  ) {
    this.targetPerson$ = this.store.select(selectEditedPerson);
    this.targetPersonPhotoUrl$ = this.store.select(selectPersonPhotoUrl);

    this.personEditComponentData$ = combineLatest([
      this.targetPerson$,
      this.targetPersonPhotoUrl$,
    ]).pipe(
      filter(([targetPerson, _]) => targetPerson.personId !== undefined),
      map(([targetPerson, targetPersonPhotoUrl]) => ({
        person: targetPerson,
        personPhotoUrl: targetPersonPhotoUrl,
      }))
    );

    this.personEditComponentDataSubject$ = new BehaviorSubject(undefined);
    this.personEditComponentData$.subscribe(
      this.personEditComponentDataSubject$
    );

    this.newPhotoCandidateSubject$ = new BehaviorSubject(undefined);

    this.fullNameValidation = new FullNameValidation(
      this.targetPerson$.pipe(map((targetPerson) => targetPerson.fullName))
    );
    this.birthDateValidation = new DateValidation(
      this.targetPerson$.pipe(map((targetPerson) => targetPerson.birthDate))
    );
    this.nationalityValidation = new NationalityValidation(
      this.targetPerson$.pipe(map((targetPerson) => targetPerson.nationality))
    );
  }

  ngOnInit(): void {
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

  updatePersonPhoto(): void {
    this.store.dispatch(
      updatePersonPhoto({ newPhoto: this.newPhotoCandidateSubject$.getValue() })
    );
  }

  updatePersonFullName(): void {
    this.store.dispatch(
      updatePersonFullName({
        targetPersonId: this.getTargetPersonId(),
        newFullName: this.fullNameValidation.value,
      })
    );
  }

  updatePersonBirthDate(): void {
    this.store.dispatch(
      updatePersonBirthDate({
        targetPersonId: this.getTargetPersonId(),
        newBirthDate: this.birthDateValidation.value,
      })
    );
  }

  updatePersonNationality(): void {
    this.store.dispatch(
      updatePersonNationality({
        targetPersonId: this.getTargetPersonId(),
        newNationality: this.nationalityValidation.value,
      })
    );
  }

  deletePerson(): void {
    this.store.dispatch(
      deletePerson({
        targetPersonId: this.getTargetPersonId(),
      })
    );
  }

  private getTargetPersonId(): number {
    return this.personEditComponentDataSubject$.getValue()?.person?.personId;
  }
}
