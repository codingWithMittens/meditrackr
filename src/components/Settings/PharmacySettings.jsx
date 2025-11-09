import React, { useState } from 'react';
import { Plus, Edit3, Trash2, Phone, MapPin, AlertCircle, ArrowLeft, Calendar } from 'lucide-react';

const PharmacySettings = ({ pharmacies, onAdd, onUpdate, onDelete, onSetDefault, onBackToCalendar, prefillData, onPrefillUsed }) => {
  const [showForm, setShowForm] = useState(false);

  // Auto-open form if prefill data is provided (tour)
  React.useEffect(() => {
    if (prefillData) {
      setFormData(prefillData);
      setShowForm(true);
      onPrefillUsed?.();
    }
  }, [prefillData, onPrefillUsed]);
  const [editingPharmacy, setEditingPharmacy] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
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
      errors.name = 'Pharmacy name is required';
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

    if (editingPharmacy) {
      onUpdate(editingPharmacy.id, formData);
    } else {
      onAdd(formData);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({ name: '', address: '', phone: '' });
    setFormErrors({});
    setShowForm(false);
    setEditingPharmacy(null);
  };

  const handleEdit = (pharmacy) => {
    setEditingPharmacy(pharmacy);
    setFormData({
      name: pharmacy.name,
      address: pharmacy.address,
      phone: pharmacy.phone
    });
    setShowForm(true);
  };

  const handleDelete = (pharmacy) => {
    if (window.confirm(`Are you sure you want to delete ${pharmacy.name}?`)) {
      onDelete(pharmacy.id);
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
            <h2 className="text-2xl font-bold">Pharmacy Settings</h2>
            <p className="text-gray-600">Manage your pharmacy information</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-teal-600 text-white px-4 py-2 rounded-xl hover:from-blue-600 hover:to-teal-700 font-semibold shadow-lg shadow-blue-500/30 transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          Add Pharmacy
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6 pharmacy-form">
          <h3 className="text-lg font-semibold mb-4">
            {editingPharmacy ? 'Edit Pharmacy' : 'Add New Pharmacy'}
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Pharmacy Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded-lg ${formErrors.name ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="e.g., CVS Pharmacy"
              />
              {formErrors.name && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {formErrors.name}
                </p>
              )}
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
                placeholder="e.g., 123 Main St, Springfield, IL 62701"
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
                placeholder="e.g., (555) 123-4567"
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
              {editingPharmacy ? 'Update Pharmacy' : 'Add Pharmacy'}
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

      {pharmacies.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No Pharmacies Added</h3>
          <p className="text-gray-500 mb-4">Add your pharmacy information to keep track of where you get your medications.</p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-600 font-medium"
          >
            <Plus className="w-4 h-4" />
            Add Your First Pharmacy
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {pharmacies.map((pharmacy) => (
            <div key={pharmacy.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{pharmacy.name}</h3>

                  <div className="space-y-2">
                    <div className="flex items-start gap-2 text-gray-600">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{pharmacy.address}</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4 flex-shrink-0" />
                      <a
                        href={`tel:${pharmacy.phone}`}
                        className="text-sm hover:text-blue-600 transition-colors"
                      >
                        {pharmacy.phone}
                      </a>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <button
                      onClick={() => onSetDefault(pharmacy.id)}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                        pharmacy.isDefault
                          ? 'bg-green-100 text-green-800 border-green-300'
                          : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'
                      }`}
                    >
                      {pharmacy.isDefault ? '✓ Default' : 'Set as Default'}
                    </button>
                  </div>
                </div>

                <div className="flex gap-1 ml-4">
                  <button
                    onClick={() => handleEdit(pharmacy)}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit pharmacy"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(pharmacy)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete pharmacy"
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

export default PharmacySettings;