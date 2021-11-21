import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { provideMockStore } from "@ngrx/store/testing";

import { UserAuthGuard } from "./auth-user.guard";

describe("AuthGuard", () => {
  let guard: UserAuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [provideMockStore()],
    });

    guard = TestBed.inject(UserAuthGuard);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it("should be created", () => {
    expect(guard).toBeTruthy();
  });
});
