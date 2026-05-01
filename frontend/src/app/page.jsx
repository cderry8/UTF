'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Footer from "./components/static/Footer";
import Hero from "./components/static/Hero";
import Rules from "./components/static/Rules";
import Navbar from './components/static/Navbar';
import { Users, Loader2, Crown, Shield, Wrench, Twitter, Facebook, Instagram, Globe } from 'lucide-react';

const getSocialIcon = (url) => {
  if (url.includes('twitter.com') || url.includes('x.com')) return <Twitter className="w-4 h-4" />;
  if (url.includes('facebook.com')) return <Facebook className="w-4 h-4" />;
  if (url.includes('instagram.com')) return <Instagram className="w-4 h-4" />;
  return <Globe className="w-4 h-4" />;
};

const getRoleIcon = (role) => {
  const roleLower = role?.toLowerCase() || '';
  if (roleLower.includes('admin') || roleLower.includes('owner')) return Crown;
  if (roleLower.includes('mod')) return Shield;
  return Wrench;
};

const getRoleColor = (role) => {
  const roleLower = role?.toLowerCase() || '';
  if (roleLower.includes('admin') || roleLower.includes('owner')) return 'from-amber-500 to-orange-500';
  if (roleLower.includes('mod')) return 'from-emerald-500 to-teal-500';
  return 'from-primary to-secondary';
};

export default function Home() {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const { data } = await axios.get('http://localhost:8000/utf/staff');
        setStaffList(data);
      } catch (error) {
        console.error('Error fetching staff:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, []);

  return (
    <>
      <Navbar />
      <Hero />
      
      <main className="bg-background">
        <Rules />

        {/* Staff Section */}
        <section className="py-20 section-gradient">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-primary font-medium text-sm uppercase tracking-wider">The Team</span>
              <h2 className="text-3xl sm:text-4xl font-orbitron font-bold text-white mt-2 mb-4">
                League Staff
              </h2>
              <p className="text-text-muted max-w-2xl mx-auto">
                Meet the dedicated team that keeps the league running smoothly.
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
              </div>
            ) : staffList.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {staffList.map((staff, index) => {
                  const RoleIcon = getRoleIcon(staff.role);
                  const gradient = getRoleColor(staff.role);
                  return (
                    <div
                      key={staff._id}
                      className="group bg-surface border border-border rounded-2xl p-6 card-hover"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <RoleIcon className="w-7 h-7 text-white" />
                      </div>
                      <h4 className="text-lg font-bold text-white mb-1">{staff.name}</h4>
                      <p className="text-primary font-medium text-sm mb-3">{staff.role}</p>
                      <p className="text-text-muted text-sm mb-4">{staff.work}</p>
                      
                      {staff.socialLinks?.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {staff.socialLinks.map((link, idx) => (
                            <a
                              key={idx}
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 px-3 py-1.5 bg-surface-light border border-border rounded-lg text-text-muted hover:text-primary hover:border-primary/50 transition-all text-xs"
                            >
                              {getSocialIcon(link)}
                              <span>Link</span>
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16">
                <Users className="w-16 h-16 text-text-muted mx-auto mb-4" />
                <p className="text-text-muted">No staff members found.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
}
