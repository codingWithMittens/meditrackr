import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Phone, MapPin, AlertCircle, User, ArrowLeft, Calendar } from 'lucide-react';

const ProviderSettings = ({ providers, onAdd, onUpdate, onDelete, onBackToCalendar, prefillData, onPrefillUsed }) => {
  const [showForm, setShowForm] = useState(false);

  // Auto-open form if prefill data is provided (tour)
  useEffect(() => {
    if (prefillData) {
      setFormData(prefillData);
      setShowForm(true);
      onPrefillUsed?.();
    }
  }, [prefillData, onPrefillUsed]);
  const [editingProvider, setEditingProvider] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    address: '',
    phone: ''
  });
  const [formErrors, setFormErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Provider name is required';
    }

    if (!formData.address.trim()) {
      errors.address = 'Address is required';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    }

    return errors;
  };

  const handleSubmit = () => {
    const errors = validateForm();
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    if (editingProvider) {
      onUpdate(editingProvider.id, formData);
    } else {
      onAdd(formData);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({ name: '', specialty: '', address: '', phone: '' });
    setFormErrors({});
    setShowForm(false);
    setEditingProvider(null);
  };

  const handleEdit = (provider) => {
    setEditingProvider(provider);
    setFormData({
      name: provider.name,
      specialty: provider.specialty || '',
      address: provider.address,
      phone: provider.phone
    });
    setShowForm(true);
  };

  const handleDelete = (provider) => {
    if (window.confirm(`Are you sure you want to delete ${provider.name}?`)) {
      onDelete(provider.id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onBackToCalendar || (() => window.history.back())}
            className="flex items-center gap-2 bg-white/70 text-gray-700 px-4 py-2 rounded-xl hover:bg-white hover:shadow-md border border-gray-200/50 transition-all duration-200"
            title="Back to Calendar"
          >
            <ArrowLeft className="w-4 h-4" />
            <Calendar className="w-4 h-4" />
            <span className="text-sm font-medium hidden sm:inline">Calendar</span>
          </button>
          <div>
            <h2 className="text-2xl font-bold">Provider Settings</h2>
            <p className="text-gray-600">Manage your healthcare providers</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-teal-600 text-white px-4 py-2 rounded-xl hover:from-blue-600 hover:to-teal-700 font-semibold shadow-lg shadow-blue-500/30 transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          Add Provider
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6 provider-form">
          <h3 className="text-lg font-semibold mb-4">
            {editingProvider ? 'Edit Provider' : 'Add New Provider'}
          </h3>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Provider Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded-lg ${formErrors.name ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="e.g., Dr. Jane Smith"
                />
                {formErrors.name && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {formErrors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Specialty</label>
                <input
                  type="text"
                  name="specialty"
                  value={formData.specialty}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  placeholder="e.g., Cardiologist, Primary Care"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Address <span className="text-red-500">*</span>
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded-lg ${formErrors.address ? 'border-red-500' : 'border-gray-300'}`}
                rows="3"
                placeholder="e.g., 456 Medical Plaza, Springfield, IL 62701"
              />
              {formErrors.address && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {formErrors.address}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded-lg ${formErrors.phone ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="e.g., (555) 987-6543"
              />
              {formErrors.phone && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {formErrors.phone}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              {editingProvider ? 'Update Provider' : 'Add Provider'}
            </button>
            <button
              onClick={resetForm}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {providers.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No Providers Added</h3>
          <p className="text-gray-500 mb-4">Add your healthcare providers to keep track of your doctors and specialists.</p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-600 font-medium"
          >
            <Plus className="w-4 h-4" />
            Add Your First Provider
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {providers.map((provider) => (
            <div key={provider.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{provider.name}</h3>
                    {provider.specialty && (
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        {provider.specialty}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-start gap-2 text-gray-600">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{provider.address}</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4 flex-shrink-0" />
                      <a
                        href={`tel:${provider.phone}`}
                        className="text-sm hover:text-blue-600 transition-colors"
                      >
                        {provider.phone}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex gap-1 ml-4">
                  <button
                    onClick={() => handleEdit(provider)}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit provider"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(provider)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete provider"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProviderSettings;