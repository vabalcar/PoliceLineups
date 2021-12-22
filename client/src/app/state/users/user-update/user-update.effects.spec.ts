import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { Actions } from "@ngrx/effects";
import { provideMockActions } from "@ngrx/effects/testing";
import { provideMockStore } from "@ngrx/store/testing";
import { Observable } from "rxjs";
import { DefaultService } from "src/app/api/api/default.service";
import { NotificationsService } from "src/app/services/notifications.service";

import { UserUpdateEffects } from "./user-update.effects";

describe("UserUpdateEffects", () => {
  let actions$: Observable<any>;
  let effects: UserUpdateEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        UserUpdateEffects,
        provideMockStore(),
        provideMockActions(() => actions$),
        { provide: DefaultService, useValue: DefaultService.prototype },
        {
          provide: NotificationsService,
          useValue: NotificationsService.prototype,
        },
      ],
    });

    actions$ = TestBed.inject(Actions);
    effects = TestBed.inject(UserUpdateEffects);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it("should be created", () => {
    expect(effects).toBeTruthy();
  });
});
