import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { provideMockActions } from "@ngrx/effects/testing";
import { provideMockStore } from "@ngrx/store/testing";

import { MatSnackBarModule } from "@angular/material/snack-bar";
import { Actions } from "@ngrx/effects";
import { Observable } from "rxjs";

import { DefaultService } from "src/app/api/api/default.service";

import { AuthEffects } from "./auth.effects";

describe("AuthEffects", () => {
  let actions$: Observable<any>;
  let effects: AuthEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, MatSnackBarModule],
      providers: [
        AuthEffects,
        provideMockStore(),
        provideMockActions(() => actions$),
        { provide: DefaultService, useValue: DefaultService.prototype },
      ],
    });

    actions$ = TestBed.inject(Actions);
    effects = TestBed.inject(AuthEffects);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it("should be created", () => {
    expect(effects).toBeTruthy();
  });
});
