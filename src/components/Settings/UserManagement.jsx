import React, { useState } from 'react';
import { Plus, Edit3, Trash2, User, AlertTriangle, Download, Upload } from 'lucide-react';

const UserManagement = ({ users, currentUser, onAddUser, onUpdateUser, onDeleteUser, onExportUserData, onImportUserData }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [formErrors, setFormErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    return errors;
  };

  const handleSubmit = () => {
    const errors = validateForm();
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    if (editingUser) {
      onUpdateUser(editingUser.id, formData);
    } else {
      onAddUser(formData);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({ name: '', email: '' });
    setFormErrors({});
    setShowForm(false);
    setEditingUser(null);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email || ''
    });
    setShowForm(true);
  };

  const handleDelete = (user) => {
    if (users.length <= 1) {
      alert('Cannot delete the last user.');
      return;
    }

    if (window.confirm(`Are you sure you want to delete ${user.name}? This will permanently delete all their medication data.`)) {
      try {
        onDeleteUser(user.id);
      } catch (error) {
        alert(error.message);
      }
    }
  };

  const handleExportUser = (user) => {
    try {
      const userData = onExportUserData(user.id);
      const dataStr = JSON.stringify(userData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `medmindr-${user.name.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } catch (error) {
      alert('Error exporting user data: ' + error.message);
    }
  };

  return (
    <div className="mb-8 p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <User className="w-5 h-5 text-blue-500" />
          User Management
        </h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200"
        >
          <Plus className="w-4 h-4" />
          Add User
        </button>
      </div>

      <p className="text-gray-600 text-sm mb-4">
        Manage user profiles. Each user has their own medications, pharmacies, providers, and daily logs.
      </p>

      {showForm && (
        <div className="border border-gray-200 rounded-lg p-4 bg-white mb-4">
          <h4 className="font-semibold mb-3">
            {editingUser ? 'Edit User' : 'Add New User'}
          </h4>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded-lg ${formErrors.name ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="e.g., John Smith"
              />
              {formErrors.name && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" />
                  {formErrors.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded-lg ${formErrors.email ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="e.g., john@example.com"
              />
              {formErrors.email && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" />
                  {formErrors.email}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200"
            >
              {editingUser ? 'Update User' : 'Add User'}
            </button>
            <button
              onClick={resetForm}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {users.map((user) => (
          <div key={user.id} className={`border rounded-lg p-4 bg-white transition-colors ${
            user.id === currentUser?.id ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-gray-900">{user.name}</h4>
                  {user.id === currentUser?.id && (
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                      Current User
                    </span>
                  )}
                </div>
                {user.email && <p className="text-sm text-gray-600">{user.email}</p>}
                <p className="text-xs text-gray-500 mt-1">
                  Created: {new Date(user.createdAt).toLocaleDateString()}
                  {user.lastActive && (
                    <span className="ml-3">
                      Last active: {new Date(user.lastActive).toLocaleDateString()}
                    </span>
                  )}
                </p>
              </div>

              <div className="flex gap-1 ml-4">
                <button
                  onClick={() => handleExportUser(user)}
                  className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                  title="Export user data"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleEdit(user)}
                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                  title="Edit user"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                {users.length > 1 && (
                  <button
                    onClick={() => handleDelete(user)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    title="Delete user"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserManagement;