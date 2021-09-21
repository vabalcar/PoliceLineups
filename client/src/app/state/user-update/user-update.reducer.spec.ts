import { updateUserReducer, initialState } from "./user-update.reducer";

describe("UserUpdate Reducer", () => {
  describe("an unknown action", () => {
    it("should return the previous state", () => {
      const action = {} as any;

      const result = updateUserReducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
