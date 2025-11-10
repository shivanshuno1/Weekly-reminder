import React, { useEffect, useState } from "react";
import { getNotes } from "../components/services/api"; // Named import, not default
import NoteCard from "../components/NoteCard";
import NoteForm from "../components/NoteForm";
import Navbar from "../components/Navbar";

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await getNotes();
      // Adjust based on your actual API response structure
      setNotes(response.data.data || response.data || []);
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNoteCreated = () => {
    setShowForm(false);
    fetchNotes(); // Refresh notes after creating
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">All Notes</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded transition-colors"
          >
            {showForm ? "Close" : "Add Note"}
          </button>
        </div>

        {showForm && <NoteForm onSave={handleNoteCreated} onCancel={() => setShowForm(false)} />}

        {loading ? (
          <div className="text-center py-8">Loading notes...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {notes.length === 0 ? (
              <div className="col-span-full text-center py-8 text-gray-400">
                No notes found. Create your first note!
              </div>
            ) : (
              notes.map((note) => (
                <NoteCard 
                  key={note._id} 
                  note={note} 
                  onUpdate={fetchNotes} 
                  onDelete={fetchNotes} 
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes;