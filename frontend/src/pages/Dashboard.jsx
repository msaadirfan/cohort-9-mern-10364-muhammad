import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import NoteEditor from "../components/NoteEditorModal.jsx";
import NoteViewModal from "../components/NoteViewModal.jsx";
import api from "../api/axios.js";
import logger from "../utils/logger.js";
import toast from "react-hot-toast";
import { mergeNote } from "../utils/mergeNote.js";

function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  const [viewedNote, setViewedNote] = useState(null);

  useEffect(() => {
    const getNotes = async () => {
      try {
        const response = await api.get("/notes");

        setNotes(response.data.notes);
      } catch (err) {
        logger.error("Error fetching notes", err);

        toast.error("Error fetching notes");
      } finally {
        setLoading(false);
      }
    };

    getNotes();
  }, []);

  const handleCreateNote = () => {
    setSelectedNote(null);
    setIsEditorOpen(true);
  };

  const handleViewNote = (note) => {
    setViewedNote(note);
  };

  const handleCloseView = () => {
    setViewedNote(null);
  };

  const handleEditNote = (note) => {
    setSelectedNote(note);
    setIsEditorOpen(true);

    setViewedNote(null);
  };

  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setSelectedNote(null);
  };

  const handleSave = async (noteData) => {
    try {
      if (selectedNote) {
        const response = await api.patch(
          `/notes/${selectedNote._id}`,
          noteData,
        );

        const updatedNote = response.data.note;

        setNotes((prevNotes) =>
          prevNotes.map((note) =>
            note._id === selectedNote._id ? mergeNote(note, updatedNote) : note,
          ),
        );

        toast.success("Note updated successfully");
      } else {
        const response = await api.post("/notes", noteData);

        const newNote = response.data.note;

        setNotes((prevNotes) => [...prevNotes, newNote]);

        toast.success("Note created successfully");
      }

      setIsEditorOpen(false);
      setSelectedNote(null);
    } catch (err) {
      logger.error("Error saving note", err);

      toast.error(selectedNote ? "Error editing note" : "Error creating note");
      throw err;
    }
  };

  const deleteNote = async (noteId) => {
    try {
      await api.delete(`/notes/${noteId}`);

      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== noteId));

      toast.success("Note deleted successfully");

      setViewedNote((prev) => (prev?._id === noteId ? null : prev));
    } catch (err) {
      toast.error("Error deleting note");
      logger.error("Error deleting note", err);
    }
  };
  if (loading) {
    return (
      <>
        <Navbar />

        <div className="min-h-[80vh] flex items-center justify-center">
          <span className="loading loading-spinner loading-lg" />
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Notes</h1>

            <p className="text-base-content/60 mt-1">
              Keep track of your thoughts and ideas.
            </p>
          </div>

          <button className="btn btn-primary" onClick={handleCreateNote} type="button">
            + New Note
          </button>
        </div>

        {notes.length === 0 ? (
          <div className="min-h-[50vh] flex flex-col items-center justify-center">
            <p className="text-base-content/50 text-lg">
              You don't have any notes.
            </p>

            <button className="btn btn-primary mt-4" onClick={handleCreateNote} type="button">
              Create your first note
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {notes.map((note) => (
              <div
                key={note._id}
                className="
    card
    h-72
    bg-primary
    text-primary-content
    shadow-md
    hover:shadow-xl
    transition-shadow
  "
              >
                <div className="card-body flex h-full flex-col overflow-hidden">
                  <h2 className="card-title shrink-0 line-clamp-1">
                    {note.title}
                  </h2>
                  <div className="relative flex-1 overflow-hidden">
                    <div
                      className="
                        prose
                        prose-sm
                        max-w-none
                        text-primary-content
                        line-clamp-6

                        [&_h2]:text-xl
                        [&_h2]:font-bold

                        [&_h3]:text-lg
                        [&_h3]:font-bold

                        [&_ul]:list-disc
                        [&_ul]:pl-5

                        [&_ol]:list-decimal
                        [&_ol]:pl-5

                        [&_blockquote]:border-l-4
                        [&_blockquote]:border-primary-content/50
                        [&_blockquote]:pl-4
                        [&_blockquote]:italic
                      "
                      dangerouslySetInnerHTML={{
                        __html: note.description,
                      }}
                    />

                    <div
                      className="
                        pointer-events-none
                        absolute
                        inset-x-0
                        bottom-0
                        h-10
                        bg-gradient-to-t
                        from-primary
                        to-transparent
                      "
                    />
                  </div>
                  <div className="card-actions justify-end mt-4 shrink-0">
                    <button
                      type="button"
                      className="btn btn-sm btn-primary"
                      onClick={() => handleViewNote(note)}
                    >
                      View
                    </button>

                    <button
                      type="button"
                      className="btn btn-sm"
                      onClick={() => handleEditNote(note)}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="
      btn
      btn-sm
      bg-amber-600
      text-white
      hover:bg-amber-700
      border-amber-600
    "
                      onClick={() => deleteNote(note._id)}
                    >
                      Delete
                    </button>
                  </div>{" "}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {viewedNote && (
        <NoteViewModal
          note={viewedNote}
          onClose={handleCloseView}
          onEdit={handleEditNote}
          onDelete={deleteNote}
        />
      )}

      {isEditorOpen && (
        <NoteEditor
          key={selectedNote?._id || "new"}
          note={selectedNote}
          onClose={handleCloseEditor}
          onSave={handleSave}
        />
      )}
    </>
  );
}

export default Dashboard;
