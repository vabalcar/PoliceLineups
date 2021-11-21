import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { provideMockStore } from "@ngrx/store/testing";

import { AdminAuthGuard } from "./auth-admin.guard";

describe("AdminAuthGuard", () => {
  let guard: AdminAuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [provideMockStore()],
    });

    guard = TestBed.inject(AdminAuthGuard);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it("should be created", () => {
    expect(guard).toBeTruthy();
  });
});
