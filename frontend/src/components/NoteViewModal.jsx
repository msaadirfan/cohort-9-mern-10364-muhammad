function NoteViewModal({ note, onClose, onEdit, onDelete }) {
  if (!note) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close note"
      />

      <div
        className="
          relative
          z-10
          flex
          h-[85vh]
          w-full
          max-w-3xl
          flex-col
          overflow-hidden
          rounded-2xl
          border
          border-base-300
          bg-base-100
          shadow-2xl
        "
      >
        <div
          className="
            flex
            items-start
            justify-between
            gap-4
            border-b
            border-base-300
            px-6
            py-4
          "
        >
          <h2 className="text-2xl font-bold break-words">{note.title}</h2>

          <button
            type="button"
            className="btn btn-sm btn-circle btn-ghost shrink-0"
            onClick={onClose}
            aria-label="Close note"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div
            className="
              prose
              prose-sm
              sm:prose-base
              max-w-none

              [&_h2]:text-2xl
              [&_h2]:font-bold

              [&_h3]:text-xl
              [&_h3]:font-bold

              [&_ul]:list-disc
              [&_ul]:pl-6

              [&_ol]:list-decimal
              [&_ol]:pl-6

              [&_blockquote]:border-l-4
              [&_blockquote]:border-primary
              [&_blockquote]:pl-4
              [&_blockquote]:italic
              [&_blockquote]:opacity-80
            "
            dangerouslySetInnerHTML={{
              __html: note.description,
            }}
          />
        </div>

        <div
          className="
            flex
            items-center
            justify-end
            gap-3
            border-t
            border-base-300
            bg-base-100
            px-6
            py-4
          "
        >
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
            onClick={() => onDelete(note._id)}
          >
            Delete
          </button>

          <button
            type="button"
            className="btn btn-sm btn-primary"
            onClick={() => onEdit(note)}
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}

export default NoteViewModal;
