"use client"

import { useState } from 'react';
import Container from '../../components/ui/Container';
import { NewspaperCard, RetroButton, Tape } from '../../components/ui/NewspaperUI';
import Doodle from '../../components/ui/Doodle';
import { PageTransition } from '../../providers/AnimationProvider';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

  return (
    <PageTransition>
      <Container>
        <div className="min-h-screen flex items-center justify-center py-12">
          <div className="w-full max-w-md relative">
            <Tape className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10" />
            <NewspaperCard className="border-4 p-8 relative bg-yellow-50">
              <div className="absolute -left-10 top-1/2 hidden md:block">
                <Doodle src="/doodles/megaphone.svg" className="w-20 h-20 transform -rotate-12" />
              </div>

              <h1 className="h1-display text-center mb-2">JOIN US</h1>
              <p className="text-center font-hand text-gray-600 mb-8">Become a part of the chaos.</p>

              {error && (
                <div className="mb-4 p-3 bg-red-100 border-2 border-red-500 text-red-700 font-body text-sm">
                  {error}
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
                      className="w-full border-2 border-black p-3 font-body focus:outline-none focus:ring-4 focus:ring-accent-blue/50 bg-white"
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
                      className="w-full border-2 border-black p-3 font-body focus:outline-none focus:ring-4 focus:ring-accent-blue/50 bg-white"
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
                    className="w-full border-2 border-black p-3 font-body focus:outline-none focus:ring-4 focus:ring-accent-blue/50 bg-white"
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
                    className="w-full border-2 border-black p-3 font-body focus:outline-none focus:ring-4 focus:ring-accent-blue/50 bg-white"
                    placeholder="••••••••"
                  />
                  <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
                </div>

                <RetroButton
                  type="submit"
                  className="w-full py-3 text-lg bg-black text-white hover:bg-gray-900"
                  disabled={loading}
                >
                  {loading ? 'CREATING ACCOUNT...' : 'PRINT ID CARD'}
                </RetroButton>
              </form>

              <div className="mt-6 text-center border-t-2 border-black pt-4 border-dashed">
                <p className="font-body text-sm">
                  Already have an ID? <Link href="/login" className="font-bold underline hover:text-accent-blue">Login here.</Link>
                </p>
              </div>
            </NewspaperCard>
          </div>
        </div>
      </Container>
    </PageTransition>
  );
}