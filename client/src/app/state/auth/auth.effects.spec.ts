import { TestBed } from "@angular/core/testing";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { RouterTestingModule } from "@angular/router/testing";
import { Actions } from "@ngrx/effects";
import { provideMockActions } from "@ngrx/effects/testing";
import { provideMockStore } from "@ngrx/store/testing";
import { Observable } from "rxjs";
import { DefaultService } from "src/app/api/api/default.service";
import { Configuration } from "src/app/api/configuration";

import { AuthEffects } from "./auth.effects";

describe("AuthEffects", () => {
  let actions$: Observable<any>;
  let effects: AuthEffects;

  beforeEach(() => {
    const defaultServiceMock = Object.assign({}, DefaultService.prototype);
    defaultServiceMock.configuration = new Configuration();

    TestBed.configureTestingModule({
      imports: [RouterTestingModule, MatSnackBarModule],
      providers: [
        AuthEffects,
        provideMockStore({ initialState: { auth: {} } }),
        provideMockActions(() => actions$),
        { provide: DefaultService, useValue: defaultServiceMock },
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
