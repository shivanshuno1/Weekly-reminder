import React, { useState } from 'react';

const NoteForm = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'personal',
    priority: 'medium',
    reminderDate: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Add one week to the reminder date for the to-do logic
    const reminderDate = new Date(formData.reminderDate);
    const oneWeekLater = new Date(reminderDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    onSave({
      ...formData,
      reminderDate: oneWeekLater.toISOString()
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
        <h3 className="text-xl font-bold mb-4">Create New Note</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Content *</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows="3"
              className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select 
                name="category" 
                value={formData.category} 
                onChange={handleChange}
                className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white"
              >
                <option value="personal">Personal</option>
                <option value="work">Work</option>
                <option value="study">Study</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Priority</label>
              <select 
                name="priority" 
                value={formData.priority} 
                onChange={handleChange}
                className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Reminder Date *</label>
            <input
              type="date"
              name="reminderDate"
              value={formData.reminderDate}
              onChange={handleChange}
              required
              className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white"
            />
          </div>

          <div className="flex gap-2 justify-end">
            <button 
              type="button" 
              onClick={onCancel}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded text-white"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded text-white"
            >
              Create Note
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteForm;