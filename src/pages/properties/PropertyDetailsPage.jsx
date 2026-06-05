import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getPropertyById } from '../../data/propertyData';

export default function PropertyDetailsPage() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    window.scrollTo(0, 0);
    // Load property from localStorage
    const loadedProperty = getPropertyById(id);
    if (loadedProperty) {
      // Ensure images array exists and has at least one image
      loadedProperty.images = loadedProperty.images && loadedProperty.images.length > 0
        ? loadedProperty.images
        : [loadedProperty.coverImage || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80'];
    }
    setProperty(loadedProperty);
  }, [id]);

  // Guard clause before accessing property properties
  if (!property || !property.images || property.images.length === 0) {
    return (
      <div className="min-h-screen bg-black-rich pt-24 flex items-center justify-center">
        <div className="text-center">
          <h1 className="gold-text text-4xl mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            Property Not Found
          </h1>
          <Link to="/properties" className="text-gold hover:text-gold-light transition-colors">
            Return to Properties
          </Link>
        </div>
      </div>
    );
  }

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const lightboxVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 }
  };

  return (
    <div className="min-h-screen bg-black-rich">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-b from-black-rich via-black to-black-rich pointer-events-none" />

      <div className="relative z-10">
        {/* Navigation Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="bg-black/80 backdrop-blur-sm py-4 border-b border-gold/10"
        >
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <Link
              to="/properties"
              className="inline-flex items-center text-gold hover:text-gold-light transition-colors text-sm tracking-wider uppercase"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Properties
            </Link>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          {/* Property Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-8"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <span className="inline-block bg-gold text-black px-4 py-1 text-sm tracking-wider uppercase mb-4">
                  {property.category}
                </span>
                <h1 className="text-white text-3xl md:text-5xl font-bold mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
                  {property.name}
                </h1>
                <div className="flex items-center text-silver-muted text-lg">
                  <svg className="w-5 h-5 mr-2 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {property.location}
                </div>
              </div>
              <div className="text-right">
                <p className="gold-text text-3xl md:text-4xl font-bold">
                  {property.price}
                </p>
                <p className="text-silver-muted text-sm mt-2">Starting Price</p>
              </div>
            </div>
          </motion.div>

          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            {/* Main Image */}
            <div
              className="relative aspect-[16/9] md:aspect-[21/9] cursor-pointer overflow-hidden mb-4"
              onClick={() => setIsLightboxOpen(true)}
            >
              <motion.img
                src={property.images[selectedImage]}
                alt={property.name}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.5 }}
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
              <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm px-4 py-2 text-white text-sm">
                Click to expand
              </div>
            </div>

            {/* Thumbnail Navigation */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {property.images.map((image, index) => (
                <motion.button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative flex-shrink-0 w-24 h-16 md:w-32 md:h-20 overflow-hidden border-2 transition-all duration-300 ${
                    selectedImage === index ? 'border-gold' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img
                    src={image}
                    alt={`View ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Property Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-3 md:grid-cols-4 gap-4 mb-10"
          >
            {[
              { label: 'Bedrooms', value: property.bedrooms, icon: '🛏️' },
              { label: 'Bathrooms', value: property.bathrooms, icon: '🛁' },
              { label: 'Square Feet', value: property.sqft.toLocaleString(), icon: '📐' },
            ].map((stat, index) => (
              <div
                key={stat.label}
                className="bg-black/50 border border-gold/10 p-6 text-center"
              >
                <span className="text-2xl mb-2 block">{stat.icon}</span>
                <p className="text-white text-xl font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
                  {stat.value}
                </p>
                <p className="text-silver-muted text-sm">{stat.label}</p>
              </div>
            ))}
          </motion.div>

          {/* Description & Features */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="lg:col-span-2"
            >
              <h2 className="gold-text text-2xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                About This Property
              </h2>
              <p className="text-silver-muted text-lg leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                {property.description}
              </p>

              {/* Features */}
              <div className="mt-8">
                <h3 className="gold-text text-xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                  Features & Amenities
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.features.map((feature, index) => (
                    <motion.div
                      key={feature}
                      initial={{ opacity: 0, x: -20 }}
                      animate={isVisible ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.5, delay: 0.5 + index * 0.05 }}
                      className="flex items-center text-white"
                    >
                      <svg className="w-5 h-5 text-gold mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Contact Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="lg:col-span-1"
            >
              <div className="bg-black/50 border border-gold/20 p-6 sticky top-24">
                <h3 className="text-white text-xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                  Inquire About This Property
                </h3>
                <p className="text-silver-muted mb-6">
                  Our team is ready to provide you with more details about this exceptional property.
                </p>
                <form className="space-y-4">
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full bg-black/50 border border-gold/20 text-white px-4 py-3 focus:outline-none focus:border-gold/50 transition-colors placeholder-silver-muted"
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full bg-black/50 border border-gold/20 text-white px-4 py-3 focus:outline-none focus:border-gold/50 transition-colors placeholder-silver-muted"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    className="w-full bg-black/50 border border-gold/20 text-white px-4 py-3 focus:outline-none focus:border-gold/50 transition-colors placeholder-silver-muted"
                  />
                  <textarea
                    placeholder="Message"
                    rows={4}
                    className="w-full bg-black/50 border border-gold/20 text-white px-4 py-3 focus:outline-none focus:border-gold/50 transition-colors placeholder-silver-muted resize-none"
                  />
                  <motion.button
                    type="button"
                    className="w-full bg-gold text-black py-3 text-lg tracking-wider uppercase font-semibold hover:bg-gold-light transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Send Inquiry
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={() => setIsLightboxOpen(false)}
          >
            <motion.div
              variants={lightboxVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative max-w-6xl max-h-[90vh] w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="absolute -top-12 right-0 text-white hover:text-gold transition-colors"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Main Lightbox Image */}
              <motion.img
                src={property.images[selectedImage]}
                alt={property.name}
                className="w-full h-full object-contain max-h-[80vh]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />

              {/* Navigation Arrows */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage((prev) => (prev === 0 ? property.images.length - 1 : prev - 1));
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-gold text-white hover:text-black p-3 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage((prev) => (prev === property.images.length - 1 ? 0 : prev + 1));
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-gold text-white hover:text-black p-3 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Image Counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2">
                {selectedImage + 1} / {property.images.length}
              </div>

              {/* Thumbnail Strip */}
              <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2 max-w-full overflow-x-auto px-4">
                {property.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage(index);
                    }}
                    className={`flex-shrink-0 w-16 h-12 overflow-hidden border-2 transition-all ${
                      selectedImage === index ? 'border-gold' : 'border-transparent opacity-50 hover:opacity-100'
                    }`}
                  >
                    <img src={image} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}