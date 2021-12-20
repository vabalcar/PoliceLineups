import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { provideMockStore } from "@ngrx/store/testing";
import { NotAuthorizedComponent } from "src/app/pages/auth/not-authorized/not-authorized.component";

import { UserAuthGuard } from "./auth-user.guard";

describe("AuthGuard", () => {
  let guard: UserAuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: "not-authorized", component: NotAuthorizedComponent },
        ]),
      ],
      providers: [provideMockStore({ initialState: { auth: {} } })],
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
