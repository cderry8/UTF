'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/static/Navbar';

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

  return (
    <>
    <Navbar/>
    
    <section className="min-h-screen flex items-center justify-center px-4 sm:px-6">
      <div className="w-full max-w-screen-xl bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-3xl font-bold text-[rgb(0,191,255)]">🏆 UTF League Table</h2>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <table className="w-full text-sm md:text-base text-left table-auto border-collapse">
              <thead className="bg-[rgb(0,191,255)] text-white">
                <tr>
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Team</th>
                  <th className="px-4 py-3">Manager</th>
                  <th className="px-4 py-3">P</th>
                  <th className="px-4 py-3">W</th>
                  <th className="px-4 py-3">D</th>
                  <th className="px-4 py-3">L</th>
                  <th className="px-4 py-3">GD</th>
                  <th className="px-4 py-3">Pts</th>
                </tr>
              </thead>
              <tbody className="text-gray-800">
                {tableData.map((entry, index) => (
                  <tr key={entry.managerId} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                    <td className="px-4 py-3 font-bold">{index + 1}</td>
                    <td className="px-4 py-3 flex items-center gap-2">
                      <img
                        src={entry.teamLogo}
                        alt="team logo"
                        className="w-6 h-6 object-contain rounded"
                      />
                      {entry.teamName}
                    </td>
                    <td className="px-4 py-3">{entry.managerName}</td>
                    <td className="px-4 py-3">{entry.matchesPlayed}</td>
                    <td className="px-4 py-3">{entry.wins}</td>
                    <td className="px-4 py-3">{entry.draws}</td>
                    <td className="px-4 py-3">{entry.losses}</td>
                    <td className="px-4 py-3">{entry.goalDifference}</td>
                    <td className="px-4 py-3 font-semibold">{entry.points}</td>
                  </tr>
                ))}
              </tbody>

            </table>
          )}
        </div>
      </div>
    </section>
    </>
  );
}
