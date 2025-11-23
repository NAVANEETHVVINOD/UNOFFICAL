"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Container from '../../components/ui/Container';
import { NewspaperCard, RetroButton, Tape } from '../../components/ui/NewspaperUI';
import Doodle from '../../components/ui/Doodle';
import { PageTransition } from '../../providers/AnimationProvider';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

export default function RegisterPage() {
  const { register, isAuthenticated } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      await register(formData.email, formData.password, fullName);
      // Redirect happens automatically in AuthContext
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSocialLogin = (provider: string) => {
    alert(`${provider} Login is currently disabled. Backend credentials required.`);
  };

  return (
    <PageTransition>
      <div className="min-h-screen w-full bg-[#f0f0f0] relative overflow-hidden">
        {/* Background Doodles */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-50">
          <div className="absolute top-20 left-20 animate-float-slow">
            <Doodle src="/doodles/megaphone.svg" className="w-32 opacity-20" />
          </div>
          <div className="absolute bottom-10 right-20 animate-float-delayed">
            <Doodle src="/doodles/group.svg" className="w-40 opacity-20" />
          </div>
          <div className="absolute top-1/3 left-1/3 rotate-45">
            <Doodle src="/doodles/sparkle.svg" className="w-12 h-12 opacity-30" />
          </div>
        </div>

        <Container>
          <div className="min-h-screen flex flex-col items-center justify-center py-12 relative z-10">

            {/* Logo */}
            <Link href="/" className="mb-8 transform hover:scale-105 transition-transform">
              <div className="flex items-center gap-2 transform -rotate-2">
                <div className="w-12 h-12 bg-accent-yellow border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center text-black font-black text-2xl font-display">L</div>
                <span className="font-display font-black text-3xl tracking-wide text-black drop-shadow-[2px_2px_0px_rgba(0,0,0,0.2)]">LINKER</span>
              </div>
            </Link>

            <div className="w-full max-w-md relative">
              {/* Decorative Elements */}
              <div className="absolute -left-12 top-1/2 hidden md:block z-20">
                <Doodle src="/doodles/megaphone.svg" className="w-24 h-24 transform -rotate-12 drop-shadow-lg" />
              </div>
              <div className="absolute -right-8 bottom-20 hidden md:block z-20">
                <Doodle src="/doodles/check-mark.svg" className="w-16 h-16 transform rotate-12" />
              </div>

              <Tape className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20" />

              <NewspaperCard className="border-4 p-8 relative bg-yellow-50 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <h1 className="h1-display text-center mb-2 text-4xl">JOIN US</h1>
                <p className="text-center font-hand text-gray-600 mb-8 text-lg">Become a part of the chaos.</p>

                {error && (
                  <div className="mb-4 p-3 bg-red-100 border-2 border-red-500 text-red-700 font-body text-sm flex items-center gap-2">
                    <span className="font-bold">ERROR:</span> {error}
                  </div>
                )}

                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-sm uppercase mb-2">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="w-full border-2 border-black p-3 font-body focus:outline-none focus:ring-4 focus:ring-accent-blue/50 bg-white transition-all"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-sm uppercase mb-2">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="w-full border-2 border-black p-3 font-body focus:outline-none focus:ring-4 focus:ring-accent-blue/50 bg-white transition-all"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-sm uppercase mb-2">College Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full border-2 border-black p-3 font-body focus:outline-none focus:ring-4 focus:ring-accent-blue/50 bg-white transition-all"
                      placeholder="you@college.edu"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-sm uppercase mb-2">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength={6}
                      className="w-full border-2 border-black p-3 font-body focus:outline-none focus:ring-4 focus:ring-accent-blue/50 bg-white transition-all"
                      placeholder="••••••••"
                    />
                    <p className="text-xs text-gray-500 mt-1 font-bold">MINIMUM 6 CHARACTERS</p>
                  </div>

                  <RetroButton
                    type="submit"
                    className="w-full py-4 text-xl bg-black text-white hover:bg-gray-900 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.5)] transition-all"
                    disabled={loading}
                  >
                    {loading ? 'CREATING ACCOUNT...' : 'PRINT ID CARD'}
                  </RetroButton>
                </form>

                <div className="mt-8">
                  <div className="relative flex py-5 items-center">
                    <div className="flex-grow border-t-2 border-gray-300"></div>
                    <span className="flex-shrink-0 mx-4 text-gray-400 text-sm font-bold uppercase tracking-widest">Or sign up with</span>
                    <div className="flex-grow border-t-2 border-gray-300"></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => handleSocialLogin('Google')} className="flex items-center justify-center gap-2 border-2 border-black p-3 hover:bg-gray-50 transition-all hover:-translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-white">
                      <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" className="text-[#4285F4]" /><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" className="text-[#34A853]" /><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" className="text-[#FBBC05]" /><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" className="text-[#EA4335]" /></svg>
                      <span className="font-bold text-sm">Google</span>
                    </button>
                    <button onClick={() => handleSocialLogin('GitHub')} className="flex items-center justify-center gap-2 border-2 border-black p-3 hover:bg-gray-50 transition-all hover:-translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-white">
                      <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                      <span className="font-bold text-sm">GitHub</span>
                    </button>
                  </div>
                </div>

                <div className="mt-8 text-center border-t-2 border-black pt-6 border-dashed">
                  <p className="font-body text-sm">
                    Already have an ID? <Link href="/login" className="font-bold underline decoration-2 decoration-accent-yellow underline-offset-2 hover:text-accent-blue hover:decoration-accent-blue transition-all">Login here.</Link>
                  </p>
                </div>
              </NewspaperCard>
            </div>
          </div>
        </Container>
      </div>
    </PageTransition>
  );
}