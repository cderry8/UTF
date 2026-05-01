import Link from 'next/link';
import { Trophy, MessageCircle, Twitter, Youtube, Mail, MapPin, Phone } from 'lucide-react';

const footerLinks = {
  league: [
    { label: 'Teams', href: '/teams' },
    { label: 'Fixtures', href: '/fixtures' },
    { label: 'Table', href: '/table' },
    { label: 'Results', href: '/results' },
  ],
  resources: [
    { label: 'Rules', href: '/rules' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Support', href: '/support' },
  ],
  social: [
    { icon: MessageCircle, href: '#', label: 'Discord' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Youtube, href: '#', label: 'YouTube' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Trophy className="w-5 h-5 text-black" />
              </div>
              <span className="text-xl font-orbitron font-bold gradient-text">UTF</span>
            </Link>
            <p className="text-text-muted text-sm mb-6">
              The premier EAFC Pro Clubs competitive league. Compete, track stats, and earn your place among the elite.
            </p>
            <div className="flex gap-3">
              {footerLinks.social.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    className="w-10 h-10 rounded-lg bg-surface-light border border-border flex items-center justify-center text-text-muted hover:text-primary hover:border-primary/50 transition-all"
                    aria-label={item.label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* League Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">League</h3>
            <ul className="space-y-3">
              {footerLinks.league.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-text-muted hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-text-muted hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-text-muted text-sm">
                <Mail className="w-4 h-4 text-primary" />
                contact@utfleague.com
              </li>
              <li className="flex items-center gap-3 text-text-muted text-sm">
                <MessageCircle className="w-4 h-4 text-primary" />
                Join our Discord
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-text-muted text-sm">
            © {new Date().getFullYear()} UTF League. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="/privacy" className="text-text-muted hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-text-muted hover:text-primary transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
