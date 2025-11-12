"use client"
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'

const StaffPage = () => {
  const [staffList, setStaffList] = useState([])
  const [form, setForm] = useState({ name: '', role: '', work: '', socialLinks: [''] })
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchStaff = async () => {
    setLoading(true)
    try {
      const { data } = await axios.get('http://localhost:8000/utf/staff')
      setStaffList(data)
    } catch (err) {
      console.error('Error fetching staff:', err)
      Swal.fire('Error', 'Failed to fetch staff members', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStaff()
  }, [])

  const handleChange = (e, idx) => {
    const { name, value } = e.target
    if (name === 'socialLinks') {
      const links = [...form.socialLinks]
      links[idx] = value
      setForm({ ...form, socialLinks: links })
    } else {
      setForm({ ...form, [name]: value })
    }
  }

  const addLinkField = () => setForm({ ...form, socialLinks: [...form.socialLinks, ''] })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await axios.put(`http://localhost:8000/utf/staff/${editingId}`, form)
        Swal.fire('Success', 'Staff member updated successfully', 'success')
      } else {
        await axios.post('http://localhost:8000/utf/staff', form)
        Swal.fire('Success', 'Staff member added successfully', 'success')
      }
      setForm({ name: '', role: '', work: '', socialLinks: [''] })
      setEditingId(null)
      fetchStaff()
    } catch (err) {
      console.error('Error submitting form:', err)
      Swal.fire('Error', 'Failed to submit staff form', 'error')
    }
  }

  const handleEdit = (staff) => {
    setForm({ ...staff })
    setEditingId(staff._id)
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/utf/staff/${id}`)
      Swal.fire('Deleted!', 'Staff member has been deleted.', 'success')
      fetchStaff()
    } catch (err) {
      console.error('Error deleting staff:', err)
      Swal.fire('Error', 'Failed to delete staff member', 'error')
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Add a Staff Member</h2>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white shadow p-4 rounded-md">
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Staff Name"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="role"
          value={form.role}
          onChange={handleChange}
          placeholder="Role"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="work"
          value={form.work}
          onChange={handleChange}
          placeholder="Work Description"
          className="w-full p-2 border rounded"
          required
        />

        <label className="block font-medium">Social Media Links</label>
        {form.socialLinks.map((link, idx) => (
          <input
            key={idx}
            type="url"
            name="socialLinks"
            value={link}
            onChange={(e) => handleChange(e, idx)}
            placeholder="https://..."
            className="w-full p-2 border rounded mt-1"
          />
        ))}
        <button type="button" onClick={addLinkField} className="text-blue-500">
          + Add another link
        </button>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {editingId ? 'Update Staff Member' : 'Add Staff Member'}
        </button>
      </form>

      <h2 className="text-xl font-bold mt-10 mb-4">Staff Members</h2>
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid gap-4">
          {staffList.map((staff) => (
            <div
  key={staff._id}
  className="bg-[rgb(0,155,207)] text-white rounded-lg shadow-md p-5 flex flex-col justify-between"
>
  <div>
    <h4 className="text-xl font-bold mb-1">{staff.role} - {staff.name}</h4>
    <p className="text-sm mb-3">{staff.work}</p>

    {staff.socialLinks.length > 0 && (
      <div className="flex flex-wrap gap-2 mt-2">
        {staff.socialLinks.map((link, idx) => (
          <a
            key={idx}
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-blue-700 px-2 py-1 rounded-full text-xs font-medium hover:underline transition-all"
          >
            Social {idx + 1}
          </a>
        ))}
      </div>
    )}
  </div>

  <div className="mt-4 flex gap-2">
    <button
      onClick={() => handleEdit(staff)}
      className="flex-1 bg-white text-blue-700 py-1.5 rounded hover:bg-gray-100 transition"
    >
      Edit
    </button>
    <button
      onClick={() => handleDelete(staff._id)}
      className="flex-1 bg-red-600 text-white py-1.5 rounded hover:bg-red-700 transition"
    >
      Delete
    </button>
  </div>
</div>

          ))}
        </div>
      )}
    </div>
  )
}

export default StaffPage
