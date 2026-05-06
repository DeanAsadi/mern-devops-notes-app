import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "/api/notes";

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const fetchNotes = async () => {
    try {
      const response = await axios.get(API_URL);
      setNotes(response.data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const addNote = async (event) => {
    event.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("Please enter both title and content");
      return;
    }

    try {
      await axios.post(API_URL, {
        title,
        content,
      });

      setTitle("");
      setContent("");
      fetchNotes();
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  const deleteNote = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchNotes();
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="app">
      <div className="container">
        <h1>MERN DevOps Notes App</h1>
        <p className="subtitle">
          React frontend connected to Node.js backend and MongoDB
        </p>

        <form className="note-form" onSubmit={addNote}>
          <input
            type="text"
            placeholder="Note title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />

          <textarea
            placeholder="Note content"
            value={content}
            onChange={(event) => setContent(event.target.value)}
          />

          <button type="submit">Add Note</button>
        </form>

        <div className="notes-list">
          {notes.length === 0 ? (
            <p className="empty">No notes yet. Add your first note.</p>
          ) : (
            notes.map((note) => (
              <div className="note-card" key={note._id}>
                <h2>{note.title}</h2>
                <p>{note.content}</p>
                <button onClick={() => deleteNote(note._id)}>Delete</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;