"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import Navbar from "@/components/Navbar";
import Container from "@/components/ui/Container";
import { Settings, Users, BookOpen, GraduationCap, ChevronLeft, MoreHorizontal, Plus, Clock, ChevronDown, Upload } from "lucide-react";
import CreateAssignmentModal from "@/components/lms/CreateAssignmentModal";
import UploadComponent from "@/components/ui/UploadComponent";
import GradingModal from "@/components/lms/GradingModal";

const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
    }).format(new Date(dateString));
};

function StreamTab({ classroom }: { classroom: any }) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="hidden lg:block lg:col-span-1">
                <div className="bg-white dark:bg-dark-surface border-2 border-ink rounded-xl p-4 shadow-neo">
                    <h3 className="font-bold text-sm mb-2 text-neutral-500 uppercase tracking-wider">Upcoming</h3>
                    <p className="text-sm text-neutral-400">No work due soon</p>
                    <button className="mt-4 text-primary font-bold text-sm hover:underline">View all</button>
                </div>
            </div>
            <div className="lg:col-span-3 space-y-4">
                <div className="bg-white dark:bg-dark-surface border-2 border-ink rounded-xl p-4 shadow-neo flex items-center gap-4 cursor-pointer hover:bg-neutral-50 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold border-2 border-black">
                        T
                    </div>
                    <p className="text-neutral-500 font-medium">Announce something to your class...</p>
                </div>
                {/* Posts will go here */}
                <div className="text-center py-10">
                    <p className="text-neutral-500">No updates yet.</p>
                </div>
            </div>
        </div>
    );
}

