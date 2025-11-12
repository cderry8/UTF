"use client";
import React, { useState } from "react";
import axios from "axios";

const FixturesPage = () => {
  const [gameweek, setGameweek] = useState(1);
  const [fixtures, setFixtures] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPosted, setIsPosted] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    setIsPosted(false);
    try {
      const response = await axios.get(
        `http://localhost:8000/utf/fixtures/generate/${gameweek}`
      );
      setFixtures(response.data.fixtures);
    } catch (err) {
      console.error("Error generating fixtures:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to generate fixtures.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      const cleanedFixtures = fixtures.map(f => ({
        homeTeamName: f.homeTeamName.trim(),
        awayTeamName: f.awayTeamName.trim(),
      }));

      const response = await axios.post(
        `http://localhost:8000/utf/fixtures/save/${gameweek}`,
        { fixtures: cleanedFixtures }
      );
      console.log("Fixtures saved:", response.data);
      setIsPosted(true);
    } catch (err) {
      console.error("Error saving fixtures:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to save fixtures.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (index, field, value) => {
    const updated = [...fixtures];
    updated[index][field] = value;
    setFixtures(updated);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Generate Gameweek Fixtures</h1>

      <div className="flex flex-wrap gap-4 items-center mb-4">
        <input
          type="number"
          min={1}
          value={gameweek}
          onChange={(e) => setGameweek(Number(e.target.value))}
          className="border p-2 rounded w-24"
          placeholder="Gameweek"
        />

        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className={`px-4 py-2 rounded text-white ${
            isGenerating ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isGenerating ? "Generating..." : "Generate Fixtures"}
        </button>

        <button
          onClick={handleSave}
          disabled={fixtures.length === 0 || isPosted || isSaving}
          className={`px-4 py-2 rounded text-white ${
            isSaving || isPosted
              ? "bg-green-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {isSaving
            ? "Saving..."
            : isPosted
            ? "Saved"
            : "Save Fixtures"}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}

      {isPosted && !isSaving && (
        <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
          Fixtures saved successfully!
        </div>
      )}

      {fixtures.length > 0 && (
        <>
          <p className="text-sm text-gray-500 mb-4">
            ⚠️ Make sure the team names exactly match the registered manager names (case-sensitive).
          </p>

          <div className="grid gap-4">
            {fixtures.map((match, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row items-center gap-2 border p-3 rounded bg-gray-50"
              >
                <div className="font-medium w-full sm:w-1/4 text-sm">
                  Gameweek {match.gameweek}
                </div>

                <input
                  type="text"
                  value={match.homeTeamName}
                  onChange={(e) =>
                    handleEdit(index, "homeTeamName", e.target.value)
                  }
                  className="border p-2 rounded w-full sm:w-1/3"
                />

                <span className="font-semibold">vs</span>

                <input
                  type="text"
                  value={match.awayTeamName}
                  onChange={(e) =>
                    handleEdit(index, "awayTeamName", e.target.value)
                  }
                  className="border p-2 rounded w-full sm:w-1/3"
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default FixturesPage;
