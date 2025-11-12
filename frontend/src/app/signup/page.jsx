'use client';

import { useState } from 'react';
import Head from 'next/head';
import axios from 'axios';
import Swal from 'sweetalert2';
import Link from 'next/link';


export default function Signup() {
    const [form, setForm] = useState({
        managerName: '',
        teamName: '',
        teamLogo: '',
        managerAge: '',
        gender: '',
        country: '',
        console: '',
        email: '',
        password: '',
        socialMediaCount: 0,  // New state for social media count
        socialMediaLinks: []  // New state for social media links
    });

    // Function to fetch the real public IP address
    const getUserIp = async () => {
        try {
            const res = await fetch('https://api.ipify.org?format=json'); // ipify API for public IP
            const data = await res.json();
            return data.ip;
        } catch (error) {
            console.error("Failed to get IP address", error);
            return "Unknown IP"; // In case of failure, fallback to a default IP
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Handle change for social media links
    const handleSocialMediaChange = (index, e) => {
        const newSocialMediaLinks = [...form.socialMediaLinks];
        newSocialMediaLinks[index] = { platform: e.target.name, link: e.target.value };
        setForm({ ...form, socialMediaLinks: newSocialMediaLinks });
    };

    // Handle social media count change
    const handleSocialMediaCountChange = (e) => {
        // Parse the input and ensure it's a valid positive integer
        const count = parseInt(e.target.value, 10);

        // Ensure that count is a non-negative integer
        if (Number.isNaN(count) || count < 0) {
            setForm({ ...form, socialMediaCount: 0, socialMediaLinks: [] });
        } else {
            // Set the form with the valid count and an array with the corresponding length
            setForm({
                ...form,
                socialMediaCount: count,
                socialMediaLinks: new Array(count).fill({ platform: '', link: '' })
            });
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Fetch the real IP address
            const ipAddress = await getUserIp();

            // Add the IP address to the form data
            const formData = { ...form, ipAddress };

            // Send the form data to the backend
            const res = await axios.post('http://localhost:8000/utf/managers/request', formData);

            if (res.status === 201) {
                Swal.fire({
                    title: 'Application Submitted!',
                    text: 'Thank you for signing up to be a team manager. Your application has been received and is currently under review. You will receive an update via email once a decision has been made. Please allow 1–3 business days for processing.',
                    icon: 'success',
                    confirmButtonColor: '#009BCF',
                    confirmButtonText: 'Got it!',
                });

                // Save user info in localStorage
                localStorage.setItem('utf_user', JSON.stringify(res.data.data));

                // Optional: reset form after submission
                setForm({
                    managerName: '',
                    teamName: '',
                    teamLogo: '',
                    managerAge: '',
                    gender: '',
                    country: '',
                    console: '',
                    email: '',
                    password: '',
                    socialMediaCount: 0,
                    socialMediaLinks: []
                });
            }
        } catch (error) {
            const message = error.response?.data?.error || 'Signup failed. Please try again.';
            Swal.fire({
                title: 'Error',
                text: message,
                icon: 'error',
                confirmButtonColor: '#d33',
                confirmButtonText: 'Close',
            });
        }
    };

    return (
        <>
            <Head>
                <title>Sign Up</title>
                <meta name="description" content="Sign up to access your account" />
            </Head>

            <section>
                <div className="flex bg-black/10 justify-center min-h-screen">
                    <div
                        className="hidden bg-cover lg:block lg:w-2/5"
                        style={{
                            backgroundImage: "url('https://i.pinimg.com/1200x/65/ca/b4/65cab48e55217b463c5fe1b97cb503cb.jpg')",
                            backgroundSize: 'cover',        // Ensures the image covers the area
                            backgroundPosition: 'center',    // Centers the image
                        }}
                    ></div>

                    <div className="flex items-center w-full max-w-3xl p-8 mx-auto lg:px-12 lg:w-3/5">
                        <div className="w-full text-black">
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2">
                                {/* Existing fields */}
                                <div>
                                    <label className="block mb-2 text-sm text-black">Manager Name</label>
                                    <input name="managerName" value={form.managerName} onChange={handleChange} type="text" placeholder="John" className="block w-full px-5 py-3 mt-2 text-black placeholder-gray-400 bg-white border border-gray-300 rounded-lg focus:border-[rgb(0,155,207)] focus:ring-[rgb(0,155,207)] focus:outline-none focus:ring focus:ring-opacity-40" />
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm text-black">Team Name</label>
                                    <input name="teamName" value={form.teamName} onChange={handleChange} type="text" placeholder="Snow Wolves" className="block w-full px-5 py-3 mt-2 text-black placeholder-gray-400 bg-white border border-gray-300 rounded-lg focus:border-[rgb(0,155,207)] focus:ring-[rgb(0,155,207)] focus:outline-none focus:ring focus:ring-opacity-40" />
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm text-black">Password</label>
                                    <input name="password" value={form.password} onChange={handleChange} type="password" placeholder="Enter your password" className="block w-full px-5 py-3 mt-2 text-black bg-white border border-gray-300 rounded-lg focus:border-[rgb(0,155,207)] focus:ring-[rgb(0,155,207)] focus:outline-none focus:ring-opacity-40" />
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm text-black">Manager Age</label>
                                    <input name="managerAge" value={form.managerAge} onChange={handleChange} type="number" min="10" className="block w-full px-5 py-3 mt-2 text-black bg-white border border-gray-300 rounded-lg focus:border-[rgb(0,155,207)] focus:ring-[rgb(0,155,207)] focus:outline-none focus:ring-opacity-40" />
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm text-black">Gender</label>
                                    <select name="gender" value={form.gender} onChange={handleChange} className="block w-full px-5 py-3 mt-2 bg-white border border-gray-300 rounded-lg text-black focus:border-[rgb(0,155,207)] focus:ring-[rgb(0,155,207)] focus:outline-none focus:ring-opacity-40">
                                        <option value="">Select Gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm text-black">Country</label>
                                    <input name="country" value={form.country} onChange={handleChange} type="text" placeholder="Country" className="block w-full px-5 py-3 mt-2 text-black bg-white border border-gray-300 rounded-lg focus:border-[rgb(0,155,207)] focus:ring-[rgb(0,155,207)] focus:outline-none focus:ring-opacity-40" />
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm text-black">Console</label>
                                    <select name="console" value={form.console} onChange={handleChange} className="block w-full px-5 py-3 mt-2 bg-white border border-gray-300 rounded-lg text-black focus:border-[rgb(0,155,207)] focus:ring-[rgb(0,155,207)] focus:outline-none focus:ring-opacity-40">
                                        <option value="">Select Console</option>
                                        <option value="PS5">PS5</option>
                                        <option value="Xbox">Xbox</option>
                                        <option value="PC">PC</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm text-black">Email address</label>
                                    <input name="email" value={form.email} onChange={handleChange} type="email" placeholder="johnsnow@example.com" className="block w-full px-5 py-3 mt-2 text-black placeholder-gray-400 bg-white border border-gray-300 rounded-lg focus:border-[rgb(0,155,207)] focus:ring-[rgb(0,155,207)] focus:outline-none focus:ring-opacity-40" />
                                </div>

                                <div className="w-full md:col-span-2">
                                    <label className="block mb-2 text-sm text-black">Team Logo</label>
                                    <div
                                        onClick={() => document.getElementById('logoUpload').click()}
                                        className="flex items-center justify-center w-full h-48 mt-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-white hover:border-[rgb(0,155,207)] transition"
                                    >
                                        {form.teamLogo ? (
                                            <img
                                                src={form.teamLogo}
                                                alt="Team Logo"
                                                className="object-contain h-full"
                                            />
                                        ) : (
                                            <span className="text-gray-500">Click to upload team logo</span>
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
                                                    setForm((prev) => ({ ...prev, teamLogo: reader.result }));
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                        className="hidden"
                                    />
                                </div>

                                {/* Social Media Input Fields */}
                                <div>
                                    <label className="block mb-2 text-sm text-black">How many Social Media links would you like to provide?</label>
                                    <input
                                        type="text"
                                        name="socialMediaCount"
                                        value={form.socialMediaCount}
                                        onChange={handleSocialMediaCountChange}

                                        className="block w-full px-5 py-3 mt-2 text-black bg-white border border-gray-300 rounded-lg focus:border-[rgb(0,155,207)] focus:ring-[rgb(0,155,207)] focus:outline-none focus:ring-opacity-40"
                                    />
                                </div>

                                {Array.from({ length: form.socialMediaCount }).map((_, index) => (
                                    <div key={index} className="w-full md:col-span-2">
                                        <label className="block mb-2 text-sm text-black">Social Media {index + 1}</label>
                                        <input
                                            type="text"
                                            name="platform"
                                            placeholder="Platform Name"
                                            value={form.socialMediaLinks[index]?.platform || ''}
                                            onChange={(e) => handleSocialMediaChange(index, e)}
                                            className="block w-full px-5 py-3 mt-2 text-black bg-white border border-gray-300 rounded-lg focus:border-[rgb(0,155,207)] focus:ring-[rgb(0,155,207)] focus:outline-none focus:ring-opacity-40"
                                        />
                                        <input
                                            type="url"
                                            name="link"
                                            placeholder="Link"
                                            value={form.socialMediaLinks[index]?.link || ''}
                                            onChange={(e) => handleSocialMediaChange(index, e)}
                                            className="block w-full px-5 py-3 mt-2 text-black bg-white border border-gray-300 rounded-lg focus:border-[rgb(0,155,207)] focus:ring-[rgb(0,155,207)] focus:outline-none focus:ring-opacity-40"
                                        />
                                    </div>
                                ))}

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="flex items-center justify-between w-full px-6 py-3 text-sm tracking-wide text-white capitalize transition-colors duration-300 transform bg-[rgb(0,155,207)] rounded-lg hover:opacity-90 focus:outline-none focus:ring focus:ring-[rgb(0,155,207)] focus:ring-opacity-50 md:col-span-2"
                                >
                                    <span>Sign Up</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 rtl:-scale-x-100" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                </button>
                                <p className="text-sm text-center text-gray-600 md:col-span-2 mt-2">
    Already have an account?{' '}
    <Link href="/login" className="text-[rgb(0,155,207)] hover:underline">
        Log in here
    </Link>
</p>

                                
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
