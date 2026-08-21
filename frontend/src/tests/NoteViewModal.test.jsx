import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NoteViewModal from "../components/NoteViewModal.jsx";

const note = { _id: "1", title: "Test Note", description: "<p>Hello</p>" };

test("calls onDelete with the note's id when Delete is clicked", async () => {
  const onDelete = jest.fn();
  render(
    <NoteViewModal note={note} onClose={() => {}} onEdit={() => {}} onDelete={onDelete} />,
  );

  await userEvent.click(screen.getByRole("button", { name: /delete/i }));

  expect(onDelete).toHaveBeenCalledWith("1");
});

test("calls onEdit with the full note when Edit is clicked", async () => {
  const onEdit = jest.fn();
  render(
    <NoteViewModal note={note} onClose={() => {}} onEdit={onEdit} onDelete={() => {}} />,
  );

  await userEvent.click(screen.getByRole("button", { name: /edit/i }));

  expect(onEdit).toHaveBeenCalledWith(note);
});