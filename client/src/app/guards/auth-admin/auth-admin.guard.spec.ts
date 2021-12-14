import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { provideMockStore } from "@ngrx/store/testing";

import { NotAuthorizedComponent } from "src/app/components/pages/auth/not-authorized/not-authorized.component";

import { AdminAuthGuard } from "./auth-admin.guard";

describe("AdminAuthGuard", () => {
  let guard: AdminAuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: "not-authorized", component: NotAuthorizedComponent },
        ]),
      ],
      providers: [provideMockStore({ initialState: { auth: {} } })],
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