function AssignmentItem({ assignment, isTeacher, classroomId }: { assignment: any; isTeacher: boolean; classroomId: string }) {
    const [expanded, setExpanded] = useState(false);
    const [submission, setSubmission] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    // Teacher view state
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [gradingSubmission, setGradingSubmission] = useState<any>(null);

    const loadSubmissionData = async () => {
        setLoading(true);
        try {
            if (isTeacher) {
                const data = await api.getSubmissions(assignment.id);
                setSubmissions(data);
            } else {
                // For student, we assume we might have the submission state or need to fetch it.
                // Ideally, the assignment list should include "mySubmission" field. 
                // If not, we can fetch it. For now, let's fetch individual submission status if not present.
                // But wait, getAssignments doesn't return mySubmission.
                // We can fetch all submissions for this assignment and find ours, OR add a specific endpoint.
                // Actually, let's just show the Upload UI.
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const handleExpand = () => {
        if (!expanded) {
            loadSubmissionData();
        }
        setExpanded(!expanded);
    }

    const handleStudentSubmit = async (fileUrl: string) => {
        try {
            await api.submitAssignment(assignment.id, fileUrl);
            alert("Assignment submitted successfully!");
            setExpanded(false); // Close on success
            // Ideally trigger refresh
        } catch (error: any) {
            alert(error.message || "Failed to submit");
        }
    }

    return (
        <div className="bg-white dark:bg-dark-surface border-2 border-ink rounded-xl shadow-neo hover:shadow-neo-lg transition-all overflow-hidden">
            <div
                onClick={handleExpand}
                className="p-5 cursor-pointer flex items-center justify-between"
            >
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-accent-purple/20 flex items-center justify-center border-2 border-black flex-shrink-0">
                        <BookOpen className="w-5 h-5 text-accent-purple" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{assignment.title}</h3>
                        <div className="flex items-center gap-3 text-sm text-neutral-500 mt-1">
                            <span className="flex items-center gap-1">
                                {assignment.dueDate ? (
                                    <>
                                        <Clock className="w-3 h-3" />
                                        Due {formatDate(assignment.dueDate)}
                                    </>
                                ) : "No due date"}
                            </span>
                            <span className="w-1 h-1 bg-neutral-300 rounded-full" />
                            <span>{assignment.points} points</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {isTeacher ? (
                        <div className="text-right hidden sm:block">
                            <p className="font-display font-black text-2xl leading-none">{assignment._count?.submissions || 0}</p>
                            <p className="text-xs font-bold text-neutral-400 uppercase tracking-wide">Turned In</p>
                        </div>
                    ) : (
                        <div className="hidden sm:block">
                            <span className="px-3 py-1 bg-neutral-100 rounded-full text-xs font-bold text-neutral-500">Assigned</span>
                        </div>
                    )}
                    <div className={`p-2 rounded-full transition-transform duration-200 ${expanded ? 'rotate-180 bg-neutral-100' : ''}`}>
                        <ChevronDown className="w-5 h-5" />
                    </div>
                </div>
            </div>

            {expanded && (
                <div className="p-5 border-t-2 border-neutral-100 bg-neutral-50/50 dark:bg-white/5 animate-in slide-in-from-top-2 duration-200">
                    <p className="text-neutral-600 mb-6 whitespace-pre-wrap">{assignment.description || "No instructions provided."}</p>

                    {isTeacher ? (
                        <div className="space-y-4">
                            <h4 className="font-bold text-sm uppercase tracking-wider text-neutral-500">Submissions ({submissions.length})</h4>
                            {loading && <div className="text-sm text-neutral-400">Loading submissions...</div>}
                            {!loading && submissions.length === 0 && <div className="text-sm text-neutral-400 italic">No submissions yet.</div>}
                            <div className="grid gap-2">
                                {submissions.map(sub => (
                                    <div key={sub.id} className="flex justify-between items-center bg-white p-3 rounded-lg border border-neutral-200">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-neutral-200 border border-black overflow-hidden flex items-center justify-center font-bold text-xs">
                                                {sub.student?.profile?.fullName?.[0] || "S"}
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm">{sub.student.profile.fullName || "Student"}</p>
                                                <p className="text-xs text-neutral-400">
                                                    {formatDate(sub.submittedAt)} • {sub.status === 'GRADED' ? `Grade: ${sub.grade}/${assignment.points}` : 'Not Graded'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <a href={sub.fileUrl} target="_blank" rel="noopener noreferrer" className="text-primary text-sm font-bold hover:underline px-2">View</a>
                                            <button
                                                onClick={() => setGradingSubmission(sub)}
                                                className="px-3 py-1 bg-black text-white text-xs font-bold rounded shadow-neo hover:-translate-y-0.5 transition-transform"
                                            >
                                                {sub.status === 'GRADED' ? 'Edit Grade' : 'Grade'}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-dark-bg p-6 rounded-xl border border-neutral-200">
                            <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                                <Upload className="w-5 h-5" />
                                Your Work
                            </h4>
                            <UploadComponent
                                onUpload={handleStudentSubmit}
                                label="Upload Assignment (PDF/Image)"
                                accept="application/pdf,image/*"
                            />
                        </div>
                    )}
                </div>
            )}

            <GradingModal
                isOpen={!!gradingSubmission}
                onClose={() => setGradingSubmission(null)}
                submission={gradingSubmission}
                onSuccess={() => {
                    setGradingSubmission(null);
                    loadSubmissionData();
                }}
            />
        </div>
    );
}

function ClassworkTab({ classroom, isTeacher }: { classroom: any; isTeacher: boolean }) {
    const [assignments, setAssignments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    useEffect(() => {
        loadAssignments();
    }, [classroom.id]);

    const loadAssignments = async () => {
        try {
            const data = await api.getAssignments(classroom.id);
            setAssignments(data);
        } catch (error) {
            console.error("Failed to load assignments:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto min-h-[50vh]">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold font-display">Assignments</h2>
                {isTeacher && (
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-black text-white px-4 py-2 rounded-lg font-bold hover:-translate-y-0.5 transition-transform flex items-center gap-2 shadow-neo"
                    >
                        <Plus className="w-4 h-4" />
                        Create
                    </button>
                )}
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => <div key={i} className="h-20 bg-neutral-100 rounded-xl animate-pulse" />)}
                </div>
            ) : assignments.length === 0 ? (
                <div className="text-center py-20 bg-neutral-50 dark:bg-dark-bg border-2 border-dashed border-neutral-200 rounded-xl">
                    <GraduationCap className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                    <p className="text-neutral-500 font-medium">No assignments yet.</p>
                    {isTeacher && <p className="text-sm text-neutral-400 mt-1">Click "Create" to add one.</p>}
                </div>
            ) : (
                <div className="space-y-4">
                    {assignments.map((assignment) => (
                        <AssignmentItem
                            key={assignment.id}
                            assignment={assignment}
                            isTeacher={isTeacher}
                            classroomId={classroom.id}
                        />
                    ))}
                </div>
            )}

            <CreateAssignmentModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={() => {
                    setIsCreateModalOpen(false);
                    loadAssignments();
                }}
                classroomId={classroom.id}
            />
        </div>
    );
}


function PeopleTab({ classroom }: { classroom: any }) {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h2 className="text-2xl font-display font-bold text-primary border-b-2 border-primary pb-2 mb-4 flex justify-between items-center">
                    Teachers
                    <Users className="w-5 h-5" />
                </h2>
                <div className="flex items-center gap-4 p-2">
                    <div className="w-10 h-10 rounded-full bg-neutral-200 border-2 border-black" />
                    <span className="font-bold">{classroom.teacher?.profile?.fullName || 'Teacher'}</span>
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-display font-bold text-ink dark:text-dark-text border-b-2 border-neutral-200 pb-2 mb-4 flex justify-between items-center">
                    Students
                    <span className="text-sm font-normal text-neutral-500">{classroom._count?.members || 0} students</span>
                </h2>
                {/* Student list */}
                <p className="text-neutral-500 italic p-2">No students enrolled yet.</p>
            </div>
        </div>
    );
}

export default function ClassroomClient({ id }: { id: string }) {
    const router = useRouter();
    const [classroom, setClassroom] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'stream' | 'classwork' | 'people' | 'grades'>('stream');

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        try {
            const [classData, profileData] = await Promise.all([
                api.getClassroom(id),
                api.getProfile().catch(() => null)
            ]);
            setClassroom(classData);
            setProfile(profileData);
        } catch (error) {
            console.error("Failed to load classroom:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="h-screen flex items-center justify-center"><div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" /></div>;
    if (!classroom) return <div className="h-screen flex items-center justify-center">Classroom not found.</div>;

    const isTeacher = profile?.id === classroom.teacherId;

    return (
        <div className="min-h-screen bg-paper dark:bg-dark-bg pb-20">
            <Navbar />

            <Container className="pt-20">
                {/* Top Navigation Bar inside Classroom */}
                <div className="flex items-center justify-between py-4 mb-2 border-b border-neutral-200 dark:border-neutral-800">
                    <div className="flex items-center gap-4">
                        <button onClick={() => router.back()} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <div className="flex flex-col">
                            <h1 className="font-display text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-ink to-neutral-600 dark:from-white dark:to-neutral-400">
                                {classroom.name}
                            </h1>
                            <span className="text-xs font-bold text-neutral-500">{classroom.subject}</span>
                        </div>
                    </div>

                    <div className="flex gap-1 md:gap-6 text-sm font-bold text-neutral-600 dark:text-neutral-400 overflow-x-auto">
                        <button
                            onClick={() => setActiveTab('stream')}
                            className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${activeTab === 'stream' ? 'bg-primary/10 text-primary' : 'hover:bg-neutral-100 dark:hover:bg-white/5'}`}
                        >
                            Stream
                        </button>
                        <button
                            onClick={() => setActiveTab('classwork')}
                            className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${activeTab === 'classwork' ? 'bg-primary/10 text-primary' : 'hover:bg-neutral-100 dark:hover:bg-white/5'}`}
                        >
                            Classwork
                        </button>
                        <button
                            onClick={() => setActiveTab('people')}
                            className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${activeTab === 'people' ? 'bg-primary/10 text-primary' : 'hover:bg-neutral-100 dark:hover:bg-white/5'}`}
                        >
                            People
                        </button>
                        {isTeacher && (
                            <button
                                onClick={() => setActiveTab('grades')}
                                className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${activeTab === 'grades' ? 'bg-primary/10 text-primary' : 'hover:bg-neutral-100 dark:hover:bg-white/5'}`}
                            >
                                Grades
                            </button>
                        )}
                    </div>

                    <div className="w-10 flex justify-end">
                        {isTeacher && (
                            <button className="p-2 hover:bg-black/5 rounded-full">
                                <Settings className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Banner Area (Only on Stream) */}
                {activeTab === 'stream' && (
                    <div className="relative h-48 md:h-64 rounded-xl overflow-hidden mb-8 border-2 border-ink shadow-neo bg-gradient-to-br from-primary to-accent-purple">
                        {classroom.bannerUrl && (
                            <img src={classroom.bannerUrl} alt="Classroom Banner" className="w-full h-full object-cover" />
                        )}
                        <div className="absolute inset-0 bg-black/20" />
                        <div className="absolute bottom-0 left-0 p-6 text-white max-w-2xl">
                            <h1 className="text-3xl md:text-4xl font-display font-black mb-2">{classroom.name}</h1>
                            <p className="text-white/90 font-medium text-lg">{classroom.subject}</p>

                            <div className="mt-4 inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg text-sm font-bold border border-white/30">
                                Code: {classroom.code}
                            </div>
                        </div>
                    </div>
                )}

                {/* Tab Content */}
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {activeTab === 'stream' && <StreamTab classroom={classroom} />}
                    {activeTab === 'classwork' && <ClassworkTab classroom={classroom} isTeacher={isTeacher} />}
                    {activeTab === 'people' && <PeopleTab classroom={classroom} />}
                    {activeTab === 'grades' && <div className="text-center py-20 text-neutral-500">Grades feature coming soon...</div>}
                </div>

            </Container>
        </div>
    );
}
