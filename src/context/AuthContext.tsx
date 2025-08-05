'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '@/services/api';

type User = {
    id: string;
    email: string;
    role: 'doctor' | 'patient' | 'pharmacist';
};

type AuthContextType = {
    user: User | null;
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
    loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            try {
                const decodedUser = jwtDecode<User>(storedToken);
                setUser(decodedUser);
                setToken(storedToken);
            } catch (error) {
                console.error('Invalid token found in localStorage', error);
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    }, []);

    const login = (authToken: string) => {
        localStorage.setItem('token', authToken);
        const decodedUser = jwtDecode<User>(authToken);
        setUser(decodedUser);
        setToken(authToken);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setToken(null);
    };

    const value = {
        user,
        token,
        login,
        logout,
        loading,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};