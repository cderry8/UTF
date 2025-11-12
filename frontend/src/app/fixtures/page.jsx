'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/static/Navbar';

export default function FixturesPage() {
  const [fixtures, setFixtures] = useState([]);
  const [gameweek, setGameweek] = useState(null);
  const [loading, setLoading] = useState(true);
  const [noFixtures, setNoFixtures] = useState(false);

  useEffect(() => {
    const fetchFixtures = async () => {
      try {
        const res = await axios.get('http://localhost:8000/utf/fixtures/latest');
        if (res.data && res.data.fixtures.length > 0) {
          setFixtures(res.data.fixtures);
          setGameweek(res.data.gameweek);
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

    fetchFixtures();
  }, []);

  return (
    <>
      <Navbar />
      <section className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-xl bg-white shadow-lg rounded-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-[rgb(0,191,255)]">📅 Match Fixtures</h2>
            {gameweek && (
              <p className="text-sm text-gray-500 mt-1">Gameweek {gameweek}</p>
            )}
          </div>

          {loading ? (
            <div className="py-10 flex justify-center items-center">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : noFixtures ? (
            <div className="p-6 text-center text-gray-600">
              🚫 No fixtures available for now.
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {fixtures.map((match) => (
                <div
                  key={match._id}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 transition"
                >
                  {/* Teams */}
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-start">
                      {/* Home team */}
                      <div className="flex items-center gap-2">
                        <img
                          src={match.homeTeam?.teamLogo || '/default-logo.png'}
                          alt={match.homeTeam?.teamName || 'Home'}
                          className="w-5 h-5 object-contain"
                        />
                        <span className="text-sm text-gray-800">{match.homeTeam?.teamName || 'Home Team'}</span>
                      </div>

                      {/* Away team */}
                      <div className="flex items-center gap-2 mt-1">
                        <img
                          src={match.awayTeam?.teamLogo || '/default-logo.png'}
                          alt={match.awayTeam?.teamName || 'Away'}
                          className="w-5 h-5 object-contain"
                        />
                        <span className="text-sm text-gray-800">{match.awayTeam?.teamName || 'Away Team'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Time */}
                  <div className="pl-4 ml-4 border-l border-gray-300 text-right text-sm text-gray-600 whitespace-nowrap">
                    <p className="font-medium">
                      {match.date
                        ? new Date(match.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                          })
                        : 'TBD'}
                    </p>
                    <p>{match.time || 'TBD'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
