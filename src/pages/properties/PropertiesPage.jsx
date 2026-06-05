import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getProperties, getCategories } from '../../data/propertyData';

export default function PropertiesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const pageRef = useRef(null);
  const categories = getCategories();

  useEffect(() => {
    setIsVisible(true);
    // Load properties from localStorage
    setProperties(getProperties());
    setFilteredProperties(getProperties());
  }, []);

  useEffect(() => {
    let filtered = properties;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.location.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
    }

    setFilteredProperties(filtered);
  }, [searchQuery, selectedCategory, properties]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <div className="min-h-screen bg-black-rich pt-24 pb-20" ref={pageRef}>
      {/* Background gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-black-rich via-black to-black-rich pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="gold-text text-4xl md:text-6xl font-bold tracking-wider mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            OUR PROPERTIES
          </h1>
          <p className="text-silver-muted text-lg md:text-xl max-w-2xl mx-auto" style={{ fontFamily: 'var(--font-body)' }}>
            Discover our curated collection of exceptional properties in the world's most prestigious locations
          </p>
          <div className="w-24 h-0.5 bg-gold mx-auto mt-8" />
        </motion.div>

        {/* Search and Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12"
        >
          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto mb-8">
            <input
              type="text"
              placeholder="Search by name, location, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/50 border border-gold/20 text-white px-6 py-4 pl-12 text-lg placeholder-silver-muted focus:outline-none focus:border-gold/50 transition-colors"
              style={{ fontFamily: 'var(--font-body)' }}
            />
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gold"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <motion.button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 text-sm tracking-wider uppercase transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-gold text-black'
                    : 'bg-transparent border border-gold/30 text-white hover:border-gold'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-silver-muted text-center mb-10"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Showing {filteredProperties.length} {filteredProperties.length === 1 ? 'property' : 'properties'}
        </motion.p>

        {/* Properties Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProperties.map((property) => (
              <motion.div
                key={property.id}
                variants={itemVariants}
                layout
              >
                <Link to={`/property/${property.id}`} className="block group">
                  <motion.article
                    className="bg-black/50 border border-gold/10 overflow-hidden hover:border-gold/40 transition-all duration-500"
                    whileHover={{ y: -5 }}
                  >
                    {/* Cover Image */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <motion.img
                        src={property.coverImage}
                        alt={property.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      {/* Category Badge */}
                      <div className="absolute top-4 left-4">
                        <span className="bg-gold/90 text-black px-3 py-1 text-xs tracking-wider uppercase font-medium">
                          {property.category}
                        </span>
                      </div>
                      {/* Price Tag */}
                      <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm px-4 py-2">
                        <span className="gold-text text-lg font-semibold">
                          {property.price}
                        </span>
                      </div>
                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>

                    {/* Property Info */}
                    <div className="p-6">
                      <h3 className="text-white text-xl font-semibold mb-2 group-hover:text-gold transition-colors" style={{ fontFamily: 'var(--font-heading)' }}>
                        {property.name}
                      </h3>
                      <div className="flex items-center text-silver-muted text-sm">
                        <svg className="w-4 h-4 mr-2 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {property.location}
                      </div>

                      {/* Quick Stats */}
                      <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gold/10">
                        <div className="flex items-center text-silver-muted text-sm">
                          <span className="mr-1 font-semibold text-white">{property.bedrooms}</span> Beds
                        </div>
                        <div className="flex items-center text-silver-muted text-sm">
                          <span className="mr-1 font-semibold text-white">{property.bathrooms}</span> Baths
                        </div>
                        <div className="flex items-center text-silver-muted text-sm">
                          <span className="mr-1 font-semibold text-white">{property.sqft.toLocaleString()}</span> Sq Ft
                        </div>
                      </div>

                      {/* View Details CTA */}
                      <motion.div
                        className="mt-4 flex items-center text-gold text-sm tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity"
                        initial={{ x: -10 }}
                        whileHover={{ x: 0 }}
                      >
                        View Details
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </motion.div>
                    </div>
                  </motion.article>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredProperties.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <svg className="w-16 h-16 text-gold/30 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <h3 className="text-white text-xl mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
              No Properties Found
            </h3>
            <p className="text-silver-muted">
              Try adjusting your search or filters to find what you're looking for
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}