import { TestBed } from "@angular/core/testing";

import { AdminAuthGuard } from "./auth-admin.guard";

describe("AdminAuthGuard", () => {
  let guard: AdminAuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AdminAuthGuard);
  });

  it("should be created", () => {
    expect(guard).toBeTruthy();
  });
});
