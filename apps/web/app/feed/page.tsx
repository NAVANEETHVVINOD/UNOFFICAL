/**
 * FeedPage
 * 
 * The social feed for the campus network (/feed).
 * Allows students to:
 * - View posts from across the network
 * - Create new posts
 * - Like and comment on posts
 */
"use client"

import { useState, useEffect } from 'react';
import Container from '../components/ui/Container';
import { NewspaperCard, RetroButton, Badge, Staple, Tape } from '../components/ui/NewspaperUI';
import Doodle from '../components/ui/Doodle';
import { PageTransition } from '../providers/AnimationProvider';
import DashboardNavbar from '../components/ui/DashboardNavbar';
import { motion } from 'framer-motion';
import { api } from '../../lib/api';
import Link from 'next/link';

interface Post {
    id: string;
    content: string;
    imageUrl: string | null;
    author: {
        profile: {
            fullName: string;
            avatarUrl: string | null;
        }
    };
    _count: {
        likes: number;
        comments: number;
    };
    createdAt: string;
}

export default function FeedPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const data = await api.getPosts();
            setPosts(data);
        } catch (error) {
            console.error('Failed to fetch posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async (id: string) => {
        try {
            await api.likePost(id);
            // Optimistic update
            setPosts(posts.map(post =>
                post.id === id
                    ? { ...post, _count: { ...post._count, likes: post._count.likes + 1 } }
                    : post
            ));
        } catch (error) {
            console.error('Failed to like post:', error);
        }
    };

    return (
        <PageTransition>
            <Container>
                <div className="py-8 min-h-screen">
                    <DashboardNavbar />

                    {/* Header */}
                    <div className="text-center mb-12 relative">
                        <Doodle src="/doodles/megaphone.svg" className="w-24 h-24 absolute -top-8 left-1/4 -z-10 opacity-20 -rotate-12" />
                        <h1 className="font-display text-5xl md:text-7xl font-black mb-4">CAMPUS FEED</h1>
                        <p className="font-hand text-xl text-gray-600">What's buzzing on campus?</p>
                    </div>

                    {/* Create Post Button */}
                    <div className="max-w-2xl mx-auto mb-8 flex justify-end">
                        <Link href="/feed/create">
                            <RetroButton className="bg-black text-white">
                                + NEW POST
                            </RetroButton>
                        </Link>
                    </div>

                    {/* Posts Feed */}
                    <div className="max-w-2xl mx-auto space-y-8">
                        {loading ? (
                            <div className="text-center py-20">
                                <Doodle src="/doodles/loading.svg" className="w-16 h-16 mx-auto animate-spin" />
                            </div>
                        ) : posts.length === 0 ? (
                            <div className="text-center py-20">
                                <h3 className="font-bold text-2xl mb-2">It's quiet here...</h3>
                                <p className="text-gray-600">Be the first to start a conversation!</p>
                            </div>
                        ) : (
                            posts.map((post, index) => (
                                <motion.div
                                    key={post.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.1 * index }}
                                >
                                    <NewspaperCard className="p-6 bg-white relative">
                                        <Staple className="absolute -top-2 -left-2" />

                                        {/* Author Header */}
                                        <div className="flex items-center gap-3 mb-4 border-b-2 border-dashed border-gray-200 pb-3">
                                            <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold">
                                                {post.author.profile.fullName[0]}
                                            </div>
                                            <div>
                                                <p className="font-bold">{post.author.profile.fullName}</p>
                                                <p className="text-xs text-gray-500 font-mono">
                                                    {new Date(post.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="mb-4 font-body text-lg leading-relaxed whitespace-pre-wrap">
                                            {post.content}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-4 pt-4 border-t-2 border-black">
                                            <button
                                                onClick={() => handleLike(post.id)}
                                                className="flex items-center gap-2 font-bold hover:text-accent-blue transition-colors"
                                            >
                                                <span>❤️</span>
                                                <span>{post._count.likes} Likes</span>
                                            </button>
                                            <div className="flex items-center gap-2 font-bold text-gray-500">
                                                <span>💬</span>
                                                <span>{post._count.comments} Comments</span>
                                            </div>
                                        </div>
                                    </NewspaperCard>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>
            </Container>
        </PageTransition>
    );
}
