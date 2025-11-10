import React, { useEffect, useState } from "react";
import { getNotes, createNote, updateNote, deleteNote } from "../components/services/api";
import NoteForm from "../components/NoteForm";
import Navbar from "../components/Navbar";
import './Dashboard.css';

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [draggedNote, setDraggedNote] = useState(null);
  const [error, setError] = useState("");

  // Fetch notes from MongoDB
  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError("");
      console.log("Fetching notes from MongoDB...");
      
      const response = await getNotes();
      console.log("API Response:", response);
      
      if (response.data && response.data.success) {
        const notesData = response.data.data || [];
        console.log("Notes loaded from MongoDB:", notesData.length);
        setNotes(notesData);
      } else {
        throw new Error(response.data?.message || "Failed to fetch notes");
      }
    } catch (error) {
      console.error("Error fetching notes from MongoDB:", error);
      setError("Failed to load notes. Please check your connection.");
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNote = async (noteData) => {
    try {
      setError("");
      console.log("Creating note in MongoDB:", noteData);

      // Map the form data to match your MongoDB schema
      const noteToSave = {
        title: noteData.title,
        content: noteData.content || noteData.description || '',
        category: noteData.category || 'personal',
        priority: noteData.priority || 'medium',
        reminder: noteData.date ? new Date(noteData.date) : null,
        isCompleted: false, // Default to not completed
        // user field will be added by your backend from the token
      };

      const response = await createNote(noteToSave);
      
      if (response.data && response.data.success) {
        console.log("Note created successfully in MongoDB");
        await fetchNotes(); // Refresh the list
        setShowForm(false);
      } else {
        throw new Error(response.data?.message || "Failed to create note");
      }
    } catch (error) {
      console.error("Error creating note in MongoDB:", error);
      setError("Failed to create note. Please try again.");
    }
  };

  const handleDragStart = (e, note) => {
    setDraggedNote(note);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", note._id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    if (draggedNote) {
      try {
        setError("");
        
        // Map section status to your schema's isCompleted field
        const isCompleted = newStatus === 'done';
        const updates = { isCompleted };
        
        // If moving to upcoming, set a reminder date
        if (newStatus === 'upcoming' && !draggedNote.reminder) {
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          updates.reminder = tomorrow;
        }

        console.log(`Updating note in MongoDB:`, updates);

        const response = await updateNote(draggedNote._id, updates);
        
        if (response.data && response.data.success) {
          console.log("Note updated successfully in MongoDB");
          await fetchNotes();
        } else {
          throw new Error(response.data?.message || "Failed to update note");
        }
      } catch (error) {
        console.error("Error updating note in MongoDB:", error);
        setError("Failed to update note. Please try again.");
      }
    }
    setDraggedNote(null);
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm("Are you sure you want to delete this note?")) {
      return;
    }

    try {
      setError("");
      console.log("Deleting note from MongoDB:", noteId);

      const response = await deleteNote(noteId);
      
      if (response.data && response.data.success) {
        console.log("Note deleted successfully from MongoDB");
        await fetchNotes();
      } else {
        throw new Error(response.data?.message || "Failed to delete note");
      }
    } catch (error) {
      console.error("Error deleting note from MongoDB:", error);
      setError("Failed to delete note. Please try again.");
    }
  };

  // Filter notes based on your schema
  const getNoteStatus = (note) => {
    if (note.isCompleted) return 'done';
    if (note.reminder && new Date(note.reminder) > new Date()) return 'upcoming';
    return 'todo';
  };

  const todoNotes = notes.filter(note => getNoteStatus(note) === 'todo');
  const upcomingNotes = notes.filter(note => getNoteStatus(note) === 'upcoming');
  const doneNotes = notes.filter(note => getNoteStatus(note) === 'done');

  // Format date for display - handles MongoDB date format
  const formatDate = (dateString) => {
    if (!dateString) {
      const today = new Date();
      return {
        day: today.getDate(),
        month: today.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
        full: today.toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })
      };
    }
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      const today = new Date();
      return {
        day: today.getDate(),
        month: today.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
        full: today.toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })
      };
    }
    
    return {
      day: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
      full: date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    };
  };

  // Render individual note card for sections
  const RenderNoteCard = ({ note, onDelete }) => {
    // Use reminder date or createdAt date
    const displayDate = note.reminder || note.createdAt;
    const dateInfo = formatDate(displayDate);
    
    return (
      <div 
        className="section-note-card"
        draggable
        onDragStart={(e) => handleDragStart(e, note)}
      >
        {/* Red Date Section */}
        <div className="section-note-date">
          <div className="section-date-main">
            <span className="section-date-day">{dateInfo.day}</span>
            <span className="section-date-month">{dateInfo.month}</span>
          </div>
        </div>
        
        {/* Note Content Section */}
        <div className="section-note-content">
          <div className="section-note-header">
            <h4 className="section-note-title">{note.title}</h4>
            <button 
              onClick={() => onDelete(note._id)}
              className="section-delete-btn"
              title="Delete note"
            >
              ×
            </button>
          </div>
          
          <div className="section-note-details">
            <p className="note-content-text">
              {note.content || 'No content provided'}
            </p>
          </div>
          
          <div className="section-note-footer">
            <span className={`section-note-priority ${note.priority}`}>
              {note.priority.toUpperCase()}
            </span>
            <div className="note-meta-info">
              <span className="section-note-category">
                {note.category}
              </span>
              {note.reminder && (
                <span className="section-note-reminder">
                  ⏰ {new Date(note.reminder).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render section with notes
  const renderSection = (sectionNotes, status, title, icon) => (
    <div 
      className={`section ${status}-section`}
      onDragOver={handleDragOver}
      onDrop={(e) => handleDrop(e, status)}
    >
      <div className="section-header">
        <div className="section-title">
          <span className="section-icon">{icon}</span>
          {title}
          <span className="section-count">{sectionNotes.length}</span>
        </div>
      </div>
      
      <div className="section-content">
        {sectionNotes.length === 0 ? (
          <div className="empty-section">
            <div className="empty-icon">{icon}</div>
            <p>No {title.toLowerCase()} yet</p>
            <small>Drag notes here or create new ones</small>
          </div>
        ) : (
          <div className="notes-grid">
            {sectionNotes.map((note) => (
              <RenderNoteCard 
                key={note._id}
                note={note}
                onDelete={handleDeleteNote}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const handleRefresh = () => {
    fetchNotes();
  };

  if (loading) {
    return (
      <div className="dashboard">
        <Navbar />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your notes from database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Navbar />
      
      <div className="dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <div className="header-content">
            <h1 className="dashboard-title">Weekly Notes Dashboard</h1>
            <p className="dashboard-subtitle">Manage your tasks with drag & drop</p>
          </div>
          <div className="header-actions">
            <button
              onClick={handleRefresh}
              className="refresh-btn"
              title="Refresh data"
            >
              🔄 Refresh
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="create-note-btn"
            >
              <span className="btn-icon">+</span>
              Create New Note
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
            <button onClick={() => setError("")} className="error-close">×</button>
          </div>
        )}

        {/* Database Info */}
        <div className="database-info">
          <p>
            <strong>MongoDB Connected:</strong> {notes.length} notes loaded • 
            All changes are saved to your Notes collection
          </p>
        </div>

        {/* Stats Summary */}
        <div className="stats-summary">
          <div className="stat-item">
            <div className="stat-number">{todoNotes.length}</div>
            <div className="stat-label">To Do</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{upcomingNotes.length}</div>
            <div className="stat-label">Upcoming</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{doneNotes.length}</div>
            <div className="stat-label">Completed</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{notes.length}</div>
            <div className="stat-label">Total</div>
          </div>
        </div>

        {/* Drag & Drop Sections */}
        <div className="sections-container">
          {renderSection(todoNotes, 'todo', 'To-Do Tasks', '📋')}
          {renderSection(upcomingNotes, 'upcoming', 'Upcoming Reminders', '⏰')}
          {renderSection(doneNotes, 'done', 'Completed Tasks', '✅')}
        </div>

        {/* Drag Hint */}
        <div className="drag-hint">
          <div className="hint-icon">↕️</div>
          <p>Drag notes between sections to organize your workflow</p>
          <small>To-Do → Active tasks | Upcoming → Has reminder date | Completed → Marked as done</small>
        </div>
      </div>

      {/* Note Form Modal */}
      {showForm && (
        <NoteForm 
          onSave={handleCreateNote} 
          onCancel={() => setShowForm(false)} 
          categories={['personal', 'work', 'study', 'ideas', 'other']}
          priorities={['low', 'medium', 'high']}
        />
      )}
    </div>
  );
};

export default Dashboard;