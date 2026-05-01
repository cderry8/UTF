'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Navbar from '../components/static/Navbar';
import Footer from '../components/static/Footer';
import { Trophy, Target, Users, Loader2, Crown, Medal, Award } from 'lucide-react';

export default function PlayersPage() {
  const [players, setPlayers] = useState([]);
  const [category, setCategory] = useState('goals');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlayers();
  }, [category]);

  const fetchPlayers = async () => {
    try {
      const { data } = await axios.get(`http://localhost:8000/utf/players/league/leaders/${category}?limit=20`);
      setPlayers(data);
    } catch (error) {
      console.error('Error fetching players:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { key: 'goals', label: 'Top Scorers', icon: Target, color: 'text-rose-500' },
    { key: 'assists', label: 'Top Assists', icon: Trophy, color: 'text-emerald-500' },
    { key: 'motmAwards', label: 'MOTM Awards', icon: Crown, color: 'text-amber-500' },
    { key: 'matchesPlayed', label: 'Most Games', icon: Users, color: 'text-primary' },
  ];

  const getRankIcon = (index) => {
    switch (index) {
      case 0: return <Crown className="w-5 h-5 text-amber-500" />;
      case 1: return <Medal className="w-5 h-5 text-slate-300" />;
      case 2: return <Medal className="w-5 h-5 text-orange-600" />;
      default: return <span className="w-5 h-5 flex items-center justify-center text-text-muted font-medium">{index + 1}</span>;
    }
  };

  const getStatValue = (player) => {
    switch (category) {
      case 'goals': return player.stats.goals;
      case 'assists': return player.stats.assists;
      case 'motmAwards': return player.stats.motmAwards;
      case 'matchesPlayed': return player.stats.matchesPlayed;
      default: return 0;
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-24 pb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-10">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">Statistics</span>
            <h1 className="text-3xl sm:text-4xl font-orbitron font-bold text-white mt-2 mb-4">
              League Leaders
            </h1>
            <p className="text-text-muted max-w-2xl mx-auto">
              Top performers in the UTF League across all categories.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.key}
                  onClick={() => setCategory(cat.key)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ${
                    category === cat.key
                      ? 'bg-primary text-black'
                      : 'bg-surface border border-border text-text-muted hover:text-white hover:border-primary/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Players List */}
          <div className="bg-surface border border-border rounded-2xl overflow-hidden">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
              </div>
            ) : players.length > 0 ? (
              <div className="divide-y divide-border">
                {players.map((player, index) => (
                  <div
                    key={player._id}
                    className={`flex items-center gap-4 p-4 hover:bg-surface-light/50 transition-colors ${
                      index < 3 ? 'bg-gradient-to-r from-primary/5 to-transparent' : ''
                    }`}
                  >
                    {/* Rank */}
                    <div className="w-10 flex justify-center">
                      {getRankIcon(index)}
                    </div>

                    {/* Player Info */}
                    <div className="flex-1 flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white ${
                        index < 3 
                          ? 'bg-gradient-to-br from-primary to-secondary' 
                          : 'bg-surface-light border border-border'
                      }`}>
                        {player.playerName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{player.playerName}</p>
                        <p className="text-sm text-text-muted">
                          {player.proClubName} • {player.position}
                        </p>
                        {player.managerId && (
                          <Link 
                            href={`/teams/${player.managerId._id || player.managerId}`}
                            className="text-xs text-primary hover:underline"
                          >
                            {player.managerId.teamName || 'View Team'}
                          </Link>
                        )}
                      </div>
                    </div>

                    {/* Stat */}
                    <div className="text-right">
                      <p className={`text-2xl font-bold ${categories.find(c => c.key === category)?.color || 'text-white'}`}>
                        {getStatValue(player)}
                      </p>
                      <p className="text-xs text-text-muted uppercase">
                        {category === 'motmAwards' ? 'MOTM' : category.replace(/([A-Z])/g, ' $1').trim()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <Award className="w-16 h-16 text-text-muted mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No stats yet</h3>
                <p className="text-text-muted">Player statistics will appear once matches are played.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
