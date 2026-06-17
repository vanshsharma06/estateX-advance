import { motion } from 'framer-motion'

const footerLinks = {
    company: [
      { label: 'About', href: '#about' },
      { label: 'Services', href: '#services' },
      { label: 'Portfolio', href: '#portfolio' },
      { label: 'Careers', href: '#careers' }
    ],
    services: [
      { label: 'Acquisition', href: '#services' },
      { label: 'Development', href: '#services' },
      { label: 'Investment', href: '#services' },
      { label: 'Management', href: '#services' }
    ],
    legal: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Cookie Policy', href: '#' }
    ]
  }

const socialLinks = [
  { label: 'LinkedIn', icon: 'in' },
  { label: 'Instagram', icon: 'ig' },
  { label: 'Twitter', icon: 'tw' }
]

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative bg-black border-t border-gold/10">
      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-16">
        {/* Brand Header - Full width on mobile */}
        <div className="mb-6 md:mb-0 md:contents">
          <div className="mb-6 md:mb-0">
            <div className="text-2xl md:text-3xl text-gold/100 mb-2 md:mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
                <div>UP16</div>
                <div className="text-2xl md:text-3xl tracking-widest">PROPERTIES</div>
              </div>
            <p className="text-silver-muted text-xs md:text-sm leading-relaxed mb-4 md:mb-6">
              Redefining luxury real estate for the world&apos;s most discerning clients. Creating legacies that transcend generations.
            </p>
            <div className="flex gap-3 md:gap-4">
              {socialLinks.map(social => (
                <a
                  key={social.label}
                  href="#"
                  className="w-8 h-8 md:w-10 md:h-10 border border-gold/20 flex items-center justify-center text-gold hover:bg-gold hover:text-black transition-colors"
                  aria-label={social.label}
                >
                  <span className="text-[10px] md:text-xs font-bold">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Link Columns - 3 columns on mobile, 4 on desktop */}
        <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-12">
          {/* Company Links */}
          <div>
            <h4 className="text-white-off text-xs md:text-sm uppercase tracking-wider mb-2 md:mb-4">Company</h4>
            <ul className="space-y-1.5 md:space-y-3">
              {footerLinks.company.map(link => (
                <li key={link.label}>
                  <a href={link.href} className="text-silver-muted text-[10px] md:text-sm hover:text-gold transition-colors block">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="text-white-off text-xs md:text-sm uppercase tracking-wider mb-2 md:mb-4">Services</h4>
            <ul className="space-y-1.5 md:space-y-3">
              {footerLinks.services.map(link => (
                <li key={link.label}>
                  <a href={link.href} className="text-silver-muted text-[10px] md:text-sm hover:text-gold transition-colors block">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-white-off text-xs md:text-sm uppercase tracking-wider mb-2 md:mb-4">Legal</h4>
            <ul className="space-y-1.5 md:space-y-3">
              {footerLinks.legal.map(link => (
                <li key={link.label}>
                  <a href={link.href} className="text-silver-muted text-[10px] md:text-sm hover:text-gold transition-colors block">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gold/10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-silver-muted text-xs">
              © {currentYear} UP16 Properties. All rights reserved.
            </p>
            <p className="text-silver-muted text-xs">
              Crafted with precision for those who demand excellence.
            </p>
          </div>
        </div>
      </div>

      {/* Back to Top */}
      <motion.button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-4 right-4 md:bottom-8 md:right-8 w-10 h-10 md:w-12 md:h-12 bg-gold text-black flex items-center justify-center hover:bg-gold-light transition-colors z-30"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Back to top"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </motion.button>
    </footer>
  )
}