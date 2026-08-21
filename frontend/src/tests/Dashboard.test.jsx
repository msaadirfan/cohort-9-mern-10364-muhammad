import { render, screen } from "@testing-library/react";
import Dashboard from "../pages/Dashboard";
import api from "../api/axios.js";

jest.mock("../api/axios.js", () => ({
  __esModule: true,
  default: { get: jest.fn() },
}));

jest.mock("../components/Navbar", () => () => <nav data-testid="navbar" />);

test("renders notes returned from the API", async () => {
  api.get.mockResolvedValueOnce({
    data: { notes: [{ _id: "1", title: "Test Note", description: "<p>Hello</p>" }] },
  });

  render(<Dashboard />);

  try {
    expect(await screen.findByText("Test Note")).toBeInTheDocument();
  } catch (error) {
    throw new Error("Failed to find the rendered note", { cause: error });
  }
});