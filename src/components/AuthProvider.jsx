import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check local storage for an existing session marker
        const savedUser = localStorage.getItem('esp32_user');
        if (savedUser) {
            setSession(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const signup = async (email, password) => {
        // 1. Check if user exists
        const { data: existing } = await supabase
            .from('custom_users')
            .select('id')
            .eq('email', email)
            .single();

        if (existing) {
            throw new Error("User already exists");
        }

        // 2. Insert new user
        const { data, error } = await supabase
            .from('custom_users')
            .insert([{ email, password }]) // In a real app password should be hashed!
            .select()
            .single();

        if (error) throw error;

        // 3. Save to local state
        setSession(data);
        localStorage.setItem('esp32_user', JSON.stringify(data));
        return data;
    };

    const login = async (email, password) => {
        const { data, error } = await supabase
            .from('custom_users')
            .select('*')
            .eq('email', email)
            .eq('password', password)
            .single();

        if (error || !data) {
            throw new Error("Invalid login credentials");
        }

        setSession(data);
        localStorage.setItem('esp32_user', JSON.stringify(data));
        return data;
    };

    const logout = () => {
        setSession(null);
        localStorage.removeItem('esp32_user');
    };

    const value = {
        session,
        login,
        signup,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
