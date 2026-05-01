'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Trophy, Mail, Lock, ArrowRight, Loader2, User, Shield } from 'lucide-react';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [userType, setUserType] = useState('manager'); // 'manager', 'player', 'staff'
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let res;
      
      // Try login based on selected user type
      if (userType === 'manager') {
        res = await axios.post('http://localhost:8000/utf/auth/login/manager', form);
      } else if (userType === 'player') {
        res = await axios.post('http://localhost:8000/utf/player-users/login', form);
      } else {
        res = await axios.post('http://localhost:8000/utf/auth/login/staff', form);
      }

      if (res.status === 200) {
        const { data, token, userType: returnedType } = res.data;
        localStorage.setItem('user', JSON.stringify(data));
        localStorage.setItem('token', token);
        localStorage.setItem('userType', returnedType || userType);

        Swal.fire({
          title: 'Welcome Back!',
          text: `Logged in as ${data.teamName || data.fullName || data.name}`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          background: '#141419',
          color: '#fff',
        });

        // Redirect based on user type
        const type = returnedType || userType;
        if (type === 'manager') {
          router.push('/dashboard');
        } else if (type === 'player') {
          router.push('/player-dashboard');
        } else if (type === 'staff') {
          router.push('/dashboard');
        }
      }
    } catch (error) {
      // If first attempt fails, try other endpoints
      try {
        let res;
        if (userType !== 'manager') {
          res = await axios.post('http://localhost:8000/utf/auth/login/manager', form);
        } else {
          res = await axios.post('http://localhost:8000/utf/player-users/login', form);
        }
        
        if (res.status === 200) {
          const { data, token, userType: returnedType } = res.data;
          localStorage.setItem('user', JSON.stringify(data));
          localStorage.setItem('token', token);
          localStorage.setItem('userType', returnedType);

          Swal.fire({
            title: 'Welcome Back!',
            text: `Logged in as ${data.teamName || data.fullName || data.name}`,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false,
            background: '#141419',
            color: '#fff',
          });

          if (returnedType === 'manager') {
            router.push('/dashboard');
          } else if (returnedType === 'player') {
            router.push('/player-dashboard');
          }
          return;
        }
      } catch (fallbackError) {
        Swal.fire({
          title: 'Login Failed',
          text: 'Invalid credentials. Please try again.',
          icon: 'error',
          confirmButtonColor: '#00d4ff',
          confirmButtonText: 'Try Again',
          background: '#141419',
          color: '#fff',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background hero-bg flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-glow">
              <Trophy className="w-6 h-6 text-black" />
            </div>
            <span className="text-2xl font-orbitron font-bold gradient-text">UTF</span>
          </Link>
        </div>

        {/* Form Card */}
        <div className="bg-surface border border-border rounded-2xl p-8 shadow-card">
          <h1 className="text-2xl font-bold text-white text-center mb-2">Welcome Back</h1>
          <p className="text-text-muted text-center mb-6">Sign in to continue</p>

          {/* User Type Selector */}
          <div className="flex gap-2 mb-6 p-1 bg-surface-light rounded-xl">
            <button
              type="button"
              onClick={() => setUserType('manager')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                userType === 'manager'
                  ? 'bg-primary text-black'
                  : 'text-text-muted hover:text-white'
              }`}
            >
              <Shield className="w-4 h-4" />
              Manager
            </button>
            <button
              type="button"
              onClick={() => setUserType('player')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                userType === 'player'
                  ? 'bg-secondary text-white'
                  : 'text-text-muted hover:text-white'
              }`}
            >
              <User className="w-4 h-4" />
              Player
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                  className="input-gaming pl-12"
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
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                  className="input-gaming pl-12"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-4 bg-primary text-black font-semibold rounded-xl hover:shadow-glow-lg transition-all disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-text-muted text-sm">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-primary hover:underline">
                Join the league
              </Link>
            </p>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <Link href="/" className="text-text-muted hover:text-white transition-colors text-sm">
            ← Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
