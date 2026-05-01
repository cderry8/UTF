'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaEye, FaCheck, FaTimes, FaTrash, FaEnvelope, FaReply, FaFilter } from 'react-icons/fa';

const Home = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Messages state
  const [messages, setMessages] = useState([]);
  const [messageLoading, setMessageLoading] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [messageFilter, setMessageFilter] = useState('all'); // 'all', 'open', 'in_progress', 'resolved'
  const [activeTab, setActiveTab] = useState('managers'); // 'managers', 'messages'
  const [messageCounts, setMessageCounts] = useState({ open: 0, inProgress: 0, resolved: 0, urgent: 0 });

  // Fetch users when the component mounts
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [managersRes, messagesRes, countsRes] = await Promise.all([
        axios.get('http://localhost:8000/utf/managers'),
        axios.get('http://localhost:8000/utf/messages'),
        axios.get('http://localhost:8000/utf/messages/counts')
      ]);
      setUsers(managersRes.data);
      setMessages(messagesRes.data.messages || []);
      setMessageCounts(countsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    setMessageLoading(true);
    try {
      const params = messageFilter !== 'all' ? { status: messageFilter } : {};
      const res = await axios.get('http://localhost:8000/utf/messages', { params });
      setMessages(res.data.messages || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setMessageLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'messages') {
      fetchMessages();
    }
  }, [messageFilter, activeTab]);

  const openModal = (type, user) => {
    setSelectedUser(user);
    setModalType(type);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setModalType(null);
  };

  // SweetAlert2 Delete Manager Function
  const deleteManager = async (id) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'You will not be able to recover this manager!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!',
      });

      if (result.isConfirmed) {
        await axios.delete(`http://localhost:8000/utf/managers/${id}`);
        Swal.fire('Deleted!', 'The manager has been deleted.', 'success');
        fetchData();
      }
    } catch (error) {
      Swal.fire('Error!', 'There was a problem deleting the manager.', 'error');
    }
  };

  // Message management functions
  const updateMessageStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:8000/utf/messages/status/${id}`, { status });
      Swal.fire('Success!', `Message status updated to ${status}`, 'success');
      fetchMessages();
      // Refresh counts
      const countsRes = await axios.get('http://localhost:8000/utf/messages/counts');
      setMessageCounts(countsRes.data);
    } catch (error) {
      Swal.fire('Error!', 'There was a problem updating the message status.', 'error');
    }
  };

  const replyToMessage = async (messageId) => {
    if (!replyText.trim()) {
      Swal.fire('Error!', 'Please enter a reply message.', 'error');
      return;
    }

    try {
      // Get staff ID from localStorage (assuming staff is logged in)
      const staffData = JSON.parse(localStorage.getItem('user') || '{}');
      await axios.post(`http://localhost:8000/utf/messages/reply/${messageId}`, {
        staffId: staffData._id || staffData.id,
        message: replyText
      });
      Swal.fire('Success!', 'Reply sent successfully.', 'success');
      setReplyText('');
      setSelectedMessage(null);
      fetchMessages();
    } catch (error) {
      Swal.fire('Error!', 'There was a problem sending the reply.', 'error');
    }
  };

  // SweetAlert2 Edit Manager Status Function
  const updateManagerStatus = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:8000/utf/managers/status/${id}`, { status: newStatus });
      Swal.fire('Success!', `Manager status updated to ${newStatus}`, 'success');
      fetchData();
    } catch (error) {
      Swal.fire('Error!', 'There was a problem updating the manager status.', 'error');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'text-amber-500';
      case 'in_progress': return 'text-blue-500';
      case 'resolved': return 'text-green-500';
      case 'closed': return 'text-gray-500';
      default: return 'text-gray-500';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500/20 text-red-500';
      case 'high': return 'bg-orange-500/20 text-orange-500';
      case 'medium': return 'bg-blue-500/20 text-blue-500';
      case 'low': return 'bg-gray-500/20 text-gray-500';
      default: return 'bg-gray-500/20 text-gray-500';
    }
  };

  // Render skeleton loader while loading users
  const renderSkeletonRow = () => (
    <tr className="animate-pulse">
      {Array(12).fill().map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-gray-300 rounded w-full"></div>
        </td>
      ))}
    </tr>
  );

  return (
    <div className="p-4 sm:p-6">
      {/* Tab Navigation */}
      <div className="flex justify-center gap-2 mb-6">
        <button
          onClick={() => setActiveTab('managers')}
          className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
            activeTab === 'managers'
              ? 'bg-black text-white'
              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
        >
          <FaEye /> Managers ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
            activeTab === 'messages'
              ? 'bg-black text-white'
              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
        >
          <FaEnvelope /> Messages
          {messageCounts.open > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
              {messageCounts.open}
            </span>
          )}
        </button>
      </div>

      {/* Message Stats */}
      {activeTab === 'messages' && (
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-amber-500">{messageCounts.open}</p>
            <p className="text-sm text-gray-600">Open</p>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-blue-500">{messageCounts.inProgress}</p>
            <p className="text-sm text-gray-600">In Progress</p>
          </div>
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-green-500">{messageCounts.resolved}</p>
            <p className="text-sm text-gray-600">Resolved</p>
          </div>
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-red-500">{messageCounts.urgent}</p>
            <p className="text-sm text-gray-600">Urgent</p>
          </div>
        </div>
      )}

      {/* Filter for Messages */}
      {activeTab === 'messages' && (
        <div className="flex items-center gap-2 mb-4">
          <FaFilter className="text-gray-500" />
          <select
            value={messageFilter}
            onChange={(e) => setMessageFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg text-sm"
          >
            <option value="all">All Messages</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      )}

      {activeTab === 'managers' ? (
        <>
          <h1 className="text-xl sm:text-2xl text-center font-bold mb-6">Manager Applications</h1>
          <div className="overflow-x-auto rounded-lg shadow-md">
            <table className="min-w-[1000px] w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs  text-white uppercase bg-black">
                <tr>
                  <th className="px-4 py-3">Logo</th>
                  <th className="px-4 py-3">Manager</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Age</th>
                  <th className="px-4 py-3">Team</th>
                  <th className="px-4 py-3">Gender</th>
                  <th className="px-4 py-3">Country</th>
                  <th className="px-4 py-3">Console</th>
                  <th className="px-4 py-3">Social</th>
                  <th className="px-4 py-3">IP</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Joined</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading
                  ? Array.from({ length: 5 }).map((_, idx) => <React.Fragment key={idx}>{renderSkeletonRow()}</React.Fragment>)
                  : users.map((user) => (
                      <tr key={user._id} className=" text-white bg-black/60 ">
                        <td className="px-4 py-3">
                          <img src={user.teamLogo} alt="logo" className="w-10 h-10 object-contain rounded" />
                        </td>
                        <td className="px-4 py-3 font-medium text-white ">{user.managerName}</td>
                        <td className="px-4 py-3">{user.email}</td>
                        <td className="px-4 py-3">{user.managerAge}</td>
                        <td className="px-4 py-3">{user.teamName}</td>
                        <td className="px-4 py-3 capitalize">{user.gender}</td>
                        <td className="px-4 py-3">{user.country}</td>
                        <td className="px-4 py-3">{user.console}</td>
                        <td className="px-4 py-3">
                          <ul className="space-y-1">
                            {user.socialMedia?.map((media, index) => (
                              <li key={index}>
                                {media.platform}: <a href={media.link} target="_blank" rel="noreferrer" className="text-blue-500 underline">{media.link}</a>
                              </li>
                            ))}
                          </ul>
                        </td>
                        <td className="px-4 py-3 capitalize">{user.ipAddress}</td>
                    <td className="px-4 py-3 capitalize">{user.status}</td>
                    <td className="px-4 py-3">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 flex gap-3 items-center text-lg">
  {/* View */}
  <button
    onClick={() => openModal('view', user)}
    className="text-blue-500 hover:text-blue-700"
    title="View Manager"
  >
    <FaEye />
  </button>

  {/* Accept (only if pending) */}
  {user.status === 'pending' && (
    <button
      onClick={() => updateManagerStatus(user._id, 'accepted')}
      className="text-green-500 hover:text-green-700"
      title="Accept Manager"
    >
      <FaCheck />
    </button>
  )}

  {/* Reject (only if accepted) */}
  {user.status === 'accepted' && (
    <button
      onClick={() => updateManagerStatus(user._id, 'rejected')}
      className="text-yellow-500 hover:text-yellow-700"
      title="Reject Manager"
    >
      <FaTimes />
    </button>
  )}

  {/* Delete */}
  <button
    onClick={() => deleteManager(user._id)}
    className="text-red-500 hover:text-red-700"
    title="Delete Manager"
  >
    <FaTrash />
  </button>
</td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Viewing Manager Details */}
      {modalType === 'view' && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6 relative overflow-auto max-h-[80vh]">
            <button
              onClick={closeModal}
              className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl font-bold"
              aria-label="Close modal"
            >
              &times;
            </button>
            <h2 className="text-lg font-bold mb-4">Manager Details</h2>
            <img src={selectedUser.teamLogo} alt="Team Logo" className="w-20 h-20 mb-2 object-contain" />
            <p><strong>Name:</strong> {selectedUser.managerName}</p>
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <p><strong>Team Name:</strong> {selectedUser.teamName}</p>
            <p><strong>Age:</strong> {selectedUser.managerAge}</p>
            <p><strong>Gender:</strong> {selectedUser.gender}</p>
            <p><strong>Country:</strong> {selectedUser.country}</p>
            <p><strong>Console:</strong> {selectedUser.console}</p>
            <p><strong>Status:</strong> {selectedUser.status}</p>
            <p><strong>Social Media:</strong></p>
            <ul className="list-disc list-inside">
              {selectedUser.socialMedia?.map((media, idx) => (
                <li key={idx}>
                  {media.platform}: <a href={media.link} target="_blank" rel="noreferrer" className="text-blue-500 underline">{media.link}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      </>
      ) : null}

      {/* Messages Section */}
      {activeTab === 'messages' && (
        <>
          <h1 className="text-xl sm:text-2xl text-center font-bold mb-6">Messages & Complaints</h1>
          <div className="overflow-x-auto rounded-lg shadow-md">
            <table className="min-w-[800px] w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-white uppercase bg-black">
                <tr>
                  <th className="px-4 py-3">From</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Subject</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Priority</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {messageLoading
                  ? Array.from({ length: 5 }).map((_, idx) => <React.Fragment key={idx}>{renderSkeletonRow()}</React.Fragment>)
                  : messages.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                        No messages found
                      </td>
                    </tr>
                  ) : (
                    messages.map((msg) => (
                      <tr key={msg._id} className="text-white bg-black/60">
                        <td className="px-4 py-3">
                          <p className="font-medium">{msg.senderName}</p>
                          <p className="text-xs text-gray-400">{msg.senderEmail}</p>
                          <span className="text-xs text-gray-500">({msg.senderType})</span>
                        </td>
                        <td className="px-4 py-3 capitalize">{msg.senderType}</td>
                        <td className="px-4 py-3 max-w-xs">
                          <p className="font-medium truncate">{msg.subject}</p>
                          <p className="text-xs text-gray-400 truncate">{msg.message.substring(0, 50)}...</p>
                        </td>
                        <td className="px-4 py-3 capitalize">{msg.category.replace('_', ' ')}</td>
                        <td className={`px-4 py-3 capitalize ${getStatusColor(msg.status)}`}>
                          {msg.status.replace('_', ' ')}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(msg.priority)}`}>
                            {msg.priority}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {new Date(msg.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 flex gap-2 items-center text-lg">
                          {/* View/Reply */}
                          <button
                            onClick={() => setSelectedMessage(msg)}
                            className="text-blue-500 hover:text-blue-700"
                            title="View & Reply"
                          >
                            <FaReply />
                          </button>
                          {/* Status Actions */}
                          {msg.status === 'open' && (
                            <button
                              onClick={() => updateMessageStatus(msg._id, 'in_progress')}
                              className="text-yellow-500 hover:text-yellow-700"
                              title="Mark In Progress"
                            >
                              <FaCheck />
                            </button>
                          )}
                          {msg.status !== 'resolved' && msg.status !== 'closed' && (
                            <button
                              onClick={() => updateMessageStatus(msg._id, 'resolved')}
                              className="text-green-500 hover:text-green-700"
                              title="Mark Resolved"
                            >
                              <FaCheck />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
              </tbody>
            </table>
          </div>

          {/* Message Detail/Reply Modal */}
          {selectedMessage && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
              <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg p-6 relative overflow-auto max-h-[90vh]">
                <button
                  onClick={() => { setSelectedMessage(null); setReplyText(''); }}
                  className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl font-bold"
                  aria-label="Close modal"
                >
                  &times;
                </button>
                <h2 className="text-lg font-bold mb-4">Message Details</h2>
                
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold">{selectedMessage.senderName}</p>
                      <p className="text-sm text-gray-500">{selectedMessage.senderEmail}</p>
                      <span className="text-xs text-gray-400">({selectedMessage.senderType})</span>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(selectedMessage.priority)}`}>
                      {selectedMessage.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">
                    {selectedMessage.category.replace('_', ' ')} • {new Date(selectedMessage.createdAt).toLocaleString()}
                  </p>
                  <p className="font-medium mb-2">{selectedMessage.subject}</p>
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>

                {/* Previous Replies */}
                {selectedMessage.replies?.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-semibold mb-2">Previous Replies:</h3>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {selectedMessage.replies.map((reply, idx) => (
                        <div key={idx} className="p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm font-medium text-blue-800">{reply.staffName}</p>
                          <p className="text-xs text-blue-600">{new Date(reply.createdAt).toLocaleString()}</p>
                          <p className="text-gray-700 mt-1">{reply.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reply Form */}
                {selectedMessage.status !== 'resolved' && selectedMessage.status !== 'closed' && (
                  <div className="mt-4">
                    <h3 className="font-semibold mb-2">Send Reply:</h3>
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type your reply..."
                      className="w-full p-3 border rounded-lg min-h-[100px] resize-none"
                    />
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => replyToMessage(selectedMessage._id)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                      >
                        Send Reply
                      </button>
                      <button
                        onClick={() => updateMessageStatus(selectedMessage._id, 'resolved')}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                      >
                        Resolve & Close
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
