"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Loading from '../loading'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

interface User {
    id: string
    email: string
    role: string
    profile?: {
        fullName: string
        bio?: string
        collegeId?: string
        avatarUrl?: string
        githubUrl?: string
        instagram?: string
        tags?: string[]
        interests?: string[]
        socials?: any
        isOnboarded?: boolean
        onboardingStep?: number
        college?: {
            id: string
            name: string
            slug: string
        }
    }
}

interface AuthContextType {
    user: User | null
    isAuthenticated: boolean
    loading: boolean
    login: (email: string, password: string) => Promise<void>
    register: (email: string, password: string, fullName: string, collegeSlug?: string) => Promise<void>
    logout: () => void
    refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoadingUser, setIsLoadingUser] = useState(true)
    const router = useRouter()
    const pathname = usePathname()

    const isAuthenticated = !!user

    useEffect(() => {
        loadUser()
    }, [])

    // Onboarding Check
    useEffect(() => {
        if (isLoadingUser) return;

        if (user) {
            // If logged in but not onboarded -> Force Onboarding
            if (!user.profile?.isOnboarded && pathname !== '/onboarding') {
                router.replace('/onboarding')
            }
            // If logged in AND onboarded -> Prevent accessing Onboarding
            else if (user.profile?.isOnboarded && pathname.startsWith('/onboarding')) {
                router.replace('/dashboard')
            }
        }
    }, [user, isLoadingUser, pathname])

    // Session Heartbeat: Refresh user every 5 minutes
    useEffect(() => {
        if (!isAuthenticated) return;

        const interval = setInterval(() => {
            console.log('❤️ Session Heartbeat: Refreshing session...')
            refreshSession()
        }, 5 * 60 * 1000)

        return () => clearInterval(interval)
    }, [isAuthenticated])

    async function loadUser(silent = false) {
        if (!silent) setIsLoadingUser(true)
        try {
            const token = localStorage.getItem('token')
            if (!token) {
                setIsLoadingUser(false)
                return
            }

            const res = await fetch(`${API_URL}/users/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })

            if (res.ok) {
                const userData = await res.json()
                setUser(userData)
            } else {
                console.warn('Token invalid or expired')
                logout()
            }
        } catch (error) {
            console.error('Failed to load user:', error)
        } finally {
            setIsLoadingUser(false)
        }
    }

    async function login(email: string, password: string) {
        console.log('Attempting login for:', email)
        setIsLoadingUser(true)
        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            })

            const data = await res.json()
            console.log('Login response status:', res.status)

            if (res.ok) {
                console.log('Login successful, setting token')
                localStorage.setItem('token', data.accessToken)
                localStorage.setItem('refreshToken', data.refreshToken)
                document.cookie = `token=${data.accessToken}; path=/; max-age=86400; SameSite=Lax`
                await loadUser()
            } else {
                console.error('Login failed:', data)
                throw new Error(data.message || 'Login failed')
            }
        } catch (error) {
            console.error('Login error:', error)
            throw error
        } finally {
            setIsLoadingUser(false)
        }
    }

    async function register(email: string, password: string, fullName: string, collegeSlug?: string) {
        console.log('Attempting registration for:', email)
        setIsLoadingUser(true)
        try {
            const res = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, fullName, collegeSlug }),
            })

            const data = await res.json()
            console.log('Registration response status:', res.status)

            if (res.ok) {
                console.log('Registration successful, setting token')
                localStorage.setItem('token', data.accessToken)
                localStorage.setItem('refreshToken', data.refreshToken)
                document.cookie = `token=${data.accessToken}; path=/; max-age=86400; SameSite=Lax`
                await loadUser()
            } else {
                console.error('Registration failed:', data)
                throw new Error(data.message || 'Registration failed')
            }
        } catch (error) {
            console.error('Register error:', error)
            throw error
        } finally {
            setIsLoadingUser(false)
        }
    }

    async function refreshSession() {
        try {
            const refreshToken = localStorage.getItem('refreshToken')
            if (!refreshToken) return

            console.log('🔄 Refreshing session...')
            const res = await fetch(`${API_URL}/auth/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refreshToken }),
            })

            if (res.ok) {
                const data = await res.json()
                localStorage.setItem('token', data.accessToken)
                localStorage.setItem('refreshToken', data.refreshToken)
                document.cookie = `token=${data.accessToken}; path=/; max-age=86400; SameSite=Lax`
                console.log('✅ Session refreshed')
            } else {
                console.warn('Session refresh failed')
                logout()
            }
        } catch (error) {
            console.error('Session refresh error:', error)
        }
    }

    function logout() {
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
        setUser(null)
        router.push('/')
    }

    if (isLoadingUser) {
        return <Loading />
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, loading: isLoadingUser, login, register, logout, refreshUser: () => loadUser(false) }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
