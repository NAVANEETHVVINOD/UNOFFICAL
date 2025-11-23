"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

interface User {
    id: string
    email: string
    role: string
    profile?: {
        fullName: string
        bio?: string
        collegeId?: string
    }
}

interface AuthContextType {
    user: User | null
    isAuthenticated: boolean
    loading: boolean
    login: (email: string, password: string) => Promise<void>
    register: (email: string, password: string, fullName: string, collegeId?: string) => Promise<void>
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    const isAuthenticated = !!user

    useEffect(() => {
        loadUser()
    }, [])

    async function loadUser() {
        try {
            const token = localStorage.getItem('token')
            if (!token) {
                setLoading(false)
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
                localStorage.removeItem('token')
            }
        } catch (error) {
            console.error('Failed to load user:', error)
            localStorage.removeItem('token')
        } finally {
            setLoading(false)
        }
    }

    async function login(email: string, password: string) {
        console.log('Attempting login for:', email)
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
                // Set cookie for middleware
                document.cookie = `token=${data.accessToken}; path=/; max-age=86400; SameSite=Lax`
                setUser(data.user)
                router.push('/dashboard')
            } else {
                console.error('Login failed:', data)
                throw new Error(data.message || 'Login failed')
            }
        } catch (error) {
            console.error('Login error:', error)
            throw error
        }
    }

    async function register(email: string, password: string, fullName: string, collegeId?: string) {
        console.log('Attempting registration for:', email)
        try {
            const res = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, fullName, collegeId }),
            })

            const data = await res.json()
            console.log('Registration response status:', res.status)

            if (res.ok) {
                console.log('Registration successful, setting token')
                localStorage.setItem('token', data.accessToken)
                // Set cookie for middleware
                document.cookie = `token=${data.accessToken}; path=/; max-age=86400; SameSite=Lax`
                setUser(data.user)
                router.push('/dashboard')
            } else {
                console.error('Registration failed:', data)
                throw new Error(data.message || 'Registration failed')
            }
        } catch (error) {
            console.error('Register error:', error)
            throw error
        }
    }

    function logout() {
        localStorage.removeItem('token')
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
        setUser(null)
        router.push('/')
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, loading, login, register, logout }}>
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
