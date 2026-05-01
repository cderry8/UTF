'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Navbar from '../components/static/Navbar';
import Footer from '../components/static/Footer';
import { Users, Trophy, Gamepad2, Loader2, Search, ExternalLink } from 'lucide-react';

export default function TeamsPage() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const { data } = await axios.get('http://localhost:8000/utf/managers');
        const acceptedTeams = data.filter(t => t.status === 'accepted');
        setTeams(acceptedTeams);
      } catch (error) {
        console.error('Error fetching teams:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  const filteredTeams = teams.filter(team =>
    team.teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.managerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">League</span>
            <h1 className="text-3xl sm:text-4xl font-orbitron font-bold text-white mt-2 mb-4">
              Competing Teams
            </h1>
            <p className="text-text-muted max-w-2xl mx-auto">
              Meet the managers and teams competing in the UTF League.
            </p>
          </div>

          {/* Search */}
          <div className="max-w-md mx-auto mb-10">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                type="text"
                placeholder="Search teams or managers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-gaming pl-12"
              />
            </div>
          </div>

          {/* Teams Grid */}
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
          ) : filteredTeams.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTeams.map((team, index) => (
                <div
                  key={team._id}
                  className="group bg-surface border border-border rounded-2xl p-6 card-hover animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {/* Team Logo */}
                  <div className="relative mb-4">
                    <div className="w-24 h-24 mx-auto rounded-2xl bg-surface-light border-2 border-border p-2 group-hover:border-primary/50 transition-colors">
                      <img
                        src={team.teamLogo || '/default-team.png'}
                        alt={team.teamName}
                        className="w-full h-full object-contain rounded-xl"
                      />
                    </div>
                  </div>

                  {/* Team Info */}
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-bold text-white mb-1">{team.teamName}</h3>
                    <p className="text-text-muted text-sm">Managed by {team.managerName}</p>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-surface-light rounded-lg p-3 text-center">
                      <Gamepad2 className="w-4 h-4 text-primary mx-auto mb-1" />
                      <span className="text-xs text-text-muted">{team.console}</span>
                    </div>
                    <div className="bg-surface-light rounded-lg p-3 text-center">
                      <Trophy className="w-4 h-4 text-amber-500 mx-auto mb-1" />
                      <span className="text-xs text-text-muted">{team.country}</span>
                    </div>
                  </div>

                  {/* View Button */}
                  <Link
                    href={`/teams/${team._id}`}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-surface-light border border-border rounded-xl text-text-muted hover:text-primary hover:border-primary/50 transition-all text-sm font-medium"
                  >
                    View Team
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Users className="w-16 h-16 text-text-muted mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No teams found</h3>
              <p className="text-text-muted">
                {searchQuery ? 'Try adjusting your search.' : 'Teams will appear here once approved.'}
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
