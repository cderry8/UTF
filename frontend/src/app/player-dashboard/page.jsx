'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import Navbar from '../components/static/Navbar';
import { 
  User, Bell, Mail, Shield, Gamepad2, MapPin, 
  CheckCircle, XCircle, Clock, ChevronRight, Loader2,
  LogOut, MessageSquare, Users, Trophy
} from 'lucide-react';

export default function PlayerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [invitations, setInvitations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [newMessage, setNewMessage] = useState({ subject: '', message: '', category: 'general' });
  const [respondingTo, setRespondingTo] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');
    
    if (!storedUser || !token || userType !== 'player') {
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
    
    if (parsedUser._id) {
      fetchPlayerData(parsedUser._id);
    }
  }, [router]);

  const fetchPlayerData = async (playerId) => {
    try {
      const [invitesRes, messagesRes] = await Promise.all([
        axios.get(`http://localhost:8000/utf/invitations/player/${playerId}`),
        axios.get(`http://localhost:8000/utf/messages/sender/PlayerUser/${playerId}`)
      ]);
      
      setInvitations(invitesRes.data);
      setMessages(messagesRes.data);
    } catch (error) {
      console.error('Error fetching player data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRespondToInvite = async (invitationId, response) => {
    try {
      await axios.put(`http://localhost:8000/utf/invitations/respond/${invitationId}`, {
        response,
        message: respondingTo?.message || ''
      });
      
      fetchPlayerData(user._id);
      setRespondingTo(null);
    } catch (error) {
      alert('Failed to respond to invitation');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/utf/messages/send', {
        senderId: user._id,
        senderType: 'PlayerUser',
        senderName: user.fullName,
        senderEmail: user.email,
        ...newMessage
      });
      
      setShowMessageModal(false);
      setNewMessage({ subject: '', message: '', category: 'general' });
      fetchPlayerData(user._id);
    } catch (error) {
      alert('Failed to send message');
    }
  };

  const handleLeaveTeam = async () => {
    if (!confirm('Are you sure you want to leave your current team?')) return;
    
    try {
      await axios.put(`http://localhost:8000/utf/player-users/${user._id}/leave-team`);
      
      // Update local user state
      const updatedUser = { ...user, currentTeam: null, status: 'available' };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      alert('Failed to leave team');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    router.push('/');
  };

  const pendingInvites = invitations.filter(i => i.status === 'pending');

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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-secondary to-purple-500 flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{user.fullName}</h1>
                <p className="text-text-muted">{user.proClubName}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 bg-surface-light border border-border rounded text-xs text-text-muted">
                    {user.preferredPosition}
                  </span>
                  <span className="px-2 py-0.5 bg-surface-light border border-border rounded text-xs text-text-muted">
                    {user.console}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-surface-light border border-border rounded-xl text-text-muted hover:text-white hover:border-red-500/50 transition-all"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Profile & Stats */}
            <div className="space-y-6">
              {/* Profile Card */}
              <div className="bg-surface border border-border rounded-2xl p-6">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Profile
                </h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-muted">Country</span>
                    <span className="text-white flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {user.country}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Preferred Foot</span>
                    <span className="text-white">{user.preferredFoot}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Age</span>
                    <span className="text-white">{user.age}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Status</span>
                    <span className={`${user.status === 'in_team' ? 'text-emerald-500' : 'text-amber-500'}`}>
                      {user.status === 'in_team' ? 'In Team' : 'Available'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Current Team */}
              {user.currentTeam && (
                <div className="bg-surface border border-border rounded-2xl p-6">
                  <h2 className="text-lg font-bold text-white mb-4">Current Team</h2>
                  <div className="flex items-center gap-3 mb-4">
                    {user.currentTeam.teamLogo && (
                      <img 
                        src={user.currentTeam.teamLogo} 
                        alt={user.currentTeam.teamName}
                        className="w-12 h-12 object-contain rounded-lg bg-surface-light p-1"
                      />
                    )}
                    <div>
                      <p className="font-semibold text-white">{user.currentTeam.teamName}</p>
                      <p className="text-xs text-text-muted">{user.currentTeam.managerName}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLeaveTeam}
                    className="w-full py-2 border border-red-500/50 text-red-500 rounded-lg hover:bg-red-500/10 transition-all text-sm"
                  >
                    Leave Team
                  </button>
                </div>
              )}

              {/* Quick Links */}
              <div className="bg-surface border border-border rounded-2xl p-6">
                <h2 className="text-lg font-bold text-white mb-4">Quick Links</h2>
                <div className="space-y-2">
                  <Link href="/fixtures" className="flex items-center justify-between p-3 bg-surface-light rounded-xl hover:border-primary/50 border border-transparent transition-all">
                    <div className="flex items-center gap-2 text-white">
                      <Gamepad2 className="w-4 h-4 text-primary" />
                      Fixtures
                    </div>
                    <ChevronRight className="w-4 h-4 text-text-muted" />
                  </Link>
                  <Link href="/table" className="flex items-center justify-between p-3 bg-surface-light rounded-xl hover:border-primary/50 border border-transparent transition-all">
                    <div className="flex items-center gap-2 text-white">
                      <Trophy className="w-4 h-4 text-amber-500" />
                      League Table
                    </div>
                    <ChevronRight className="w-4 h-4 text-text-muted" />
                  </Link>
                  <Link href="/players" className="flex items-center justify-between p-3 bg-surface-light rounded-xl hover:border-primary/50 border border-transparent transition-all">
                    <div className="flex items-center gap-2 text-white">
                      <Users className="w-4 h-4 text-emerald-500" />
                      League Leaders
                    </div>
                    <ChevronRight className="w-4 h-4 text-text-muted" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Middle Column - Invitations */}
            <div className="lg:col-span-2 space-y-6">
              {/* Pending Invitations */}
              <div className="bg-surface border border-border rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Bell className="w-5 h-5 text-primary" />
                    Team Invitations
                    {pendingInvites.length > 0 && (
                      <span className="px-2 py-0.5 bg-primary text-black text-xs rounded-full">
                        {pendingInvites.length}
                      </span>
                    )}
                  </h2>
                </div>

                {invitations.length === 0 ? (
                  <div className="text-center py-8">
                    <Bell className="w-10 h-10 text-text-muted mx-auto mb-3" />
                    <p className="text-text-muted">No invitations yet</p>
                    <p className="text-sm text-text-muted mt-1">
                      Teams will send you invitations here
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {invitations.map((invite) => (
                      <div 
                        key={invite._id}
                        className={`p-4 rounded-xl border ${
                          invite.status === 'pending'
                            ? 'bg-surface-light border-primary/30'
                            : invite.status === 'accepted'
                            ? 'bg-emerald-500/5 border-emerald-500/30'
                            : 'bg-surface-light border-border'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            {invite.managerId?.teamLogo && (
                              <img 
                                src={invite.managerId.teamLogo}
                                alt={invite.managerId.teamName}
                                className="w-10 h-10 object-contain rounded-lg bg-surface p-1"
                              />
                            )}
                            <div>
                              <p className="font-semibold text-white">{invite.managerId?.teamName || 'Unknown Team'}</p>
                              <p className="text-xs text-text-muted">
                                Sent {new Date(invite.sentAt).toLocaleDateString()}
                              </p>
                              {invite.message && (
                                <p className="text-sm text-text-muted mt-1 italic">
                                  &ldquo;{invite.message}&rdquo;
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {invite.status === 'pending' ? (
                              <>
                                <button
                                  onClick={() => setRespondingTo(invite)}
                                  className="px-3 py-1.5 bg-emerald-500/20 text-emerald-500 rounded-lg text-sm hover:bg-emerald-500/30 transition-all"
                                >
                                  Accept
                                </button>
                                <button
                                  onClick={() => handleRespondToInvite(invite._id, 'declined')}
                                  className="px-3 py-1.5 bg-red-500/20 text-red-500 rounded-lg text-sm hover:bg-red-500/30 transition-all"
                                >
                                  Decline
                                </button>
                              </>
                            ) : (
                              <span className={`flex items-center gap-1 text-sm ${
                                invite.status === 'accepted' ? 'text-emerald-500' : 'text-red-500'
                              }`}>
                                {invite.status === 'accepted' ? (
                                  <><CheckCircle className="w-4 h-4" /> Accepted</>
                                ) : (
                                  <><XCircle className="w-4 h-4" /> Declined</>
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Messages to Admin */}
              <div className="bg-surface border border-border rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Mail className="w-5 h-5 text-primary" />
                    Messages to League
                  </h2>
                  <button
                    onClick={() => setShowMessageModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-lg text-sm font-medium hover:shadow-glow transition-all"
                  >
                    <MessageSquare className="w-4 h-4" />
                    New Message
                  </button>
                </div>

                {messages.length === 0 ? (
                  <div className="text-center py-8">
                    <Mail className="w-10 h-10 text-text-muted mx-auto mb-3" />
                    <p className="text-text-muted">No messages sent yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {messages.slice(0, 5).map((msg) => (
                      <div 
                        key={msg._id}
                        className="p-4 bg-surface-light rounded-xl border border-border hover:border-primary/30 transition-all"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-white">{msg.subject}</p>
                            <p className="text-xs text-text-muted mt-1">
                              {msg.category.replace('_', ' ')} • {new Date(msg.createdAt).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-text-muted mt-2 line-clamp-2">{msg.message}</p>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs ${
                            msg.status === 'open' ? 'bg-amber-500/20 text-amber-500' :
                            msg.status === 'in_progress' ? 'bg-blue-500/20 text-blue-500' :
                            msg.status === 'resolved' ? 'bg-emerald-500/20 text-emerald-500' :
                            'bg-text-muted/20 text-text-muted'
                          }`}>
                            {msg.status.replace('_', ' ')}
                          </span>
                        </div>
                        {msg.replies?.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-border">
                            <p className="text-xs text-primary mb-1">Latest reply:</p>
                            <p className="text-sm text-text-muted">{msg.replies[msg.replies.length - 1].message}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Message Modal */}
        {showMessageModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-surface border border-border rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold text-white mb-4">Send Message to League</h3>
              <form onSubmit={handleSendMessage} className="space-y-4">
                <div>
                  <label className="block text-sm text-white mb-2">Category</label>
                  <select
                    value={newMessage.category}
                    onChange={(e) => setNewMessage({ ...newMessage, category: e.target.value })}
                    className="input-gaming input-gaming-iconless"
                  >
                    <option value="general">General</option>
                    <option value="complaint">Complaint</option>
                    <option value="suggestion">Suggestion</option>
                    <option value="bug_report">Bug Report</option>
                    <option value="appeal">Appeal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-white mb-2">Subject</label>
                  <input
                    type="text"
                    value={newMessage.subject}
                    onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
                    className="input-gaming input-gaming-iconless"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-white mb-2">Message</label>
                  <textarea
                    value={newMessage.message}
                    onChange={(e) => setNewMessage({ ...newMessage, message: e.target.value })}
                    className="input-gaming input-gaming-iconless min-h-[120px] resize-none"
                    required
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowMessageModal(false)}
                    className="flex-1 py-3 bg-surface-light border border-border rounded-xl text-white hover:bg-border transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-primary text-black font-semibold rounded-xl hover:shadow-glow transition-all"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Accept Invitation Modal */}
        {respondingTo && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-surface border border-border rounded-2xl p-6 w-full max-w-md">
              <h3 className="text-xl font-bold text-white mb-4">Accept Invitation</h3>
              <p className="text-text-muted mb-4">
                You are about to join <span className="text-white font-semibold">{respondingTo.managerId?.teamName}</span>.
                This will decline all other pending invitations.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setRespondingTo(null)}
                  className="flex-1 py-3 bg-surface-light border border-border rounded-xl text-white hover:bg-border transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleRespondToInvite(respondingTo._id, 'accepted')}
                  className="flex-1 py-3 bg-emerald-500 text-black font-semibold rounded-xl hover:shadow-glow transition-all"
                >
                  Confirm Join
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
