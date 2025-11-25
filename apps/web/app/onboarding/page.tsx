"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../../lib/api';
import { useAuth } from '../context/AuthContext';
import Container from '../components/ui/Container';
import { NewspaperCard, RetroButton, Badge, Tape } from '../components/ui/NewspaperUI';
import Doodle from '../components/ui/Doodle';
import { logEvent } from '../../lib/analytics';

// Steps
// 1. Identity (Avatar + Name)
// 2. Vibe (Bio)
// 3. Socials
// 4. Interests
// 5. Campus
// 6. Review

const STEPS = [
    { id: 'identity', title: 'WHO ARE YOU?', subtitle: "Let's see that face." },
    { id: 'vibe', title: 'VIBE CHECK', subtitle: 'Tell us your story.' },
    { id: 'socials', title: 'PLUG YOURSELF', subtitle: 'Where can we stalk you?' },
    { id: 'interests', title: 'YOUR POISON', subtitle: 'What keeps you awake?' },
    { id: 'campus', title: 'YOUR TURF', subtitle: 'Where do you belong?' },
    { id: 'review', title: 'LAST CHANCE', subtitle: 'Ready to enter the void?' },
];

export default function OnboardingPage() {
    const router = useRouter();
    const { user, refreshUser, loading: authLoading } = useAuth();
    const [currentStep, setCurrentStep] = useState(0);

    // Auth Check
    useEffect(() => {
        if (!authLoading && !user) {
            router.replace('/auth/login');
        }
    }, [user, authLoading, router]);

    // Safety check
    const step = STEPS[currentStep];
    if (!step && currentStep > 0) {
        // Fallback if step is out of bounds
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }
    const [loading, setLoading] = useState(false);
    const [colleges, setColleges] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        fullName: '',
        avatarUrl: '',
        bio: '',
        githubUrl: '',
        instagram: '',
        interests: [] as string[],
        collegeId: '',
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [isCustomCollege, setIsCustomCollege] = useState(false);
    const [customCollegeData, setCustomCollegeData] = useState({ name: '', city: '' });

    // Analytics: Duration Tracking
    const startTimeRef = useRef<number>(Date.now());

    const fetchColleges = async () => {
        try {
            const data = await api.getColleges();
            setColleges(data);
        } catch (error) {
            console.error('Failed to fetch colleges', error);
        }
    };

    useEffect(() => {
        const profile = user?.profile;
        if (profile) {
            setFormData(prev => ({
                ...prev,
                fullName: profile.fullName || '',
                avatarUrl: profile.avatarUrl || '',
                bio: profile.bio || '',
                githubUrl: profile.githubUrl || '',
                instagram: profile.instagram || '',
                interests: profile.interests || [],
                collegeId: profile.collegeId || '',
            }));
            if (profile.onboardingStep) {
                setCurrentStep(profile.onboardingStep);
            }
        }
        fetchColleges();
    }, [user]);

    // Analytics: Step View & Drop-off
    useEffect(() => {
        logEvent('onboarding_step_viewed', { step: currentStep, stepName: STEPS[currentStep].id });

        const handleUnload = () => {
            logEvent('onboarding_abandoned_step', { step: currentStep, stepName: STEPS[currentStep].id });
        };

        window.addEventListener('beforeunload', handleUnload);
        return () => {
            window.removeEventListener('beforeunload', handleUnload);
        };
    }, [currentStep]);

    const validateStep = () => {
        switch (currentStep) {
            case 0: // Identity
                return !!formData.fullName.trim();
            case 1: // Vibe
                return !!formData.bio.trim();
            case 4: // Campus
                if (isCustomCollege) return !!customCollegeData.name.trim();
                return !!formData.collegeId;
            default:
                return true;
        }
    };

    const handleNext = async () => {
        if (!validateStep()) {
            // Shake effect or toast could be added here
            alert('Please fill in the required fields.');
            return;
        }

        setLoading(true);
        try {
            const stepData: any = { onboardingStep: currentStep + 1 };

            // Add current step data to update
            if (currentStep === 0) { // Identity
                stepData.fullName = formData.fullName;
                stepData.avatarUrl = formData.avatarUrl;
            } else if (currentStep === 1) { // Vibe
                stepData.bio = formData.bio;
            } else if (currentStep === 2) { // Socials
                stepData.githubUrl = formData.githubUrl;
                stepData.instagram = formData.instagram;
            } else if (currentStep === 3) { // Interests
                stepData.interests = formData.interests;
            } else if (currentStep === 4) { // Campus
                stepData.collegeId = formData.collegeId || null;
            } else if (currentStep === 5) { // Review
                stepData.isOnboarded = true;
            }

            await api.updateProfile(stepData);
            await refreshUser();

            logEvent('onboarding_step_completed', { step: currentStep, stepName: STEPS[currentStep].id });

            if (currentStep === STEPS.length - 1) {
                const duration = Date.now() - startTimeRef.current;
                logEvent('onboarding_completed', { duration_ms: duration });
                router.push('/dashboard');
            } else {
                setCurrentStep(prev => prev + 1);
            }
        } catch (error) {
            console.error('Failed to update profile', error);
            // Show error toast
        } finally {
            setLoading(false);
        }
    };

    // Keyboard Navigation - Placed AFTER handleNext definition
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Enter' && !loading) {
                handleNext();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentStep, loading, formData, handleNext]);

    const handleBack = () => {
        if (currentStep > 0) setCurrentStep(prev => prev - 1);
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 0: // Identity
                return (
                    <div className="space-y-6">
                        <div>
                            <label className="block font-bold mb-2 uppercase text-sm tracking-wider">Full Name <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                className="w-full p-3 border-2 border-black bg-gray-50 focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none transition-all"
                                placeholder="John Doe"
                                autoFocus
                            />
                        </div>
                        <div>
                            <label className="block font-bold mb-2 uppercase text-sm tracking-wider">Avatar URL (Optional)</label>
                            <input
                                type="text"
                                value={formData.avatarUrl}
                                onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                                className="w-full p-3 border-2 border-black bg-gray-50 focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none transition-all"
                                placeholder="https://..."
                            />
                        </div>
                    </div>
                );
            case 1: // Vibe
                return (
                    <div>
                        <label className="block font-bold mb-2 uppercase text-sm tracking-wider">Bio <span className="text-red-500">*</span></label>
                        <textarea
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            className="w-full p-3 border-2 border-black bg-gray-50 focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none transition-all h-32"
                            placeholder="I code, I coffee, I conquer..."
                            autoFocus
                        />
                    </div>
                );
            case 2: // Socials
                return (
                    <div className="space-y-6">
                        <div>
                            <label className="block font-bold mb-2 uppercase text-sm tracking-wider">GitHub URL</label>
                            <input
                                type="text"
                                value={formData.githubUrl}
                                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                                className="w-full p-3 border-2 border-black bg-gray-50 focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none transition-all"
                                placeholder="https://github.com/..."
                                autoFocus
                            />
                        </div>
                        <div>
                            <label className="block font-bold mb-2 uppercase text-sm tracking-wider">Instagram URL</label>
                            <input
                                type="text"
                                value={formData.instagram}
                                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                                className="w-full p-3 border-2 border-black bg-gray-50 focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none transition-all"
                                placeholder="https://instagram.com/..."
                            />
                        </div>
                    </div>
                );
            case 3: // Interests
                const INTERESTS = ['Coding', 'Design', 'Music', 'Sports', 'Gaming', 'Reading', 'Travel', 'Food', 'Art', 'Tech'];
                return (
                    <div className="grid grid-cols-2 gap-4">
                        {INTERESTS.map(interest => (
                            <button
                                key={interest}
                                onClick={() => {
                                    const newInterests = formData.interests.includes(interest)
                                        ? formData.interests.filter(i => i !== interest)
                                        : [...formData.interests, interest];
                                    setFormData({ ...formData, interests: newInterests });
                                }}
                                className={`p-3 border-2 border-black font-bold transition-all ${formData.interests.includes(interest)
                                    ? 'bg-accent-yellow shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                                    : 'bg-white hover:bg-gray-50'
                                    }`}
                            >
                                {interest}
                            </button>
                        ))}
                    </div>
                );
            case 4: // Campus
                const filteredColleges = colleges.filter(c =>
                    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    c.city?.toLowerCase().includes(searchQuery.toLowerCase())
                ).slice(0, 5);

                return (
                    <div className="space-y-4">
                        {!isCustomCollege ? (
                            <>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full p-3 pl-10 border-2 border-black bg-gray-50 focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none transition-all"
                                        placeholder="Search your college..."
                                        autoFocus
                                    />
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                                </div>

                                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                                    {searchQuery && filteredColleges.length === 0 && (
                                        <div className="text-center py-4 text-gray-500 text-sm">
                                            No matches found.
                                        </div>
                                    )}

                                    {filteredColleges.map(college => (
                                        <div
                                            key={college.id}
                                            onClick={() => setFormData({ ...formData, collegeId: college.id })}
                                            className={`p-4 border-2 border-black cursor-pointer transition-all flex justify-between items-center ${formData.collegeId === college.id
                                                ? 'bg-accent-green shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                                                : 'bg-white hover:bg-gray-50'
                                                }`}
                                        >
                                            <div>
                                                <h3 className="font-bold text-sm">{college.name}</h3>
                                                <p className="text-xs text-gray-600">{college.city}</p>
                                            </div>
                                            {formData.collegeId === college.id && <span>✅</span>}
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={() => {
                                        setIsCustomCollege(true);
                                        setFormData({ ...formData, collegeId: '' });
                                    }}
                                    className="w-full py-2 text-xs font-bold text-gray-500 hover:text-black underline"
                                >
                                    My college is not listed
                                </button>
                            </>
                        ) : (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                                <div className="p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg text-sm text-yellow-800 mb-4">
                                    <p><strong>Note:</strong> Adding a custom college means you won&apos;t see college-specific events until we verify it.</p>
                                </div>
                                <div>
                                    <label className="block font-bold mb-2 uppercase text-sm tracking-wider">College Name <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        value={customCollegeData.name}
                                        onChange={(e) => setCustomCollegeData({ ...customCollegeData, name: e.target.value })}
                                        className="w-full p-3 border-2 border-black bg-gray-50 focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none transition-all"
                                        placeholder="e.g. Hogwarts School of Witchcraft"
                                        autoFocus
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold mb-2 uppercase text-sm tracking-wider">City</label>
                                    <input
                                        type="text"
                                        value={customCollegeData.city}
                                        onChange={(e) => setCustomCollegeData({ ...customCollegeData, city: e.target.value })}
                                        className="w-full p-3 border-2 border-black bg-gray-50 focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none transition-all"
                                        placeholder="e.g. Highlands"
                                    />
                                </div>
                                <button
                                    onClick={() => setIsCustomCollege(false)}
                                    className="text-xs text-gray-500 hover:text-black underline"
                                >
                                    Back to search
                                </button>
                            </div>
                        )}
                    </div>
                );
            case 5: // Review
                return (
                    <div className="space-y-4 text-left">
                        <div className="p-4 bg-gray-50 border-2 border-black">
                            <p className="font-bold text-xs uppercase text-gray-500">Name</p>
                            <p className="font-bold text-lg">{formData.fullName}</p>
                        </div>
                        <div className="p-4 bg-gray-50 border-2 border-black">
                            <p className="font-bold text-xs uppercase text-gray-500">College</p>
                            <p className="font-bold text-lg">
                                {isCustomCollege
                                    ? `${customCollegeData.name} (Custom)`
                                    : colleges.find(c => c.id === formData.collegeId)?.name || 'Not Selected'}
                            </p>
                        </div>
                        <div className="p-4 bg-gray-50 border-2 border-black">
                            <p className="font-bold text-xs uppercase text-gray-500">Bio</p>
                            <p className="italic">&quot;{formData.bio}&quot;</p>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <Container>
            <div className="min-h-screen flex items-center justify-center py-12">
                <div className="w-full max-w-xl relative">
                    <Doodle src="/doodles/sparkle.svg" className="absolute -top-12 -right-12 w-24 h-24 text-accent-pink animate-spin-slow" />

                    <NewspaperCard className="p-8 md:p-12 relative bg-white min-h-[600px] flex flex-col">
                        <Tape className="absolute -top-4 left-1/2 -translate-x-1/2" />

                        {/* Progress Bar */}
                        <div className="w-full h-2 bg-gray-100 mb-8 rounded-full overflow-hidden border border-black">
                            <motion.div
                                className="h-full bg-accent-blue"
                                initial={{ width: 0 }}
                                animate={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                            />
                        </div>

                        <div className="mb-8 text-center">
                            <Badge className="mb-4 bg-black text-white border-black">STEP {currentStep + 1} / {STEPS.length}</Badge>
                            <h1 className="font-display text-4xl font-black mb-2">{STEPS[currentStep].title}</h1>
                            <p className="text-gray-600 font-serif italic">{STEPS[currentStep].subtitle}</p>
                        </div>

                        <div className="flex-grow">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentStep}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.25 }}
                                >
                                    {renderStepContent()}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        <div className="mt-8">
                            <div className="flex gap-4">
                                {currentStep > 0 && (
                                    <RetroButton
                                        onClick={handleBack}
                                        variant="outline"
                                        className="flex-1"
                                        disabled={loading}
                                    >
                                        BACK
                                    </RetroButton>
                                )}
                                <RetroButton
                                    onClick={handleNext}
                                    className="flex-1 bg-accent-blue text-white"
                                    disabled={loading}
                                >
                                    {loading ? 'SAVING...' : currentStep === STEPS.length - 1 ? 'FINISH ->' : 'NEXT ->'}
                                </RetroButton>
                            </div>
                            <p className="text-center text-[10px] text-gray-400 font-mono mt-4 uppercase">
                                Your progress is saved automatically
                            </p>
                        </div>
                    </NewspaperCard>
                </div>
            </div>
        </Container>
    );
}
