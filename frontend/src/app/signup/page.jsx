'use client';

import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Link from 'next/link';
import { 
  Trophy, User, Users, Mail, Lock, Globe, Gamepad2, 
  Calendar, Upload, Plus, Trash2, ArrowRight, Loader2, 
  ChevronLeft, Shield, CheckCircle, Crown, Swords
} from 'lucide-react';

const consoles = [
  { value: 'PS5', label: 'PlayStation 5', color: '#003791' },
  { value: 'Xbox', label: 'Xbox Series X/S', color: '#107C10' },
  { value: 'PC', label: 'PC', color: '#FF5C00' },
];

const countries = [
  'USA', 'UK', 'Canada', 'Germany', 'France', 'Spain', 
  'Italy', 'Netherlands', 'Brazil', 'Argentina', 'Mexico', 
  'Australia', 'Saudi Arabia', 'UAE', 'Other'
];

const positions = [
  { value: 'GK', label: 'Goalkeeper', desc: 'The last line of defense' },
  { value: 'DEF', label: 'Defender', desc: 'Protect the backline' },
  { value: 'MID', label: 'Midfielder', desc: 'Control the game' },
  { value: 'FWD', label: 'Forward', desc: 'Score the goals' },
  { value: 'ANY', label: 'Any Position', desc: 'Versatile player' },
];

