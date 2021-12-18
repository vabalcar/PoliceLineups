import { TestBed } from "@angular/core/testing";
import { DefaultService } from "src/app/api/api/default.service";

import { initialState, userUpdateReducer } from "./user-update.reducer";

describe("UserUpdate Reducer", () => {
  describe("an unknown action", () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          { provide: DefaultService, useValue: DefaultService.prototype },
        ],
      });
    });

    afterEach(() => {
      TestBed.resetTestingModule();
    });

    it("should return the previous state", () => {
      const action = {} as any;

      const result = userUpdateReducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
