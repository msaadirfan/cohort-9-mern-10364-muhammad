import { render, screen } from "@testing-library/react";
import Dashboard from "../pages/Dashboard";
import api from "../api/axios.js";
import toast from "react-hot-toast";

jest.mock("../api/axios.js", () => ({
  __esModule: true,
  default: { get: jest.fn() },
}));

jest.mock("../components/Navbar", () => () => <nav data-testid="navbar" />);

jest.mock("react-hot-toast", () => ({
  __esModule: true,
  default: { error: jest.fn(), success: jest.fn() },
}));

test("shows an error toast and empty state when fetching notes fails", async () => {
  api.get.mockRejectedValueOnce(new Error("Network error"));

  render(<Dashboard />);

  expect(await screen.findByText(/don't have any notes/i)).toBeInTheDocument();
  expect(toast.error).toHaveBeenCalledWith("Error fetching notes");
});