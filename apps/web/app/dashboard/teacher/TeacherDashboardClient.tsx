"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../../../lib/api";
import Navbar from "../../components/Navbar";
import Container from "../../components/ui/Container";
import { Plus, Users, BookOpen, GraduationCap, ChevronRight, BarChart3, Copy, Check } from "lucide-react";
import CreateClassroomModal from "../../components/lms/CreateClassroomModal";

export default function TeacherDashboardClient() {
    const router = useRouter();
    const [classrooms, setClassrooms] = useState<any[]>([]);
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [copiedCode, setCopiedCode] = useState<string | null>(null);

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            const [userProfile, classes] = await Promise.all([
                api.getProfile(),
                api.getClassrooms()
            ]);
            setProfile(userProfile);
            // Filter only classrooms where I am the teacher for this view (though backend returns all joined)
            // Ideally backend returns specific "teaching" list or we filter here.
            // For now, let's assume all returned are relevant, but maybe visually distinguish.
            setClassrooms(classes);
        } catch (error) {
            console.error("Failed to load dashboard:", error);
        } finally {
            setLoading(false);
        }
    };

    const copyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-paper dark:bg-dark-bg flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    // Calculate some quick stats
    const totalStudents = classrooms.reduce((acc, c) => acc + (c._count?.members || 0), 0);
    const totalAssignments = classrooms.reduce((acc, c) => acc + (c._count?.assignments || 0), 0);

    return (
        <div className="min-h-screen bg-paper dark:bg-dark-bg pb-20">
            <Navbar />

            <Container className="pt-24">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="font-display text-4xl font-black text-ink dark:text-dark-text tracking-tight mb-2">
                            Teacher Dashboard
                        </h1>
                        <p className="text-neutral-600 dark:text-dark-text-muted font-medium">
                            Welcome back, {profile?.fullName || 'Faculty'}. Manage your classes and students.
                        </p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-primary text-ink font-bold rounded-xl border-2 border-ink shadow-neo hover:shadow-neo-lg hover:-translate-y-1 transition-all"
                    >
                        <Plus className="w-5 h-5" />
                        Create Class
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <StatCard
                        label="Active Classrooms"
                        value={classrooms.length}
                        icon={BookOpen}
                        color="bg-accent-blue"
                    />
                    <StatCard
                        label="Total Students"
                        value={totalStudents}
                        icon={Users}
                        color="bg-accent-mint"
                    />
                    <StatCard
                        label="Assignments"
                        value={totalAssignments}
                        icon={GraduationCap}
                        color="bg-accent-purple"
                    />
                </div>

                {/* Classrooms Grid */}
                <h2 className="font-display text-2xl font-bold mb-6 flex items-center gap-2">
                    <span className="w-2 h-8 bg-ink rounded-full" />
                    Your Classrooms
                </h2>

                {classrooms.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-dark-surface border-2 border-dashed border-neutral-300 rounded-2xl">
                        <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <BookOpen className="w-8 h-8 text-neutral-400" />
                        </div>
                        <h3 className="font-bold text-xl mb-2">No classrooms yet</h3>
                        <p className="text-neutral-500 max-w-md mx-auto mb-6">
                            Create your first digital classroom to start assigning work and tracking progress.
                        </p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="text-primary font-bold hover:underline"
                        >
                            Create a Classroom
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {classrooms.map((classroom) => (
                            <motion.div
                                key={classroom.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                whileHover={{ y: -5 }}
                                onClick={() => router.push(`/classrooms/${classroom.id}`)}
                                className="group cursor-pointer bg-white dark:bg-dark-surface border-2 border-ink rounded-xl overflow-hidden shadow-neo hover:shadow-neo-lg transition-all"
                            >
                                <div className="h-24 bg-pattern-grid dot-pattern p-4 flex flex-col justify-between relative bg-neutral-100">
                                    <div className="absolute inset-0 opacity-10 bg-primary" />
                                    <div className="flex justify-between items-start z-10">
                                        <span className="bg-white/90 backdrop-blur px-2 py-1 rounded-md text-xs font-bold border border-black/10">
                                            {classroom.subject || 'General'}
                                        </span>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); copyCode(classroom.code); }}
                                            className="flex items-center gap-1 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-xs font-bold border border-black/10 hover:bg-white active:scale-95 transition-transform"
                                            title="Copy Join Code"
                                        >
                                            {copiedCode === classroom.code ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                                            {classroom.code}
                                        </button>
                                    </div>
                                </div>

                                <div className="p-5">
                                    <h3 className="font-display text-xl font-bold mb-1 truncate group-hover:text-primary transition-colors">
                                        {classroom.name}
                                    </h3>
                                    <p className="text-sm text-neutral-500 mb-4 line-clamp-2 min-h-[40px]">
                                        {classroom.description || "No description provided."}
                                    </p>

                                    <div className="flex items-center justify-between text-sm font-medium pt-4 border-t border-neutral-100">
                                        <div className="flex items-center gap-4 text-neutral-600">
                                            <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {classroom._count?.members || 0}</span>
                                            <span className="flex items-center gap-1"><BarChart3 className="w-4 h-4" /> {classroom._count?.assignments || 0}</span>
                                        </div>
                                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </Container>

            <CreateClassroomModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => {
                    loadDashboard();
                    setIsModalOpen(false);
                }}
                collegeId={profile?.collegeId}
            />
        </div>
    );
}

function StatCard({ label, value, icon: Icon, color }: any) {
    return (
        <div className="bg-white dark:bg-dark-surface border-2 border-ink rounded-xl p-5 shadow-neo flex items-center gap-4">
            <div className={`w-12 h-12 rounded-lg border-2 border-black flex items-center justify-center ${color}`}>
                <Icon className="w-6 h-6 text-black" />
            </div>
            <div>
                <p className="text-sm font-bold text-neutral-500 uppercase tracking-wider">{label}</p>
                <p className="font-display text-3xl font-black text-ink dark:text-dark-text">{value}</p>
            </div>
        </div>
    );
}
