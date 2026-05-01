'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Trophy, Calendar, Users, Home, User, LogOut, ChevronDown } from 'lucide-react';
import axios from 'axios';

const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/teams', label: 'Teams', icon: Users },
  { href: '/fixtures', label: 'Fixtures', icon: Calendar },
  { href: '/table', label: 'Table', icon: Trophy },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [manager, setManager] = useState(null);
  const [status, setStatus] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    if (typeof window !== 'undefined' && !token) {
      const fetchIPAndManager = async () => {
        try {
          const ipRes = await axios.get('https://api.ipify.org?format=json');
          const ipAddress = ipRes.data.ip;
          const managerRes = await axios.get(`http://localhost:8000/utf/managers/ip/${ipAddress}`);
          if (managerRes.data) {
            setManager(managerRes.data);
            setStatus(managerRes.data.status);
          }
        } catch (err) {
          // Silent fail - no manager found
        }
      };
      fetchIPAndManager();
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setManager(null);
    window.location.href = '/';
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-background/95 backdrop-blur-lg border-b border-border' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-glow group-hover:shadow-glow-lg transition-shadow">
              <Trophy className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-orbitron font-bold gradient-text">
              UTF
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-text-muted hover:text-foreground hover:bg-surface-light'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center gap-3">
            {!isLoggedIn && !manager ? (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-text-muted hover:text-foreground transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 text-sm font-medium bg-primary text-black rounded-lg hover:bg-primary-dark transition-all hover:shadow-glow"
                >
                  Join League
                </Link>
              </>
            ) : status === 'pending' ? (
              <span className="px-4 py-2 text-sm font-medium text-warning bg-warning/10 rounded-lg">
                Pending Approval
              </span>
            ) : manager?.status === 'accepted' || isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-light transition-colors"
                >
                  <img
                    src={manager?.teamLogo || '/default-team.png'}
                    alt="Team"
                    className="w-8 h-8 rounded-lg object-cover border border-border"
                  />
                  <span className="text-sm font-medium">{manager?.teamName || 'Manager'}</span>
                  <ChevronDown className="w-4 h-4 text-text-muted" />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-xl shadow-card overflow-hidden">
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-surface-light transition-colors"
                    >
                      <User className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-3 text-sm text-error hover:bg-error/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : null}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-surface-light transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-surface border-t border-border">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-text-muted hover:text-foreground hover:bg-surface-light'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-4 border-t border-border mt-4">
              {!isLoggedIn ? (
                <>
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-text-muted hover:text-foreground"
                  >
                    <User className="w-5 h-5" />
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 mt-2 bg-primary text-black rounded-lg justify-center font-medium"
                  >
                    Join League
                  </Link>
                </>
              ) : (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 w-full text-error"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