export default function Signup() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState(null); // 'manager' or 'player'
  
  // Manager form state
  const [managerForm, setManagerForm] = useState({
    managerName: '',
    teamName: '',
    teamLogo: '',
    managerAge: '',
    gender: '',
    country: '',
    console: '',
    email: '',
    password: '',
    socialMedia: [{ platform: '', link: '' }]
  });
  
  // Player form state
  const [playerForm, setPlayerForm] = useState({
    fullName: '',
    email: '',
    password: '',
    age: '',
    country: '',
    proClubName: '',
    preferredPosition: 'MID',
    preferredFoot: 'Right',
    console: '',
    socialMedia: [{ platform: '', link: '' }]
  });

  const getUserIp = async () => {
    try {
      const res = await fetch('https://api.ipify.org?format=json');
      const data = await res.json();
      return data.ip;
    } catch (error) {
      console.error("Failed to get IP address", error);
      return "Unknown IP";
    }
  };

  const handleManagerChange = (e) => {
    setManagerForm({ ...managerForm, [e.target.name]: e.target.value });
  };

  const handlePlayerChange = (e) => {
    setPlayerForm({ ...playerForm, [e.target.name]: e.target.value });
  };

  const addSocialMedia = (isManager) => {
    if (isManager) {
      setManagerForm(prev => ({
        ...prev,
        socialMedia: [...prev.socialMedia, { platform: '', link: '' }]
      }));
    } else {
      setPlayerForm(prev => ({
        ...prev,
        socialMedia: [...prev.socialMedia, { platform: '', link: '' }]
      }));
    }
  };

  const removeSocialMedia = (index, isManager) => {
    if (isManager) {
      setManagerForm(prev => ({
        ...prev,
        socialMedia: prev.socialMedia.filter((_, i) => i !== index)
      }));
    } else {
      setPlayerForm(prev => ({
        ...prev,
        socialMedia: prev.socialMedia.filter((_, i) => i !== index)
      }));
    }
  };

  const updateSocialMedia = (index, field, value, isManager) => {
    if (isManager) {
      setManagerForm(prev => ({
        ...prev,
        socialMedia: prev.socialMedia.map((item, i) => 
          i === index ? { ...item, [field]: value } : item
        )
      }));
    } else {
      setPlayerForm(prev => ({
        ...prev,
        socialMedia: prev.socialMedia.map((item, i) => 
          i === index ? { ...item, [field]: value } : item
        )
      }));
    }
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const isStepValid = () => {
    if (role === 'manager') {
      switch(step) {
        case 1:
          return managerForm.managerName && managerForm.teamName && managerForm.email && managerForm.password && managerForm.managerAge;
        case 2:
          return managerForm.gender && managerForm.country && managerForm.console;
        case 3:
          return true;
      }
    } else {
      switch(step) {
        case 1:
          return playerForm.fullName && playerForm.email && playerForm.password && playerForm.age;
        case 2:
          return playerForm.country && playerForm.console && playerForm.proClubName;
        case 3:
          return true;
      }
    }
    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const ipAddress = await getUserIp();
      
      if (role === 'manager') {
        const formData = { 
          ...managerForm, 
          ipAddress,
          socialMediaLinks: managerForm.socialMedia.filter(s => s.platform && s.link)
        };

        const res = await axios.post('http://localhost:8000/utf/managers/request', formData);

        if (res.status === 201) {
          Swal.fire({
            title: 'Application Submitted!',
            text: 'Your manager application has been received and is under review. You will receive an email update once a decision has been made.',
            icon: 'success',
            confirmButtonColor: '#00d4ff',
            confirmButtonText: 'Got it!',
            background: '#141419',
            color: '#fff',
          });

          localStorage.setItem('utf_user', JSON.stringify(res.data.data));
          setStep(1);
          setRole(null);
        }
      } else {
        // Player registration
        const formData = {
          fullName: playerForm.fullName,
          email: playerForm.email,
          password: playerForm.password,
          age: playerForm.age,
          country: playerForm.country,
          proClubName: playerForm.proClubName,
          preferredPosition: playerForm.preferredPosition,
          preferredFoot: playerForm.preferredFoot,
          console: playerForm.console,
          socialMedia: playerForm.socialMedia.filter(s => s.platform && s.link),
          ipAddress
        };

        const res = await axios.post('http://localhost:8000/utf/player-users/register', formData);

        if (res.status === 201) {
          Swal.fire({
            title: 'Welcome to UTF!',
            text: 'Your player account has been created. You can now receive team invitations.',
            icon: 'success',
            confirmButtonColor: '#00d4ff',
            confirmButtonText: 'Get Started',
            background: '#141419',
            color: '#fff',
          });

          localStorage.setItem('utf_user', JSON.stringify(res.data.data));
          localStorage.setItem('token', res.data.token);
          
          // Redirect to player dashboard
          window.location.href = '/player-dashboard';
        }
      }
    } catch (error) {
      const message = error.response?.data?.error || 'Signup failed. Please try again.';
      Swal.fire({
        title: 'Error',
        text: message,
        icon: 'error',
        confirmButtonColor: '#d33',
        confirmButtonText: 'Close',
        background: '#141419',
        color: '#fff',
      });
    } finally {
      setLoading(false);
    }
  };

  const renderRoleSelection = () => (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-xl font-bold text-white text-center mb-8">Choose Your Role</h2>
      
      <div className="grid md:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => setRole('manager')}
          className={`p-6 border-2 rounded-2xl text-left transition-all ${
            role === 'manager'
              ? 'border-primary bg-primary/10'
              : 'border-border bg-surface-light hover:border-primary/50'
          }`}
        >
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4">
            <Crown className="w-7 h-7 text-black" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Team Manager</h3>
          <p className="text-text-muted text-sm">
            Create and manage your own team. Recruit players, submit match results, and lead your squad to victory.
          </p>
        </button>

        <button
          type="button"
          onClick={() => setRole('player')}
          className={`p-6 border-2 rounded-2xl text-left transition-all ${
            role === 'player'
              ? 'border-secondary bg-secondary/10'
              : 'border-border bg-surface-light hover:border-secondary/50'
          }`}
        >
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-secondary to-purple-500 flex items-center justify-center mb-4">
            <Swords className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Player</h3>
          <p className="text-text-muted text-sm">
            Join a team as a player. Connect with managers, showcase your skills, and compete in league matches.
          </p>
        </button>
      </div>

      {role && (
        <div className="flex justify-center pt-4">
          <button
            onClick={nextStep}
            className="flex items-center gap-2 px-8 py-3 bg-primary text-black font-semibold rounded-xl hover:shadow-glow-lg transition-all"
          >
            Continue
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-4 mb-8">
      {[1, 2, 3].map((s) => (
        <div key={s} className="flex items-center gap-2">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
            step >= s 
              ? 'bg-primary text-black' 
              : 'bg-surface-light text-text-muted border border-border'
          }`}>
            {step > s ? <CheckCircle className="w-5 h-5" /> : s}
          </div>
          {s < 3 && (
            <div className={`w-12 h-1 rounded transition-all ${
              step > s ? 'bg-primary' : 'bg-border'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => {
    if (role === 'manager') {
      return (
        <div className="space-y-5 animate-fade-in">
          <h2 className="text-xl font-bold text-white mb-6">Account Information</h2>
          
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Manager Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type="text"
                  name="managerName"
                  value={managerForm.managerName}
                  onChange={handleManagerChange}
                  placeholder="Your name"
                  className="input-gaming"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Team Name</label>
              <div className="relative">
                <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type="text"
                  name="teamName"
                  value={managerForm.teamName}
                  onChange={handleManagerChange}
                  placeholder="Your team name"
                  className="input-gaming"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type="email"
                  name="email"
                  value={managerForm.email}
                  onChange={handleManagerChange}
                  placeholder="you@example.com"
                  className="input-gaming"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type="password"
                  name="password"
                  value={managerForm.password}
                  onChange={handleManagerChange}
                  placeholder="Create a password"
                  className="input-gaming"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Age</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type="number"
                  name="managerAge"
                  value={managerForm.managerAge}
                  onChange={handleManagerChange}
                  placeholder="18"
                  min="13"
                  max="99"
                  className="input-gaming"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Gender</label>
              <select
                name="gender"
                value={managerForm.gender}
                onChange={handleManagerChange}
                className="input-gaming input-gaming-iconless"
                required
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not">Prefer not to say</option>
              </select>
            </div>
          </div>
        </div>
      );
    }
    
    // Player step 1
    return (
      <div className="space-y-5 animate-fade-in">
        <h2 className="text-xl font-bold text-white mb-6">Player Account</h2>
        
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                type="text"
                name="fullName"
                value={playerForm.fullName}
                onChange={handlePlayerChange}
                placeholder="Your name"
                className="input-gaming"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                type="email"
                name="email"
                value={playerForm.email}
                onChange={handlePlayerChange}
                placeholder="you@example.com"
                className="input-gaming"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                type="password"
                name="password"
                value={playerForm.password}
                onChange={handlePlayerChange}
                placeholder="Create a password"
                className="input-gaming"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Age</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                type="number"
                name="age"
                value={playerForm.age}
                onChange={handlePlayerChange}
                placeholder="18"
                min="13"
                max="99"
                className="input-gaming"
                required
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderStep2 = () => {
    if (role === 'manager') {
      return (
        <div className="space-y-5 animate-fade-in">
          <h2 className="text-xl font-bold text-white mb-6">Team Details</h2>
          
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Country</label>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <select
                  name="country"
                  value={managerForm.country}
                  onChange={handleManagerChange}
                  className="input-gaming"
                  required
                >
                  <option value="">Select your country</option>
                  {countries.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Console</label>
              <div className="relative">
                <Gamepad2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <select
                  name="console"
                  value={managerForm.console}
                  onChange={handleManagerChange}
                  className="input-gaming"
                  required
                >
                  <option value="">Select console</option>
                  {consoles.map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Team Logo Upload */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-white mb-2">Team Logo</label>
            <div
              onClick={() => document.getElementById('logoUpload').click()}
              className="relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-xl cursor-pointer bg-surface-light hover:border-primary/50 transition-all group"
            >
              {managerForm.teamLogo ? (
                <img src={managerForm.teamLogo} alt="Team Logo" className="object-contain h-full p-4" />
              ) : (
                <>
                  <Upload className="w-10 h-10 text-text-muted group-hover:text-primary transition-colors mb-2" />
                  <span className="text-text-muted group-hover:text-white transition-colors">Click to upload team logo</span>
                  <span className="text-xs text-text-muted mt-1">PNG, JPG up to 5MB</span>
                </>
              )}
            </div>
            <input
              id="logoUpload"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setManagerForm(prev => ({ ...prev, teamLogo: reader.result }));
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="hidden"
            />
          </div>
        </div>
      );
    }
    
    // Player step 2
    return (
      <div className="space-y-5 animate-fade-in">
        <h2 className="text-xl font-bold text-white mb-6">Pro Clubs Profile</h2>
        
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Country</label>
            <select
              name="country"
              value={playerForm.country}
              onChange={handlePlayerChange}
              className="input-gaming input-gaming-iconless"
              required
            >
              <option value="">Select your country</option>
              {countries.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Console</label>
            <select
              name="console"
              value={playerForm.console}
              onChange={handlePlayerChange}
              className="input-gaming input-gaming-iconless"
              required
            >
              <option value="">Select console</option>
              {consoles.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Pro Club Name</label>
            <div className="relative">
              <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                type="text"
                name="proClubName"
                value={playerForm.proClubName}
                onChange={handlePlayerChange}
                placeholder="Your Pro Clubs name"
                className="input-gaming"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Preferred Foot</label>
            <select
              name="preferredFoot"
              value={playerForm.preferredFoot}
              onChange={handlePlayerChange}
              className="input-gaming input-gaming-iconless"
            >
              <option value="Right">Right</option>
              <option value="Left">Left</option>
              <option value="Both">Both</option>
            </select>
          </div>
        </div>

        {/* Position Selection */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-white mb-3">Preferred Position</label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {positions.map((pos) => (
              <button
                key={pos.value}
                type="button"
                onClick={() => setPlayerForm({ ...playerForm, preferredPosition: pos.value })}
                className={`p-3 border rounded-xl text-center transition-all ${
                  playerForm.preferredPosition === pos.value
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-surface-light hover:border-primary/50'
                }`}
              >
                <span className="block font-bold text-white">{pos.value}</span>
                <span className="block text-xs text-text-muted mt-1">{pos.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderStep3 = () => {
    const form = role === 'manager' ? managerForm : playerForm;
    const socialMedia = role === 'manager' ? managerForm.socialMedia : playerForm.socialMedia;
    const isManager = role === 'manager';
    
    return (
      <div className="space-y-5 animate-fade-in">
        <h2 className="text-xl font-bold text-white mb-6">Social Media (Optional)</h2>
        
        <div className="space-y-4">
          {socialMedia.map((social, index) => (
            <div key={index} className="flex gap-3">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Platform (e.g. Twitter)"
                  value={social.platform}
                  onChange={(e) => updateSocialMedia(index, 'platform', e.target.value, isManager)}
                  className="input-gaming input-gaming-iconless mb-2"
                />
                <input
                  type="url"
                  placeholder="Profile URL"
                  value={social.link}
                  onChange={(e) => updateSocialMedia(index, 'link', e.target.value, isManager)}
                  className="input-gaming input-gaming-iconless"
                />
              </div>
              {socialMedia.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSocialMedia(index, isManager)}
                  className="p-3 h-fit text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => addSocialMedia(isManager)}
          className="flex items-center gap-2 text-primary hover:text-white transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Add another social media
        </button>

        <div className="mt-8 p-4 bg-surface-light rounded-xl border border-border">
          <h3 className="text-white font-medium mb-2">
            Review your {isManager ? 'application' : 'profile'}
          </h3>
          <ul className="text-sm text-text-muted space-y-1">
            {isManager ? (
              <>
                <li>• Manager: {managerForm.managerName || '-'}</li>
                <li>• Team: {managerForm.teamName || '-'}</li>
                <li>• Email: {managerForm.email || '-'}</li>
                <li>• Console: {managerForm.console || '-'}</li>
                <li>• Country: {managerForm.country || '-'}</li>
              </>
            ) : (
              <>
                <li>• Player: {playerForm.fullName || '-'}</li>
                <li>• Pro Club: {playerForm.proClubName || '-'}</li>
                <li>• Position: {playerForm.preferredPosition || '-'}</li>
                <li>• Email: {playerForm.email || '-'}</li>
                <li>• Console: {playerForm.console || '-'}</li>
              </>
            )}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-background hero-bg flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-glow">
              <Trophy className="w-6 h-6 text-black" />
            </div>
            <span className="text-2xl font-orbitron font-bold gradient-text">UTF</span>
          </Link>
          <h1 className="text-3xl font-bold text-white mt-4 mb-2">Join the League</h1>
          <p className="text-text-muted">
            {role === 'player' ? 'Register as a player and join a team' : 'Register your team to compete in UTF'}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-surface border border-border rounded-2xl p-8 shadow-card">
          {step === 0 ? null : renderStepIndicator()}

          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 0 && renderRoleSelection()}
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}

            {/* Navigation Buttons */}
            {step > 0 && (
              <div className="flex gap-4 pt-6 border-t border-border">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-surface-light border border-border rounded-xl text-white hover:bg-border transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    Back
                  </button>
                )}
                
                {step < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!isStepValid()}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary text-black font-semibold rounded-xl hover:shadow-glow-lg transition-all disabled:opacity-50"
                  >
                    Continue
                    <ArrowRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary text-black font-semibold rounded-xl hover:shadow-glow-lg transition-all disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        {role === 'manager' ? 'Submit Application' : 'Create Account'}
                        <CheckCircle className="w-5 h-5" />
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
          </form>

          {step > 0 && (
            <div className="mt-6 text-center">
              <p className="text-text-muted text-sm">
                Already have an account?{' '}
                <Link href="/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          )}
        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          {step === 0 ? (
            <Link href="/" className="text-text-muted hover:text-white transition-colors text-sm">
              ← Back to home
            </Link>
          ) : (
            <button
              onClick={() => { setStep(0); setRole(null); }}
              className="text-text-muted hover:text-white transition-colors text-sm"
            >
              ← Start over
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
