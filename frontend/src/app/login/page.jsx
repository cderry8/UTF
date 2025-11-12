"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function Login() {
    const [form, setForm] = useState({
        email: '',
        password: '',
    });

    const router = useRouter();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post('http://localhost:8000/utf/auth/login/manager', form);

            if (res.status === 200) {
                const { data, token, userType } = res.data;
                localStorage.setItem('user', JSON.stringify(data));
                localStorage.setItem('token', token);

                // Redirect based on user type
                if (userType === 'manager') {
                    router.push('/');
                } else if (userType === 'staff') {
                    router.push('/staff-dashboard');
                }
            }
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: error.response?.data?.message || 'Login failed. Please try again.',
                icon: 'error',
                confirmButtonColor: '#d33',
                confirmButtonText: 'Close',
            });
        }
    };

    return (
        <section>
            <div className="flex justify-center min-h-screen bg-black/10">
                <div
                    className="lg:block lg:w-2/5 bg-cover"
                    style={{
                        backgroundImage: "url('https://i.pinimg.com/1200x/65/ca/b4/65cab48e55217b463c5fe1b97cb503cb.jpg')", // Replace with your image URL
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                ></div>

                <div className="flex items-center w-full max-w-3xl p-8 mx-auto lg:px-12 lg:w-3/5">
                    <div className="w-full text-black">
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 mt-8">
                            <div>
                                <label className="block mb-2 text-sm text-black">Email address</label>
                                <input
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    type="email"
                                    placeholder="youremail@example.com"
                                    className="block w-full px-5 py-3 mt-2 text-black placeholder-gray-400 bg-white border border-gray-300 rounded-lg focus:border-[rgb(0,155,207)] focus:ring-[rgb(0,155,207)] focus:outline-none focus:ring focus:ring-opacity-40"
                                />
                            </div>

                            <div>
                                <label className="block mb-2 text-sm text-black">Password</label>
                                <input
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    type="password"
                                    placeholder="Enter your password"
                                    className="block w-full px-5 py-3 mt-2 text-black placeholder-gray-400 bg-white border border-gray-300 rounded-lg focus:border-[rgb(0,155,207)] focus:ring-[rgb(0,155,207)] focus:outline-none focus:ring-opacity-40"
                                />
                            </div>

                            <button
                                type="submit"
                                className="flex items-center justify-between w-full px-6 py-3 text-sm tracking-wide text-white capitalize transition-colors duration-300 transform bg-[rgb(0,155,207)] rounded-lg hover:opacity-90 focus:outline-none focus:ring focus:ring-[rgb(0,155,207)] focus:ring-opacity-50"
                            >
                                <span>Log In</span>
                            </button>

                            <p className="text-sm text-center text-gray-600 mt-2">
                                Don&apos;t have an account?{' '}
                                <a href="/signup" className="text-[rgb(0,155,207)] hover:underline">
                                    Sign up here
                                </a>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
