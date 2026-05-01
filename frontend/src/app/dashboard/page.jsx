'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import Navbar from '../components/static/Navbar';
import { 
  Users, Trophy, Calendar, Settings, TrendingUp, 
  UserPlus, Edit2, Trash2, Shield, Gamepad2,
  ChevronRight, Loader2, AlertCircle, Bell, Search,
  Mail, Send, X
} from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [players, setPlayers] = useState([]);
  const [teamStats, setTeamStats] = useState({
    matchesPlayed: 0, wins: 0, draws: 0, losses: 0,
    goalsFor: 0, goalsAgainst: 0, points: 0
  });
  const [loading, setLoading] = useState(true);
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [newPlayer, setNewPlayer] = useState({
    playerName: '',
    proClubName: '',
    position: 'MID',
    preferredFoot: 'Right'
  });
  
  // Invitation states
  const [availablePlayers, setAvailablePlayers] = useState([]);
  const [sentInvitations, setSentInvitations] = useState([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteSearch, setInviteSearch] = useState('');
  const [inviteMessage, setInviteMessage] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [activeTab, setActiveTab] = useState('squad'); // 'squad', 'invitations'

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!storedUser || !token) {
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
    
    if (parsedUser._id) {
      fetchTeamData(parsedUser._id);
    }
  }, [router]);

  const fetchTeamData = async (managerId) => {
    try {
      const [playersRes, tableRes, availableRes, invitesRes] = await Promise.all([
        axios.get(`http://localhost:8000/utf/players/team/${managerId}`),
        axios.get('http://localhost:8000/utf/table'),
        axios.get('http://localhost:8000/utf/player-users/available'),
        axios.get(`http://localhost:8000/utf/invitations/manager/${managerId}`)
      ]);
      
      setPlayers(playersRes.data);
      setAvailablePlayers(availableRes.data);
      setSentInvitations(invitesRes.data);
      
      const teamEntry = tableRes.data.find(t => t.managerId === managerId);
      if (teamEntry) {
        setTeamStats(teamEntry);
      }
    } catch (error) {
      console.error('Error fetching team data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendInvite = async (e) => {
    e.preventDefault();
    if (!selectedPlayer) return;

    try {
      await axios.post('http://localhost:8000/utf/invitations/send', {
        managerId: user._id,
        playerId: selectedPlayer._id,
        message: inviteMessage
      });

      setShowInviteModal(false);
      setSelectedPlayer(null);
      setInviteMessage('');
      setInviteSearch('');
      fetchTeamData(user._id);
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to send invitation');
    }
  };

  const handleCancelInvite = async (invitationId) => {
    if (!confirm('Cancel this invitation?')) return;
    
    try {
      await axios.delete(`http://localhost:8000/utf/invitations/cancel/${invitationId}`);
      fetchTeamData(user._id);
    } catch (error) {
      alert('Failed to cancel invitation');
    }
  };

  const handleAddPlayer = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/utf/players/add', {
        ...newPlayer,
        managerId: user._id
      });
      
      setShowAddPlayer(false);
      setNewPlayer({ playerName: '', proClubName: '', position: 'MID', preferredFoot: 'Right' });
      fetchTeamData(user._id);
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to add player');
    }
  };

  const handleRemovePlayer = async (playerId) => {
    if (!confirm('Remove this player from your team?')) return;
    
    try {
      await axios.put(`http://localhost:8000/utf/players/remove/${playerId}`);
      fetchTeamData(user._id);
    } catch (error) {
      alert('Failed to remove player');
    }
  };

  const filteredPlayers = availablePlayers.filter(player => 
    player.fullName.toLowerCase().includes(inviteSearch.toLowerCase()) ||
    player.proClubName.toLowerCase().includes(inviteSearch.toLowerCase())
  );

  const pendingInvites = sentInvitations.filter(i => i.status === 'pending');

  const positionColors = {
    GK: 'from-amber-500 to-orange-500',
    DEF: 'from-blue-500 to-cyan-500',
    MID: 'from-emerald-500 to-teal-500',
    FWD: 'from-rose-500 to-pink-500',
    ANY: 'from-primary to-secondary'
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-background pt-24 flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </main>
      </>
    );
  }

  if (!user) return null;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              {user.teamLogo && (
                <img 
                  src={user.teamLogo} 
                  alt={user.teamName}
                  className="w-16 h-16 object-contain rounded-xl bg-surface p-2"
                />
              )}
              <div>
                <h1 className="text-3xl font-bold text-white">{user.teamName}</h1>
                <p className="text-text-muted">Manager: {user.managerName}</p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-surface border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 text-text-muted text-sm mb-1">
                <Calendar className="w-4 h-4" />
                Matches
              </div>
              <p className="text-2xl font-bold text-white">{teamStats.matchesPlayed}</p>
            </div>
            <div className="bg-surface border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 text-text-muted text-sm mb-1">
                <Trophy className="w-4 h-4 text-amber-500" />
                Points
              </div>
              <p className="text-2xl font-bold text-primary">{teamStats.points}</p>
            </div>
            <div className="bg-surface border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 text-text-muted text-sm mb-1">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                Form
              </div>
              <p className="text-lg font-medium text-white">
                {teamStats.wins}W {teamStats.draws}D {teamStats.losses}L
              </p>
            </div>
            <div className="bg-surface border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 text-text-muted text-sm mb-1">
                <Users className="w-4 h-4" />
                Players
              </div>
              <p className="text-2xl font-bold text-white">{players.length}</p>
            </div>
          </div>

          {/* Players Section */}
          <div className="bg-surface border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="flex gap-2 p-1 bg-surface-light rounded-lg">
                  <button
                    onClick={() => setActiveTab('squad')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeTab === 'squad'
                        ? 'bg-primary text-black'
                        : 'text-text-muted hover:text-white'
                    }`}
                  >
                    <Shield className="w-4 h-4 inline mr-2" />
                    Squad ({players.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('invitations')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeTab === 'invitations'
                        ? 'bg-secondary text-white'
                        : 'text-text-muted hover:text-white'
                    }`}
                  >
                    <Bell className="w-4 h-4 inline mr-2" />
                    Invitations
                    {pendingInvites.length > 0 && (
                      <span className="ml-2 px-1.5 py-0.5 bg-primary text-black text-xs rounded-full">
                        {pendingInvites.length}
                      </span>
                    )}
                  </button>
                </div>
              </div>
              {activeTab === 'squad' ? (
                <button
                  onClick={() => setShowAddPlayer(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-lg hover:shadow-glow transition-all"
                >
                  <UserPlus className="w-4 h-4" />
                  Add Player
                </button>
              ) : (
                <button
                  onClick={() => setShowInviteModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-lg hover:shadow-glow transition-all"
                >
                  <Send className="w-4 h-4" />
                  Invite Player
                </button>
              )}
            </div>

            {activeTab === 'squad' ? (
              players.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-text-muted mx-auto mb-4" />
                <p className="text-text-muted mb-4">No players in your squad yet</p>
                <button
                  onClick={() => setShowAddPlayer(true)}
                  className="text-primary hover:underline"
                >
                  Add your first player
                </button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {players.map((player) => (
                  <div 
                    key={player._id}
                    className="bg-surface-light border border-border rounded-xl p-4 group hover:border-primary/50 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${positionColors[player.position]} flex items-center justify-center`}>
                        <span className="text-white font-bold text-sm">{player.position}</span>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleRemovePlayer(player._id)}
                          className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-white">{player.playerName}</h3>
                    <p className="text-sm text-text-muted mb-3">{player.proClubName}</p>
                    
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="bg-surface p-2 rounded-lg">
                        <p className="text-primary font-bold">{player.stats.goals}</p>
                        <p className="text-text-muted">Goals</p>
                      </div>
                      <div className="bg-surface p-2 rounded-lg">
                        <p className="text-emerald-500 font-bold">{player.stats.assists}</p>
                        <p className="text-text-muted">Assists</p>
                      </div>
                      <div className="bg-surface p-2 rounded-lg">
                        <p className="text-amber-500 font-bold">{player.stats.matchesPlayed}</p>
                        <p className="text-text-muted">Games</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
            ) : (
              // Invitations Tab
              <div className="space-y-4">
                {sentInvitations.length === 0 ? (
                  <div className="text-center py-12">
                    <Bell className="w-12 h-12 text-text-muted mx-auto mb-4" />
                    <p className="text-text-muted mb-4">No invitations sent yet</p>
                    <button
                      onClick={() => setShowInviteModal(true)}
                      className="text-secondary hover:underline"
                    >
                      Invite a player
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {sentInvitations.map((invite) => (
                      <div 
                        key={invite._id}
                        className={`p-4 rounded-xl border ${
                          invite.status === 'pending'
                            ? 'bg-surface-light border-secondary/30'
                            : invite.status === 'accepted'
                            ? 'bg-emerald-500/5 border-emerald-500/30'
                            : 'bg-surface-light border-border'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-secondary to-purple-500 flex items-center justify-center">
                              <span className="text-white font-bold text-xs">{invite.playerId?.preferredPosition || 'ANY'}</span>
                            </div>
                            <div>
                              <p className="font-semibold text-white">{invite.playerId?.fullName || 'Unknown'}</p>
                              <p className="text-sm text-text-muted">{invite.playerId?.proClubName || '-'}</p>
                              {invite.message && (
                                <p className="text-xs text-text-muted mt-1 italic">
                                  &ldquo;{invite.message}&rdquo;
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${
                              invite.status === 'pending' ? 'bg-amber-500/20 text-amber-500' :
                              invite.status === 'accepted' ? 'bg-emerald-500/20 text-emerald-500' :
                              'bg-red-500/20 text-red-500'
                            }`}>
                              {invite.status === 'pending' ? (
                                <><Clock className="w-3 h-3" /> Pending</>
                              ) : invite.status === 'accepted' ? (
                                <><CheckCircle className="w-3 h-3" /> Accepted</>
                              ) : (
                                <><X className="w-3 h-3" /> Declined</>
                              )}
                            </span>
                            {invite.status === 'pending' && (
                              <button
                                onClick={() => handleCancelInvite(invite._id)}
                                className="block mt-2 text-xs text-red-500 hover:underline"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="grid sm:grid-cols-3 gap-4 mt-8">
            <Link href="/fixtures" className="flex items-center justify-between p-4 bg-surface border border-border rounded-xl hover:border-primary/50 transition-all">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-primary" />
                <span className="text-white font-medium">View Fixtures</span>
              </div>
              <ChevronRight className="w-5 h-5 text-text-muted" />
            </Link>
            <Link href="/table" className="flex items-center justify-between p-4 bg-surface border border-border rounded-xl hover:border-primary/50 transition-all">
              <div className="flex items-center gap-3">
                <Trophy className="w-5 h-5 text-amber-500" />
                <span className="text-white font-medium">League Table</span>
              </div>
              <ChevronRight className="w-5 h-5 text-text-muted" />
            </Link>
            <Link href="/results" className="flex items-center justify-between p-4 bg-surface border border-border rounded-xl hover:border-primary/50 transition-all">
              <div className="flex items-center gap-3">
                <Gamepad2 className="w-5 h-5 text-emerald-500" />
                <span className="text-white font-medium">Submit Result</span>
              </div>
              <ChevronRight className="w-5 h-5 text-text-muted" />
            </Link>
          </div>
        </div>

        {/* Add Player Modal */}
        {showAddPlayer && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-surface border border-border rounded-2xl p-6 w-full max-w-md">
              <h3 className="text-xl font-bold text-white mb-4">Add Player</h3>
              <form onSubmit={handleAddPlayer} className="space-y-4">
                <div>
                  <label className="block text-sm text-white mb-2">Player Name</label>
                  <input
                    type="text"
                    value={newPlayer.playerName}
                    onChange={(e) => setNewPlayer({ ...newPlayer, playerName: e.target.value })}
                    className="input-gaming input-gaming-iconless"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-white mb-2">Pro Club Name</label>
                  <input
                    type="text"
                    value={newPlayer.proClubName}
                    onChange={(e) => setNewPlayer({ ...newPlayer, proClubName: e.target.value })}
                    className="input-gaming input-gaming-iconless"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-white mb-2">Position</label>
                    <select
                      value={newPlayer.position}
                      onChange={(e) => setNewPlayer({ ...newPlayer, position: e.target.value })}
                      className="input-gaming input-gaming-iconless"
                    >
                      <option value="GK">Goalkeeper</option>
                      <option value="DEF">Defender</option>
                      <option value="MID">Midfielder</option>
                      <option value="FWD">Forward</option>
                      <option value="ANY">Any</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-white mb-2">Preferred Foot</label>
                    <select
                      value={newPlayer.preferredFoot}
                      onChange={(e) => setNewPlayer({ ...newPlayer, preferredFoot: e.target.value })}
                      className="input-gaming input-gaming-iconless"
                    >
                      <option value="Right">Right</option>
                      <option value="Left">Left</option>
                      <option value="Both">Both</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddPlayer(false)}
                    className="flex-1 py-3 bg-surface-light border border-border rounded-xl text-white hover:bg-border transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-primary text-black font-semibold rounded-xl hover:shadow-glow transition-all"
                  >
                    Add Player
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Invite Player Modal */}
        {showInviteModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-surface border border-border rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold text-white mb-4">Invite Player to Team</h3>
              
              {selectedPlayer ? (
                <form onSubmit={handleSendInvite} className="space-y-4">
                  <div className="p-4 bg-surface-light rounded-xl border border-border">
                    <p className="font-semibold text-white">{selectedPlayer.fullName}</p>
                    <p className="text-sm text-text-muted">{selectedPlayer.proClubName}</p>
                    <div className="flex gap-2 mt-2">
                      <span className="px-2 py-0.5 bg-secondary/20 text-secondary text-xs rounded">{selectedPlayer.preferredPosition}</span>
                      <span className="px-2 py-0.5 bg-primary/20 text-primary text-xs rounded">{selectedPlayer.console}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-white mb-2">Message (Optional)</label>
                    <textarea
                      value={inviteMessage}
                      onChange={(e) => setInviteMessage(e.target.value)}
                      placeholder="Write a message to the player..."
                      className="input-gaming input-gaming-iconless min-h-[100px] resize-none"
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => { setSelectedPlayer(null); setInviteMessage(''); }}
                      className="flex-1 py-3 bg-surface-light border border-border rounded-xl text-white hover:bg-border transition-all"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-secondary text-white font-semibold rounded-xl hover:shadow-glow transition-all"
                    >
                      Send Invite
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="relative mb-4">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                    <input
                      type="text"
                      placeholder="Search players by name or pro club..."
                      value={inviteSearch}
                      onChange={(e) => setInviteSearch(e.target.value)}
                      className="input-gaming pl-12"
                    />
                  </div>
                  
                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {filteredPlayers.length === 0 ? (
                      <div className="text-center py-8">
                        <Search className="w-10 h-10 text-text-muted mx-auto mb-3" />
                        <p className="text-text-muted">No available players found</p>
                      </div>
                    ) : (
                      filteredPlayers.map((player) => (
                        <button
                          key={player._id}
                          onClick={() => setSelectedPlayer(player)}
                          className="w-full p-4 bg-surface-light rounded-xl border border-border hover:border-secondary/50 transition-all text-left"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-secondary to-purple-500 flex items-center justify-center">
                                <span className="text-white font-bold text-xs">{player.preferredPosition}</span>
                              </div>
                              <div>
                                <p className="font-semibold text-white">{player.fullName}</p>
                                <p className="text-sm text-text-muted">{player.proClubName}</p>
                              </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-text-muted" />
                          </div>
                          <div className="flex gap-2 mt-2">
                            <span className="px-2 py-0.5 bg-surface rounded text-xs text-text-muted">{player.console}</span>
                            <span className="px-2 py-0.5 bg-surface rounded text-xs text-text-muted">{player.country}</span>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                  
                  <button
                    onClick={() => { setShowInviteModal(false); setInviteSearch(''); }}
                    className="w-full mt-4 py-3 bg-surface-light border border-border rounded-xl text-white hover:bg-border transition-all"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
