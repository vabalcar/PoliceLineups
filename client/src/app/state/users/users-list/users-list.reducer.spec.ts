import { initialState, usersListReducer } from "./users-list.reducer";

describe("UsersList Reducer", () => {
  describe("an unknown action", () => {
    it("should return the previous state", () => {
      const action = {} as any;

      const result = usersListReducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
