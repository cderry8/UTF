'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/static/Navbar';
import Footer from '../components/static/Footer';
import { Trophy, TrendingUp, TrendingDown, Minus, Loader2 } from 'lucide-react';

export default function TablePage() {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTable = async () => {
      try {
        const response = await axios.get('http://localhost:8000/utf/table');
        setTableData(response.data);
      } catch (error) {
        console.error('Failed to fetch table:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTable();
  }, []);

  const getFormIndicator = (index) => {
    if (index < 4) return <TrendingUp className="w-4 h-4 text-emerald-500" />;
    if (index >= tableData.length - 3) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-text-muted" />;
  };

  const getRowStyle = (index) => {
    if (index === 0) return 'bg-gradient-to-r from-amber-500/10 to-transparent border-l-4 border-amber-500';
    if (index === 1) return 'bg-gradient-to-r from-slate-300/10 to-transparent border-l-4 border-slate-300';
    if (index === 2) return 'bg-gradient-to-r from-orange-600/10 to-transparent border-l-4 border-orange-600';
    if (index < 4) return 'bg-emerald-500/5';
    return '';
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-10">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">Season 1</span>
            <h1 className="text-3xl sm:text-4xl font-orbitron font-bold text-white mt-2 mb-4">
              League Standings
            </h1>
            <p className="text-text-muted max-w-2xl mx-auto">
              Current standings ranked by points, then goal difference.
            </p>
          </div>

          {/* Table */}
          <div className="bg-surface border border-border rounded-2xl overflow-hidden">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
              </div>
            ) : tableData.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-surface-light border-b border-border">
                      <th className="px-4 py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider w-16">Pos</th>
                      <th className="px-4 py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Team</th>
                      <th className="px-4 py-4 text-center text-xs font-semibold text-text-muted uppercase tracking-wider w-14">P</th>
                      <th className="px-4 py-4 text-center text-xs font-semibold text-text-muted uppercase tracking-wider w-14">W</th>
                      <th className="px-4 py-4 text-center text-xs font-semibold text-text-muted uppercase tracking-wider w-14">D</th>
                      <th className="px-4 py-4 text-center text-xs font-semibold text-text-muted uppercase tracking-wider w-14">L</th>
                      <th className="px-4 py-4 text-center text-xs font-semibold text-text-muted uppercase tracking-wider w-20">GD</th>
                      <th className="px-4 py-4 text-center text-xs font-semibold text-primary uppercase tracking-wider w-20">Pts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((entry, index) => (
                      <tr
                        key={entry.managerId}
                        className={`border-b border-border/50 hover:bg-surface-light/50 transition-colors ${getRowStyle(index)}`}
                      >
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <span className={`font-bold w-6 ${index < 3 ? 'text-white' : 'text-text-muted'}`}>
                              {index + 1}
                            </span>
                            {getFormIndicator(index)}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={entry.teamLogo || '/default-team.png'}
                              alt={entry.teamName}
                              className="w-10 h-10 object-contain rounded-lg bg-surface-light p-1"
                            />
                            <div>
                              <p className="font-semibold text-white">{entry.teamName}</p>
                              <p className="text-xs text-text-muted">{entry.managerName}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center text-text-muted">{entry.matchesPlayed}</td>
                        <td className="px-4 py-4 text-center text-emerald-500">{entry.wins}</td>
                        <td className="px-4 py-4 text-center text-amber-500">{entry.draws}</td>
                        <td className="px-4 py-4 text-center text-red-500">{entry.losses}</td>
                        <td className="px-4 py-4 text-center text-white">
                          {entry.goalDifference > 0 ? `+${entry.goalDifference}` : entry.goalDifference}
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className="text-xl font-bold text-primary">{entry.points}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-20">
                <Trophy className="w-16 h-16 text-text-muted mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No standings yet</h3>
                <p className="text-text-muted">Standings will appear once matches are played.</p>
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-amber-500 rounded" />
              <span className="text-sm text-text-muted">Champion</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-slate-300 rounded" />
              <span className="text-sm text-text-muted">Runner-up</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-600 rounded" />
              <span className="text-sm text-text-muted">Third Place</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-emerald-500/20 rounded" />
              <span className="text-sm text-text-muted">Top 4</span>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
