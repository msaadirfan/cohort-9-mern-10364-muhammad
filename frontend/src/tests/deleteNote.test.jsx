import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Dashboard from "../pages/Dashboard";
import api from "../api/axios.js";

jest.mock("../api/axios.js", () => ({
  __esModule: true,
  default: { get: jest.fn(), delete: jest.fn() },
}));

jest.mock("../components/Navbar", () => () => <nav data-testid="navbar" />);

test("deletes a note and removes it from the list", async () => {
  api.get.mockResolvedValueOnce({
    data: { notes: [{ _id: "1", title: "Test Note", description: "<p>Hello</p>" }] },
  });
  api.delete.mockResolvedValueOnce({});

  render(<Dashboard />);

  try {
    await screen.findByText("Test Note");

    await userEvent.click(screen.getByRole("button", { name: /delete/i }));

    expect(api.delete).toHaveBeenCalledWith("/notes/1");
    await waitFor(() => {
      expect(screen.queryByText("Test Note")).not.toBeInTheDocument();
    });
  } catch (error) {
    throw new Error("Failed to delete the rendered note", { cause: error });
  }
});