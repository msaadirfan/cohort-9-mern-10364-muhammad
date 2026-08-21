import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NoteEditor from "../components/NoteEditorModal.jsx";

const mockGetText = jest.fn();

jest.mock("@tiptap/react", () => {
  const mockEditor = {
    getText: () => mockGetText(),
    getHTML: () => "<p></p>",
    isActive: () => false,
    can: () => ({ undo: () => false, redo: () => false }),
    chain: () => ({ focus: () => ({ run: jest.fn() }) }),
  };
  return {
    useEditor: () => mockEditor,
    useEditorState: ({ selector }) => selector({ editor: mockEditor }),
    EditorContent: () => null,
  };
});
jest.mock("@tiptap/starter-kit", () => ({}));
jest.mock("@tiptap/extension-underline", () => ({}));

beforeEach(() => {
  mockGetText.mockReturnValue(""); // default: empty content, unless a test overrides it
});

test("shows validation errors and blocks save when title and content are empty", async () => {
  const onSave = jest.fn();
  render(<NoteEditor onSave={onSave} onClose={() => {}} />);

  try {
    await userEvent.click(screen.getByRole("button", { name: /save note/i }));

    expect(screen.getByText(/please enter a title/i)).toBeInTheDocument();
    expect(screen.getByText(/please enter some content/i)).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  } catch (error) {
    throw new Error("Failed to verify empty note validation", { cause: error });
  }
});

test("calls onSave with trimmed title and HTML content when valid", async () => {
  mockGetText.mockReturnValue("some content");

  const onSave = jest.fn().mockResolvedValue();
  render(<NoteEditor onSave={onSave} onClose={() => {}} />);

  try {
    await userEvent.type(screen.getByPlaceholderText(/note title/i), "  My Note  ");

    await userEvent.click(screen.getByRole("button", { name: /save note/i }));

    expect(onSave).toHaveBeenCalledWith({
      title: "My Note",
      description: "<p></p>",
    });
  } catch (error) {
    throw new Error("Failed to verify saving a valid note", { cause: error });
  }
});