'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaEye, FaCheck, FaTimes, FaTrash } from 'react-icons/fa';

const Home = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch users when the component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8000/utf/managers');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching managers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

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
        // Re-fetch users after deleting
        const response = await axios.get('http://localhost:8000/utf/managers');
        setUsers(response.data);
      }
    } catch (error) {
      Swal.fire('Error!', 'There was a problem deleting the manager.', 'error');
    }
  };

  // SweetAlert2 Edit Manager Status Function
  const updateManagerStatus = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:8000/utf/managers/status/${id}`, { status: newStatus });
      Swal.fire('Success!', `Manager status updated to ${newStatus}`, 'success');
      // Re-fetch users after updating status
      const response = await axios.get('http://localhost:8000/utf/managers');
      setUsers(response.data);
    } catch (error) {
      Swal.fire('Error!', 'There was a problem updating the manager status.', 'error');
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
      <h1 className="text-xl sm:text-2xl text-center font-bold mb-6">Managers</h1>

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
    </div>
  );
};

export default Home;
