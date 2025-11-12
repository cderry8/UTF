'use client';

import { useState } from 'react';
import axios from 'axios';

export default function SubmitResultForm() {
  const [formData, setFormData] = useState({
    yourTeam: '',
    opponentTeam: '',
    yourScore: '',
    opponentScore: '',
    image: null,
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const form = new FormData();
    form.append('yourTeam', formData.yourTeam);
    form.append('opponentTeam', formData.opponentTeam);
    form.append('yourScore', formData.yourScore);
    form.append('opponentScore', formData.opponentScore);
    form.append('timePlayed', new Date().toISOString());
    form.append('message', formData.message);
    if (formData.image) {
      form.append('image', formData.image);
    }

    try {
      const res = await axios.post('http://localhost:8000/utf/results/submit', form);
      setSuccessMsg('Result submitted successfully!');
      setFormData({
        yourTeam: '',
        opponentTeam: '',
        yourScore: '',
        opponentScore: '',
        image: null,
        message: '',
      });
    } catch (err) {
      console.error('Error submitting result:', err);
      setErrorMsg('Failed to submit result. Please check the fields.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-4 bg-white shadow rounded space-y-4">
      <h2 className="text-xl font-bold mb-2">Submit Match Result</h2>

      <div className="grid md:grid-cols-2 gap-4">
        <input
          type="text"
          name="yourTeam"
          value={formData.yourTeam}
          onChange={handleChange}
          placeholder="Your Team Name"
          required
          className="border border-gray-300 rounded px-4 py-2 w-full"
        />
        <input
          type="text"
          name="opponentTeam"
          value={formData.opponentTeam}
          onChange={handleChange}
          placeholder="Opponent Team Name"
          required
          className="border border-gray-300 rounded px-4 py-2 w-full"
        />
        <input
          type="number"
          name="yourScore"
          value={formData.yourScore}
          onChange={handleChange}
          placeholder="Your Score"
          required
          className="border border-gray-300 rounded px-4 py-2 w-full"
        />
        <input
          type="number"
          name="opponentScore"
          value={formData.opponentScore}
          onChange={handleChange}
          placeholder="Opponent Score"
          required
          className="border border-gray-300 rounded px-4 py-2 w-full"
        />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium">Optional Screenshot</label>
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          className="border border-gray-300 rounded px-4 py-2 w-full"
        />
      </div>

      <div>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Optional message..."
          rows={3}
          className="border border-gray-300 rounded px-4 py-2 w-full"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
      >
        {loading ? 'Submitting...' : 'Submit Result'}
      </button>

      {successMsg && <p className="text-green-600 font-semibold">{successMsg}</p>}
      {errorMsg && <p className="text-red-600 font-semibold">{errorMsg}</p>}
    </form>
  );
}
