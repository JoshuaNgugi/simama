'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

type User = {
    id: string;
    email: string;
    role: 'doctor' | 'patient' | 'pharmacist';
    firstname: string;
    lastname: string;
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
        const storedToken = Cookies.get('token');
        if (storedToken) {
            try {
                const decodedUser = jwtDecode<User>(storedToken);
                if (!decodedUser.role) {
                    throw new Error('Missing role in token');
                }
                setUser(decodedUser);
                setToken(storedToken);
            } catch (error) {
                console.error('Invalid token found in cookies', error);
                Cookies.remove('token');
            }
        }
        setLoading(false);
    }, []);

    const login = (authToken: string) => {
        Cookies.set('token', authToken, { expires: 7, secure: false, sameSite: 'Strict' });
        setToken(authToken);

        const decodedUser = jwtDecode<User>(authToken);
        setUser(decodedUser);
    };

    const logout = () => {
        // Remove the token from the cookie
        Cookies.remove('token');
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