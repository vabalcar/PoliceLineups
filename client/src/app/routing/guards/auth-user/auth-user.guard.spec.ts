import { TestBed } from "@angular/core/testing";

import { UserAuthGuard } from "./auth-user.guard";

describe("AuthGuard", () => {
  let guard: UserAuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(UserAuthGuard);
  });

  it("should be created", () => {
    expect(guard).toBeTruthy();
  });
});