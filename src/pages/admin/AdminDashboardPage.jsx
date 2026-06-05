import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdmin } from '../../context/AdminContext';
import { getProperties, getCategories, addProperty, updateProperty, deleteProperty } from '../../data/propertyData';

export default function AdminDashboardPage() {
  const { logout, admin } = useAdmin();
  const [activeTab, setActiveTab] = useState('properties');
  const [properties, setProperties] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [modalType, setModalType] = useState('property'); // 'property' or 'category'
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Initialize data from localStorage
  useEffect(() => {
    setProperties(getProperties());
    setCategories(getCategories());
  }, []);

  // Property form state
  const [propertyForm, setPropertyForm] = useState({
    name: '',
    location: '',
    category: '',
    price: '',
    bedrooms: 0,
    bathrooms: 0,
    sqft: 0,
    description: '',
    features: '',
    coverImage: '',
    images: ''
  });

  // Category form state
  const [categoryForm, setCategoryForm] = useState('');

  const resetPropertyForm = () => ({
    name: '',
    location: '',
    category: '',
    price: '',
    bedrooms: 0,
    bathrooms: 0,
    sqft: 0,
    description: '',
    features: '',
    coverImage: '',
    images: ''
  });

  const openPropertyModal = (property = null) => {
    if (property) {
      setPropertyForm({
        ...property,
        features: property.features.join(', '),
        images: property.images.join(', ')
      });
      setEditingItem(property);
    } else {
      setPropertyForm(resetPropertyForm());
      setEditingItem(null);
    }
    setModalType('property');
    setIsModalOpen(true);
  };

  const openCategoryModal = (category = null) => {
    setCategoryForm(category || '');
    setEditingItem(category);
    setModalType('category');
    setIsModalOpen(true);
  };

  const handlePropertySubmit = (e) => {
    e.preventDefault();

    const imagesArray = propertyForm.images.split(',').map(img => img.trim()).filter(Boolean);
    const featuresArray = propertyForm.features.split(',').map(f => f.trim()).filter(Boolean);

    const propertyData = {
      ...propertyForm,
      bedrooms: propertyForm.bedrooms,
      bathrooms: propertyForm.bathrooms,
      sqft: propertyForm.sqft,
      images: imagesArray.length > 0 ? imagesArray : [propertyForm.coverImage],
      features: featuresArray
    };

    if (editingItem) {
      updateProperty(editingItem.id, propertyData);
    } else {
      addProperty(propertyData);
    }

    // Refresh properties from localStorage
    setProperties(getProperties());

    setIsModalOpen(false);
    setPropertyForm(resetPropertyForm());
    setEditingItem(null);
  };

  const handleCategorySubmit = (e) => {
    e.preventDefault();

    // Categories are managed in getCategories - no edit needed
    setIsModalOpen(false);
    setCategoryForm('');
    setEditingItem(null);
  };

  const handleDeleteProperty = (id) => {
    deleteProperty(id);
    // Refresh properties from localStorage
    setProperties(getProperties());
    setDeleteConfirm(null);
  };

  const handleDeleteCategory = (category) => {
    // Categories are managed in getCategories - no delete needed
    setDeleteConfirm(null);
  };

  return (
    <div className="min-h-screen bg-black-rich pt-20">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-b from-black-rich via-black to-black-rich pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <div className="bg-black/80 backdrop-blur-sm border-b border-gold/10">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Logo - Clickable with hover effect */}
                <Link to="/" className="group cursor-pointer">
                  <motion.h1
                    className="gold-text text-2xl font-bold"
                    style={{ fontFamily: 'var(--font-heading)' }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    UP16
                  </motion.h1>
                </Link>
                <span className="text-silver-muted">|</span>
                <h1 className="text-white text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
                  Admin Dashboard
                </h1>
                <span className="text-silver-muted text-sm">
                  Welcome, {admin?.email}
                </span>
              </div>
              <button
                onClick={logout}
                className="text-silver-muted hover:text-gold transition-colors text-sm"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => setActiveTab('properties')}
              className={`px-6 py-3 text-sm tracking-wider uppercase transition-all ${
                activeTab === 'properties'
                  ? 'bg-gold text-black'
                  : 'bg-transparent border border-gold/30 text-white hover:border-gold'
              }`}
            >
              Properties ({properties.length})
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`px-6 py-3 text-sm tracking-wider uppercase transition-all ${
                activeTab === 'categories'
                  ? 'bg-gold text-black'
                  : 'bg-transparent border border-gold/30 text-white hover:border-gold'
              }`}
            >
              Categories ({categories.length})
            </button>
          </div>

          {/* Properties Tab */}
          <AnimatePresence mode="wait">
            {activeTab === 'properties' && (
              <motion.div
                key="properties"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-white text-xl" style={{ fontFamily: 'var(--font-heading)' }}>
                    Manage Properties
                  </h2>
                  <button
                    onClick={() => openPropertyModal()}
                    className="bg-gold text-black px-6 py-2 text-sm tracking-wider uppercase hover:bg-gold-light transition-colors"
                  >
                    + Add Property
                  </button>
                </div>

                {/* Properties Table */}
                <div className="bg-black/50 border border-gold/10 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-black/50 border-b border-gold/10">
                        <tr>
                          <th className="text-left text-silver-muted text-sm tracking-wider uppercase px-6 py-4">Image</th>
                          <th className="text-left text-silver-muted text-sm tracking-wider uppercase px-6 py-4">Name</th>
                          <th className="text-left text-silver-muted text-sm tracking-wider uppercase px-6 py-4">Location</th>
                          <th className="text-left text-silver-muted text-sm tracking-wider uppercase px-6 py-4">Category</th>
                          <th className="text-left text-silver-muted text-sm tracking-wider uppercase px-6 py-4">Price</th>
                          <th className="text-right text-silver-muted text-sm tracking-wider uppercase px-6 py-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {properties.map((property) => (
                          <tr key={property.id} className="border-b border-gold/10 hover:bg-black/30">
                            <td className="px-6 py-4">
                              <img
                                src={property.coverImage}
                                alt={property.name}
                                className="w-16 h-12 object-cover"
                              />
                            </td>
                            <td className="px-6 py-4 text-white">{property.name}</td>
                            <td className="px-6 py-4 text-silver-muted">{property.location}</td>
                            <td className="px-6 py-4">
                              <span className="bg-gold/20 text-gold px-2 py-1 text-xs tracking-wider uppercase">
                                {property.category}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-gold">{property.price}</td>
                            <td className="px-6 py-4 text-right">
                              <button
                                onClick={() => openPropertyModal(property)}
                                className="text-silver-muted hover:text-gold transition-colors text-sm mr-4"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => setDeleteConfirm({ type: 'property', id: property.id, name: property.name })}
                                className="text-silver-muted hover:text-red-500 transition-colors text-sm"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Categories Tab */}
            {activeTab === 'categories' && (
              <motion.div
                key="categories"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-white text-xl" style={{ fontFamily: 'var(--font-heading)' }}>
                    Manage Categories
                  </h2>
                  <button
                    onClick={() => openCategoryModal()}
                    className="bg-gold text-black px-6 py-2 text-sm tracking-wider uppercase hover:bg-gold-light transition-colors"
                  >
                    + Add Category
                  </button>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {categories.map((category) => (
                    <div
                      key={category}
                      className="bg-black/50 border border-gold/10 p-6 flex items-center justify-between"
                    >
                      <span className="text-white">{category}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openCategoryModal(category)}
                          className="text-silver-muted hover:text-gold transition-colors text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteConfirm({ type: 'category', name: category })}
                          className="text-silver-muted hover:text-red-500 transition-colors text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-black/50 border border-gold/20 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-white text-xl font-bold mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
                {editingItem ? 'Edit' : 'Add'} {modalType === 'property' ? 'Property' : 'Category'}
              </h3>

              {modalType === 'property' ? (
                <form onSubmit={handlePropertySubmit} className="space-y-4">
                  <div>
                    <label className="text-silver-muted text-sm tracking-wider uppercase mb-2 block">Property Name</label>
                    <input
                      type="text"
                      value={propertyForm.name}
                      onChange={(e) => setPropertyForm({ ...propertyForm, name: e.target.value })}
                      className="w-full bg-black/50 border border-gold/20 text-white px-4 py-3 focus:outline-none focus:border-gold/50"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-silver-muted text-sm tracking-wider uppercase mb-2 block">Location</label>
                      <input
                        type="text"
                        value={propertyForm.location}
                        onChange={(e) => setPropertyForm({ ...propertyForm, location: e.target.value })}
                        className="w-full bg-black/50 border border-gold/20 text-white px-4 py-3 focus:outline-none focus:border-gold/50"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-silver-muted text-sm tracking-wider uppercase mb-2 block">Category</label>
                      <select
                        value={propertyForm.category}
                        onChange={(e) => setPropertyForm({ ...propertyForm, category: e.target.value })}
                        className="w-full bg-black/50 border border-gold/20 text-white px-4 py-3 focus:outline-none focus:border-gold/50"
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.filter(c => c !== 'All').map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-silver-muted text-sm tracking-wider uppercase mb-2 block">Price</label>
                      <input
                        type="text"
                        value={propertyForm.price}
                        onChange={(e) => setPropertyForm({ ...propertyForm, price: e.target.value })}
                        className="w-full bg-black/50 border border-gold/20 text-white px-4 py-3 focus:outline-none focus:border-gold/50"
                        placeholder="$12,500,000"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-silver-muted text-sm tracking-wider uppercase mb-2 block">Cover Image URL</label>
                      <input
                        type="url"
                        value={propertyForm.coverImage}
                        onChange={(e) => setPropertyForm({ ...propertyForm, coverImage: e.target.value })}
                        className="w-full bg-black/50 border border-gold/20 text-white px-4 py-3 focus:outline-none focus:border-gold/50"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-silver-muted text-sm tracking-wider uppercase mb-2 block">Bedrooms</label>
                      <input
                        type="number"
                        value={propertyForm.bedrooms}
                        onChange={(e) => setPropertyForm({ ...propertyForm, bedrooms: e.target.value })}
                        className="w-full bg-black/50 border border-gold/20 text-white px-4 py-3 focus:outline-none focus:border-gold/50"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="text-silver-muted text-sm tracking-wider uppercase mb-2 block">Bathrooms</label>
                      <input
                        type="number"
                        value={propertyForm.bathrooms}
                        onChange={(e) => setPropertyForm({ ...propertyForm, bathrooms: e.target.value })}
                        className="w-full bg-black/50 border border-gold/20 text-white px-4 py-3 focus:outline-none focus:border-gold/50"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="text-silver-muted text-sm tracking-wider uppercase mb-2 block">Square Feet</label>
                      <input
                        type="number"
                        value={propertyForm.sqft}
                        onChange={(e) => setPropertyForm({ ...propertyForm, sqft: e.target.value })}
                        className="w-full bg-black/50 border border-gold/20 text-white px-4 py-3 focus:outline-none focus:border-gold/50"
                        min="0"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-silver-muted text-sm tracking-wider uppercase mb-2 block">Description</label>
                    <textarea
                      value={propertyForm.description}
                      onChange={(e) => setPropertyForm({ ...propertyForm, description: e.target.value })}
                      className="w-full bg-black/50 border border-gold/20 text-white px-4 py-3 focus:outline-none focus:border-gold/50 resize-none"
                      rows="3"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-silver-muted text-sm tracking-wider uppercase mb-2 block">Features (comma-separated)</label>
                    <input
                      type="text"
                      value={propertyForm.features}
                      onChange={(e) => setPropertyForm({ ...propertyForm, features: e.target.value })}
                      className="w-full bg-black/50 border border-gold/20 text-white px-4 py-3 focus:outline-none focus:border-gold/50"
                      placeholder="Pool, Gym, Parking"
                    />
                  </div>
                  <div>
                    <label className="text-silver-muted text-sm tracking-wider uppercase mb-2 block">Image URLs (comma-separated)</label>
                    <input
                      type="text"
                      value={propertyForm.images}
                      onChange={(e) => setPropertyForm({ ...propertyForm, images: e.target.value })}
                      className="w-full bg-black/50 border border-gold/20 text-white px-4 py-3 focus:outline-none focus:border-gold/50"
                      placeholder="url1, url2, url3"
                    />
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 bg-transparent border border-gold/30 text-white px-6 py-3 text-sm tracking-wider uppercase hover:border-gold transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-gold text-black px-6 py-3 text-sm tracking-wider uppercase hover:bg-gold-light transition-colors"
                    >
                      {editingItem ? 'Update' : 'Create'} Property
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleCategorySubmit} className="space-y-4">
                  <div>
                    <label className="text-silver-muted text-sm tracking-wider uppercase mb-2 block">Category Name</label>
                    <input
                      type="text"
                      value={categoryForm}
                      onChange={(e) => setCategoryForm(e.target.value)}
                      className="w-full bg-black/50 border border-gold/20 text-white px-4 py-3 focus:outline-none focus:border-gold/50"
                      placeholder="Penthouse"
                      required
                    />
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 bg-transparent border border-gold/30 text-white px-6 py-3 text-sm tracking-wider uppercase hover:border-gold transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-gold text-black px-6 py-3 text-sm tracking-wider uppercase hover:bg-gold-light transition-colors"
                    >
                      {editingItem ? 'Update' : 'Create'} Category
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-black/50 border border-red-500/20 p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-white text-xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                Confirm Delete
              </h3>
              <p className="text-silver-muted mb-6">
                Are you sure you want to delete{' '}
                <span className="text-gold">
                  {deleteConfirm.type === 'property' ? deleteConfirm.name : deleteConfirm.name}
                </span>
                ? This action cannot be undone.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 bg-transparent border border-gold/30 text-white px-6 py-3 text-sm tracking-wider uppercase hover:border-gold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (deleteConfirm.type === 'property') {
                      handleDeleteProperty(deleteConfirm.id);
                    } else {
                      handleDeleteCategory(deleteConfirm.name);
                    }
                  }}
                  className="flex-1 bg-red-600 text-white px-6 py-3 text-sm tracking-wider uppercase hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}