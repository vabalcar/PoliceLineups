import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { BehaviorSubject, Observable } from "rxjs";
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
} from "src/app/state/people/person-update/person-update.actions";
import { selectEditedPerson } from "src/app/state/people/person-update/person-update.selectors";
import { FullNameValidation } from "src/app/validations/full-name.validation";
import { RequiredValidation } from "src/app/validations/required.validation";

import { isId } from "../../utils/validations.utils";
import { nationalities } from "../utils/nationality.utils";

interface IPersonEditComponentData {
  person: Person;
}

@Component({
  templateUrl: "./person-edit.component.html",
})
export class PersonEditComponent implements OnInit {
  readonly nationalities = nationalities;

  readonly fullNameValidation: FullNameValidation;
  readonly birthDateValidation: RequiredValidation<Date>;
  readonly nationalityValidation: RequiredValidation<string>;

  readonly personEditComponentData$: Observable<IPersonEditComponentData>;

  private readonly targetPerson$: Observable<Person>;

  private readonly personEditComponentDataSubject$: BehaviorSubject<
    IPersonEditComponentData | undefined
  >;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>
  ) {
    this.targetPerson$ = this.store.select(selectEditedPerson);

    this.personEditComponentData$ = this.targetPerson$.pipe(
      filter((person) => person.personId !== undefined),
      map((person) => ({ person }))
    );

    this.personEditComponentDataSubject$ = new BehaviorSubject(undefined);
    this.personEditComponentData$.subscribe(
      this.personEditComponentDataSubject$
    );

    this.fullNameValidation = new FullNameValidation(
      this.targetPerson$.pipe(map((targetPerson) => targetPerson.fullName))
    );
    this.birthDateValidation = new RequiredValidation(
      "Birth date",
      this.targetPerson$.pipe(map((targetPerson) => targetPerson.birthDate))
    );
    this.nationalityValidation = new RequiredValidation(
      "Nationality",
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