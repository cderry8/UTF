'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/static/Navbar';
import Footer from '../components/static/Footer';
import { Calendar, Clock, ChevronLeft, ChevronRight, Loader2, Swords } from 'lucide-react';

export default function FixturesPage() {
  const [fixtures, setFixtures] = useState([]);
  const [gameweek, setGameweek] = useState(null);
  const [allGameweeks, setAllGameweeks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noFixtures, setNoFixtures] = useState(false);

  useEffect(() => {
    fetchGameweek('latest');
    fetchAllGameweeks();
  }, []);

  const fetchAllGameweeks = async () => {
    try {
      const res = await axios.get('http://localhost:8000/utf/fixtures/all');
      const weeks = Object.keys(res.data).map(Number).sort((a, b) => a - b);
      setAllGameweeks(weeks);
    } catch (error) {
      console.error('Error fetching all gameweeks:', error);
    }
  };

  const fetchGameweek = async (week) => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:8000/utf/fixtures/${week === 'latest' ? 'latest' : `generate/${week}`}`);
      if (res.data && (res.data.fixtures?.length > 0 || res.data.length > 0)) {
        const fixturesData = res.data.fixtures || res.data;
        setFixtures(fixturesData);
        setGameweek(res.data.gameweek || week);
        setNoFixtures(false);
      } else {
        setNoFixtures(true);
      }
    } catch (error) {
      console.error('Error fetching fixtures:', error);
      setNoFixtures(true);
    } finally {
      setLoading(false);
    }
  };

  const navigateGameweek = (direction) => {
    if (!gameweek) return;
    const currentIndex = allGameweeks.indexOf(Number(gameweek));
    let newIndex;
    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : allGameweeks.length - 1;
    } else {
      newIndex = currentIndex < allGameweeks.length - 1 ? currentIndex + 1 : 0;
    }
    fetchGameweek(allGameweeks[newIndex]);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-10">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">Schedule</span>
            <h1 className="text-3xl sm:text-4xl font-orbitron font-bold text-white mt-2 mb-4">
              Match Fixtures
            </h1>
            <p className="text-text-muted max-w-2xl mx-auto">
              View upcoming and past fixtures for the current season.
            </p>
          </div>

          {/* Gameweek Navigation */}
          {allGameweeks.length > 0 && (
            <div className="flex items-center justify-between mb-8 bg-surface border border-border rounded-xl p-4">
              <button
                onClick={() => navigateGameweek('prev')}
                className="flex items-center gap-2 px-4 py-2 bg-surface-light rounded-lg hover:bg-border transition-colors text-text-muted hover:text-white"
              >
                <ChevronLeft className="w-5 h-5" />
                Previous
              </button>
              <div className="text-center">
                <span className="text-primary font-semibold">Gameweek {gameweek || '-'}</span>
              </div>
              <button
                onClick={() => navigateGameweek('next')}
                className="flex items-center gap-2 px-4 py-2 bg-surface-light rounded-lg hover:bg-border transition-colors text-text-muted hover:text-white"
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Fixtures List */}
          <div className="bg-surface border border-border rounded-2xl overflow-hidden">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
              </div>
            ) : noFixtures ? (
              <div className="text-center py-20">
                <Calendar className="w-16 h-16 text-text-muted mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No fixtures available</h3>
                <p className="text-text-muted">Fixtures will appear here when scheduled.</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {fixtures.map((match, index) => (
                  <div
                    key={match._id || index}
                    className="p-6 hover:bg-surface-light/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      {/* Home Team */}
                      <div className="flex-1 flex items-center justify-end gap-4">
                        <div className="text-right">
                          <p className="font-semibold text-white">{match.homeTeam?.teamName || match.homeTeamName || 'TBD'}</p>
                          <p className="text-xs text-text-muted">Home</p>
                        </div>
                        <img
                          src={match.homeTeam?.teamLogo || '/default-team.png'}
                          alt="Home"
                          className="w-12 h-12 object-contain rounded-lg bg-surface-light p-1"
                        />
                      </div>

                      {/* VS */}
                      <div className="px-6">
                        <div className="w-12 h-12 rounded-full bg-surface-light border border-border flex items-center justify-center">
                          <Swords className="w-5 h-5 text-primary" />
                        </div>
                      </div>

                      {/* Away Team */}
                      <div className="flex-1 flex items-center gap-4">
                        <img
                          src={match.awayTeam?.teamLogo || '/default-team.png'}
                          alt="Away"
                          className="w-12 h-12 object-contain rounded-lg bg-surface-light p-1"
                        />
                        <div>
                          <p className="font-semibold text-white">{match.awayTeam?.teamName || match.awayTeamName || 'TBD'}</p>
                          <p className="text-xs text-text-muted">Away</p>
                        </div>
                      </div>
                    </div>

                    {/* Match Info */}
                    <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-center gap-6">
                      <div className="flex items-center gap-2 text-sm text-text-muted">
                        <Calendar className="w-4 h-4" />
                        {match.date
                          ? new Date(match.date).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                            })
                          : 'Date TBD'}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-text-muted">
                        <Clock className="w-4 h-4" />
                        {match.time || 'Time TBD'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
