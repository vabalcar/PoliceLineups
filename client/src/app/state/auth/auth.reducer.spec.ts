import { TestBed } from "@angular/core/testing";
import { DefaultService } from "src/app/api/api/default.service";

import { authReducer, initialState } from "./auth.reducer";

describe("AuthReducer Reducer", () => {
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

      const result = authReducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
