import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAdmin } from '../../context/AdminContext';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAdmin();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black-rich flex items-center justify-center">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-b from-black-rich via-black to-black-rich pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md px-4"
      >
        {/* Logo - Clickable with hover effect */}
        <Link to="/" className="flex flex-col items-center mb-10 group cursor-pointer">
          <motion.h1
            className="gold-text text-4xl font-bold tracking-wider mb-2"
            style={{ fontFamily: 'var(--font-heading)' }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            UP16
          </motion.h1>
          <p className="text-silver-muted text-sm tracking-widest uppercase group-hover:text-gold transition-colors duration-200">
            Admin Panel
          </p>
        </Link>

        {/* Login Form */}
        <div className="bg-black/50 border border-gold/10 p-8">
          <h2 className="text-white text-2xl font-bold mb-6 text-center" style={{ fontFamily: 'var(--font-heading)' }}>
            Sign In
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="text-silver-muted text-sm tracking-wider uppercase mb-2 block">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/50 border border-gold/20 text-white px-4 py-3 focus:outline-none focus:border-gold/50 transition-colors placeholder-silver-muted"
                placeholder="admin@up16.com"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-silver-muted text-sm tracking-wider uppercase mb-2 block">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/50 border border-gold/20 text-white px-4 py-3 focus:outline-none focus:border-gold/50 transition-colors placeholder-silver-muted"
                placeholder="Enter your password"
                required
              />
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3"
              >
                {error}
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              className="w-full bg-gold text-black py-3 text-lg tracking-wider uppercase font-semibold hover:bg-gold-light transition-colors disabled:opacity-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </motion.button>
          </form>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <a href="/" className="text-silver-muted hover:text-gold text-sm transition-colors">
              ← Back to Website
            </a>
          </div>
        </div>

        {/* Credentials Info */}
        <div className="mt-6 text-center">
          <p className="text-silver-muted text-xs">
            Demo: admin@up16.com / admin123
          </p>
        </div>
      </motion.div>
    </div>
  );
}