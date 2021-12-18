import { TestBed } from "@angular/core/testing";
import { Actions } from "@ngrx/effects";
import { provideMockActions } from "@ngrx/effects/testing";
import { Observable } from "rxjs";
import { DefaultService } from "src/app/api/api/default.service";

import { UsersListEffects } from "./users-list.effects";

describe("UsersListEffects", () => {
  let actions$: Observable<any>;
  let effects: UsersListEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UsersListEffects,
        provideMockActions(() => actions$),
        { provide: DefaultService, useValue: DefaultService.prototype },
      ],
    });

    actions$ = TestBed.inject(Actions);
    effects = TestBed.inject(UsersListEffects);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it("should be created", () => {
    expect(effects).toBeTruthy();
  });
});
