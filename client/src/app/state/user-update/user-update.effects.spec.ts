import { TestBed } from "@angular/core/testing";
import { provideMockActions } from "@ngrx/effects/testing";
import { Observable } from "rxjs";

import { UserUpdateEffects } from "./user-update.effects";

describe("UserUpdateEffects", () => {
  let actions$: Observable<any>;
  let effects: UserUpdateEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserUpdateEffects, provideMockActions(() => actions$)],
    });

    effects = TestBed.inject(UserUpdateEffects);
  });

  it("should be created", () => {
    expect(effects).toBeTruthy();
  });
});
