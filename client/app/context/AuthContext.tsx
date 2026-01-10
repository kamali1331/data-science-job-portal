'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { loginUser as apiLogin, registerUser as apiRegister, logoutUser as apiLogout, API_BASE_URL } from '../services/api';

interface User {
    id: number;
    email: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (credentials: any) => Promise<void>;
    register: (credentials: any) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/auth/me`, {
                credentials: 'include' // Important for sessions
            });
            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error("Failed to check auth status", error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials: any) => {
        const data = await apiLogin(credentials);
        setUser(data.user);
    };

    const register = async (credentials: any) => {
        const data = await apiRegister(credentials);
        setUser(data.user);
    };

    const logout = async () => {
        await apiLogout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
