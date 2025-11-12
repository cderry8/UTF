'use client';
import { useState, useEffect } from 'react';
import '@fontsource/monomaniac-one';
import '@fontsource/lobster';
import '@fontsource/inter';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import axios from 'axios';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [manager, setManager] = useState(null);
  const [status, setStatus] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Added state to track login status
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // For Profile Dropdown

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen); // Toggle dropdown for profile

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Get the IP address using ipify and check the status
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const fetchIPAndManager = async () => {
        try {
          // Get the IP address from ipify
          const ipRes = await axios.get('https://api.ipify.org?format=json');
          const ipAddress = ipRes.data.ip;
          console.log(ipAddress)

          // Check if this IP address is already a manager
          const managerRes = await axios.get(`http://localhost:8000/utf/managers/ip/${ipAddress}`);
          const foundManager = managerRes.data;

          if (foundManager) {
            setManager(foundManager);
            setStatus(foundManager.status);
          } else {
            setManager(null);
            setStatus(null);
          }
        } catch (err) {
          console.error('Error fetching IP or manager data:', err.message);
        }
      };

      fetchIPAndManager();
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token'); // Assume you're using localStorage for JWT
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const renderProfile = () => {
    if (!isLoggedIn) {
      return (
        <div className="flex space-x-4">
          <Link href="/signup">
            <button className="px-3 py-2 bg-[rgb(0,191,255)] text-white text-sm rounded-md shadow">
              Request to be a Manager
            </button>
          </Link>
          <Link href="/login">
            <button className="px-3 py-2 bg-gray-700 text-white text-sm rounded-md shadow">
              Login
            </button>
          </Link>
        </div>
      );
    }

    if (status === 'pending') {
      return (
        <div className="text-sm text-yellow-300 italic font-medium">
          Pending Approval...
        </div>
      );
    }

    if (status === 'accepted') {
      return (
        <div className="relative">
          <div
            className="border-[3px] h-[3.5rem] w-[3.5rem] rounded-md shadow-md border-[rgb(0,191,255)] overflow-hidden cursor-pointer"
            onClick={toggleDropdown}
          >
            <img
              src={manager.teamLogo || 'https://via.placeholder.com/150'}
              alt="Team Logo"
              className="object-fill h-full w-full"
            />
          </div>
          {isDropdownOpen && (
            <div className="absolute top-14 right-0 bg-white shadow-lg rounded-md py-2 px-4">
              <Link href="/profile" className="block py-2 text-blue-600">Profile</Link>
              <button
                onClick={handleLogout}
                className="block py-2 text-red-600"
              >
                Log Out
              </button>
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  const handleLogout = () => {
    // Clear the token and other auth-related data
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    window.location.href = '/'; // Redirect to homepage
  };

  return (
    <nav className="fixed w-full z-50">
      <div
        className={`absolute inset-0 ${isScrolled ? 'bg-black backdrop-blur-xl' : 'bg-black opacity-70 backdrop-blur-xl'} z-40 transition-all duration-300`}
      />

      <div className="relative z-50 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* DESKTOP NAV */}
        <div className="hidden md:flex justify-between items-center relative">
          <div className="text-white border-[rgb(0,191,255)] border-[2px] bg-black/30 backdrop-blur-md shadow-md rounded-md p-2 z-10">
            <Link href="/">
              <span className="text-[rgb(0,191,255)] font-fantasy font-light tracking-widest text-2xl">
                UTF
              </span>
            </Link>
          </div>

          <div className="flex space-x-8 absolute left-1/2 transform -translate-x-1/2">
            <Link href="/" className="text-white font-inter font-medium">
              <span className="font-monoOne text-[rgb(0,191,255)]">01.</span> Home
            </Link>
            <Link href="/fixtures" className="text-white font-inter font-medium">
              <span className="font-monoOne text-[rgb(0,191,255)]">02.</span> Fixtures
            </Link>
            <Link href="/table" className="text-white font-inter font-medium">
              <span className="font-monoOne text-[rgb(0,191,255)]">03.</span> Table
            </Link>
           
          </div>

          <div className="w-full flex items-center justify-end">
            {renderProfile()}
          </div>
        </div>

        {/* MOBILE NAV */}
        <div className="flex md:hidden items-center justify-between relative">
          <div className="w-[3.5rem] flex items-center">
            {renderProfile()}
          </div>

          <div className="absolute left-1/2 transform -translate-x-1/2 text-white border-[rgb(0,191,255)] border-[2px] bg-black/30 backdrop-blur-md shadow-md rounded-md p-2 z-10">
            <Link href="/">
              <span className="text-[rgb(0,191,255)] font-fantasy font-light tracking-widest text-2xl">
                UTF
              </span>
            </Link>
          </div>

          <button onClick={toggleMenu}>
            {isOpen ? <X className="text-blue-600" /> : <Menu className="text-blue-600" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Links */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 pt-2 space-y-2 bg-white shadow">
          <Link href="/" className="block text-blue-600 hover:text-blue-800">Home</Link>
          <Link href="/teams" className="block text-blue-600 hover:text-blue-800">Teams</Link>
          <Link href="/fixtures" className="block text-blue-600 hover:text-blue-800">Fixtures</Link>
          <Link href="/standings" className="block text-blue-600 hover:text-blue-800">Standings</Link>
          <Link href="/players" className="block text-blue-600 hover:text-blue-800">Players</Link>
        </div>
      )}
    </nav>
  );
}
