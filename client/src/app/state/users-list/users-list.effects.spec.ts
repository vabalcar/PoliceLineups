import { TestBed } from "@angular/core/testing";
import { provideMockActions } from "@ngrx/effects/testing";
import { Observable } from "rxjs";

import { UsersListEffects } from "./users-list.effects";

describe("UsersListEffects", () => {
  let actions$: Observable<any>;
  let effects: UsersListEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UsersListEffects, provideMockActions(() => actions$)],
    });

    effects = TestBed.inject(UsersListEffects);
  });

  it("should be created", () => {
    expect(effects).toBeTruthy();
  });
});
