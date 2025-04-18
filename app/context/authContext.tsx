"use client";

import React, { useCallback, useState, useEffect, useContext, createContext } from 'react';

interface User {
    id?: string; 
    email: string;
    password: string;
    company_name: string;
}

interface AuthContextType {
    user: User | null;
    signin: (email: string, password: string) => Promise<User | null>;
    //signout: () => Promise<void>;
    //signup: (company_name: string, email: string, password: string) => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export const AuthProvider = ({children}: {children: React.ReactNode}) => {
    const [user, setUser] = useState<User | null>(null)

    const signin = async (email: string, password: string) => {
        try {
            const response = await fetch('/api/auth/signIn', {
                method: 'POST',
                headers: {
                    'Content-Type': 'applicatoin/json'
                },
                body: JSON.stringify({
                    email, 
                    password
                })
            })

            const result = await response.json();

            if (response.ok) {
                return {
                    error: result.error || 'Failed to sign in'
                };
            }
            return result;
        } catch (error) {
            console.error("Error signing in", error)
        }
    };

    return (
        <AuthContext.Provider value={{
            user, 
            signin
        }} >
            {children}
        </AuthContext.Provider>
    )
}