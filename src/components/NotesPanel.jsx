export default function NotesPanel({ notes }) {
  return (
    <section className="notes-panel">
      <p className="notes-heading">NOTES TO SELF</p>

      <div className="notes-list">
        {notes.map((note, index) => (
          <p key={index} className="note-card">
            {note}
          </p>
        ))}
      </div>
    </section>
  )
}