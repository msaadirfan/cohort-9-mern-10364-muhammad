import api, { setAuthToken } from "../api/axios";

test("setAuthToken sets and clears the Authorization header", () => {
  setAuthToken("abc123");
  expect(api.defaults.headers.common.Authorization).toBe("Bearer abc123");

  setAuthToken(null);
  expect(api.defaults.headers.common.Authorization).toBeUndefined();
});