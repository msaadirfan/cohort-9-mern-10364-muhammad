import { useState } from "react";
import { useEditor, useEditorState, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";

function ToolbarButton({ active, onClick, disabled, title, children }) {
  return (
    <button
      type="button"
      className={`btn btn-sm ${active ? "btn-primary text-primary-content" : "btn-ghost"}`}
      onClick={onClick}
      disabled={disabled}
      title={title}
    >
      {children}
    </button>
  );
}

function selectEditorState(ctx) {
  if (!ctx.editor) {
    return {
      isBold: false,
      isItalic: false,
      isUnderline: false,
      isHeading2: false,
      isHeading3: false,
      isBulletList: false,
      isOrderedList: false,
      isBlockquote: false,
      canUndo: false,
      canRedo: false,
    };
  }

  return {
    isBold: ctx.editor.isActive("bold"),
    isItalic: ctx.editor.isActive("italic"),
    isUnderline: ctx.editor.isActive("underline"),
    isHeading2: ctx.editor.isActive("heading", { level: 2 }),
    isHeading3: ctx.editor.isActive("heading", { level: 3 }),
    isBulletList: ctx.editor.isActive("bulletList"),
    isOrderedList: ctx.editor.isActive("orderedList"),
    isBlockquote: ctx.editor.isActive("blockquote"),
    canUndo: ctx.editor.can().undo(),
    canRedo: ctx.editor.can().redo(),
  };
}

function getSaveButtonContent(isSaving, isEditMode) {
  if (isSaving) return "Saving...";
  return isEditMode ? "Save Changes" : "Save Note";
}

function NoteEditor({ note = null, onClose, onSave }) {
  const isEditMode = Boolean(note);
  const [title, setTitle] = useState(note?.title || "");
  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: note?.description || "<p></p>",
    editorProps: {
      attributes: { class: "focus:outline-none" },
    },
  });

  const editorState = useEditorState({ editor, selector: selectEditorState });

  const handleTitleChange = (event) => {
    const value = event.target.value;
    setTitle(value);
    if (value.trim()) {
      setTitleError("");
    }
  };

  const handleSave = async () => {
    setTitleError("");
    setDescriptionError("");

    if (!editor) {
      return;
    }

    let hasError = false;

    if (!title.trim()) {
      setTitleError("Please enter a title.");
      hasError = true;
    }

    const descriptionText = editor.getText().trim();

    if (!descriptionText) {
      setDescriptionError("Please enter some content.");
      hasError = true;
    }

    if (hasError) {
      return;
    }

    const noteData = {
      title: title.trim(),
      description: editor.getHTML(),
    };

    try {
      setIsSaving(true);
      await onSave(noteData);
    } catch (error) {
      console.error("Error saving note:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const saveButtonContent = getSaveButtonContent(isSaving, isEditMode);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close editor"
      />
      <div className="relative z-10 flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-2xl">
        <div className="flex items-center justify-between border-b border-base-300 px-6 py-4">
          <div>
            <h2 className="text-2xl font-bold">
              {isEditMode ? "Edit Note" : "Create Note"}
            </h2>
            <p className="mt-1 text-sm text-base-content/60">
              {isEditMode
                ? "Make changes to your note."
                : "Capture your thoughts and ideas."}
            </p>
          </div>
          <button
            type="button"
            className="btn btn-sm btn-circle btn-ghost"
            onClick={onClose}
            aria-label="Close editor"
          >
            ✕
          </button>
        </div>

        <div className="px-6 pt-5">
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="Note title"
            className={`input input-ghost w-full px-0 text-3xl font-bold focus:outline-none ${titleError ? "text-error" : ""}`}
          />
          {titleError && (
            <p className="mt-1 text-sm text-error">{titleError}</p>
          )}
        </div>

        <div className="px-6 py-4">
          <div className="flex flex-wrap items-center gap-1 rounded-lg border border-base-300 bg-base-200/50 p-2">
            <ToolbarButton
              active={editorState.isBold}
              onClick={() => editor?.chain().focus().toggleBold().run()}
              disabled={!editor}
              title="Bold"
            >
              <strong>B</strong>
            </ToolbarButton>

            <ToolbarButton
              active={editorState.isItalic}
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              disabled={!editor}
              title="Italic"
            >
              <em>I</em>
            </ToolbarButton>

            <ToolbarButton
              active={editorState.isUnderline}
              onClick={() => editor?.chain().focus().toggleUnderline().run()}
              disabled={!editor}
              title="Underline"
            >
              <u>U</u>
            </ToolbarButton>

            <div className="divider divider-horizontal mx-0" />

            <ToolbarButton
              active={editorState.isHeading2}
              onClick={() =>
                editor?.chain().focus().toggleHeading({ level: 2 }).run()
              }
              disabled={!editor}
              title="Heading 2"
            >
              H2
            </ToolbarButton>

            <ToolbarButton
              active={editorState.isHeading3}
              onClick={() =>
                editor?.chain().focus().toggleHeading({ level: 3 }).run()
              }
              disabled={!editor}
              title="Heading 3"
            >
              H3
            </ToolbarButton>

            <div className="divider divider-horizontal mx-0" />

            <ToolbarButton
              active={editorState.isBulletList}
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
              disabled={!editor}
              title="Bullet List"
            >
              • List
            </ToolbarButton>

            <ToolbarButton
              active={editorState.isOrderedList}
              onClick={() => editor?.chain().focus().toggleOrderedList().run()}
              disabled={!editor}
              title="Numbered List"
            >
              1. List
            </ToolbarButton>

            <ToolbarButton
              active={editorState.isBlockquote}
              onClick={() => editor?.chain().focus().toggleBlockquote().run()}
              disabled={!editor}
              title="Blockquote"
            >
              Quote
            </ToolbarButton>

            <div className="ml-auto flex gap-1">
              <button
                type="button"
                className="btn btn-sm btn-ghost"
                onClick={() => editor?.chain().focus().undo().run()}
                disabled={!editorState.canUndo}
                title="Undo"
              >
                ↶
              </button>
              <button
                type="button"
                className="btn btn-sm btn-ghost"
                onClick={() => editor?.chain().focus().redo().run()}
                disabled={!editorState.canRedo}
                title="Redo"
              >
                ↷
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-5">
          <div
            className={`min-h-full rounded-xl border bg-base-100 transition-colors ${
              descriptionError
                ? "border-error"
                : "border-base-300 focus-within:border-primary"
            }`}
          >
            <EditorContent
              editor={editor}
              className="
                min-h-[50vh]
                [&_.ProseMirror]:min-h-[50vh]
                [&_.ProseMirror]:px-6
                [&_.ProseMirror]:py-5
                [&_.ProseMirror]:outline-none
                [&_.ProseMirror_p]:mb-3
                [&_.ProseMirror_h2]:mt-6
                [&_.ProseMirror_h2]:mb-3
                [&_.ProseMirror_h2]:text-3xl
                [&_.ProseMirror_h2]:font-bold
                [&_.ProseMirror_h3]:mt-5
                [&_.ProseMirror_h3]:mb-2
                [&_.ProseMirror_h3]:text-2xl
                [&_.ProseMirror_h3]:font-bold
                [&_.ProseMirror_ul]:my-3
                [&_.ProseMirror_ul]:list-disc
                [&_.ProseMirror_ul]:pl-6
                [&_.ProseMirror_ol]:my-3
                [&_.ProseMirror_ol]:list-decimal
                [&_.ProseMirror_ol]:pl-6
                [&_.ProseMirror_li]:my-1
                [&_.ProseMirror_blockquote]:my-4
                [&_.ProseMirror_blockquote]:border-l-4
                [&_.ProseMirror_blockquote]:border-primary
                [&_.ProseMirror_blockquote]:pl-4
                [&_.ProseMirror_blockquote]:italic
                [&_.ProseMirror_blockquote]:opacity-80
              "
            />
          </div>
          {descriptionError && (
            <p className="mt-2 text-sm text-error">{descriptionError}</p>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-base-300 bg-base-100 px-6 py-4">
          <span className="text-sm text-base-content/50">
            {isEditMode ? "Editing note" : "New note"}
          </span>
          <div className="flex gap-3">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary px-6"
              onClick={handleSave}
              disabled={isSaving || !editor}
            >
              {isSaving && (
                <span className="loading loading-spinner loading-sm" />
              )}
              {saveButtonContent}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NoteEditor;
