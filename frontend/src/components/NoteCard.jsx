import React from "react";
import '../pages/Dashboard.css';

const NoteCard = ({ note, onStatusChange, onDelete }) => {
  const handleStatusChange = (newStatus) => {
    onStatusChange(note._id, newStatus);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      onDelete(note._id);
    }
  };

  const getStatusConfig = (status) => {
    switch(status) {
      case 'upcoming': return { color: 'status-upcoming', label: 'Upcoming', icon: '⏰' };
      case 'todo': return { color: 'status-todo', label: 'To-Do', icon: '📋' };
      case 'done': return { color: 'status-done', label: 'Completed', icon: '✅' };
      default: return { color: 'status-default', label: 'Note', icon: '📝' };
    }
  };

  const getPriorityConfig = (priority) => {
    switch(priority) {
      case 'high': return { color: 'priority-high', label: 'High Priority' };
      case 'medium': return { color: 'priority-medium', label: 'Medium Priority' };
      case 'low': return { color: 'priority-low', label: 'Low Priority' };
      default: return { color: 'priority-default', label: 'Normal Priority' };
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const statusConfig = getStatusConfig(note.status);
  const priorityConfig = getPriorityConfig(note.priority);

  return (
    <div className={`note-card ${priorityConfig.color}`}>
      {/* Header */}
      <div className="note-header">
        <div className="note-title-section">
          <h3 className="note-title">{note.title}</h3>
          <div className="note-meta">
            <span className={`status-badge ${statusConfig.color}`}>
              <span className="status-icon">{statusConfig.icon}</span>
              {statusConfig.label}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="note-content">
        <p>{note.content}</p>
      </div>

      {/* Metadata */}
      <div className="note-metadata">
        <div className="metadata-item">
          <span className="metadata-icon">📅</span>
          <span className="metadata-text">{formatDate(note.reminderDate)}</span>
        </div>
        <div className="metadata-item">
          <span className="metadata-icon">📁</span>
          <span className="metadata-text capitalize">{note.category}</span>
        </div>
        <div className="metadata-item">
          <span className="metadata-icon">⚡</span>
          <span className="metadata-text">{priorityConfig.label}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="note-actions">
        <div className="status-actions">
          {note.status !== 'upcoming' && (
            <button 
              onClick={() => handleStatusChange('upcoming')}
              className="btn-status btn-upcoming"
            >
              ⏰ Upcoming
            </button>
          )}
          
          {note.status !== 'todo' && (
            <button 
              onClick={() => handleStatusChange('todo')}
              className="btn-status btn-todo"
            >
              📋 To-Do
            </button>
          )}
          
          {note.status !== 'done' && (
            <button 
              onClick={() => handleStatusChange('done')}
              className="btn-status btn-done"
            >
              ✅ Done
            </button>
          )}
        </div>
        
        <button 
          onClick={handleDelete}
          className="btn-delete"
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
};

export default NoteCard;