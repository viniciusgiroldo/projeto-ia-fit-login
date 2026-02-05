import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabase';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signIn = async (email, password) => {
        // 1. GATEKEEPER CHECK (Whitelist)
        const { data: allowed } = await supabase
            .from('allowed_users')
            .select('email')
            .eq('email', email)
            .single();

        if (!allowed) {
            throw new Error('Acesso restrito. Este email não possui uma licença ativa.');
        }

        // 2. Real Auth
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
    };

    const signUp = async (email, password, fullName) => {
        // 1. GATEKEEPER CHECK (Whitelist)
        const { data: allowed } = await supabase
            .from('allowed_users')
            .select('email')
            .eq('email', email)
            .single();

        if (!allowed) {
            throw new Error('Cadastro restrito. Adquira o plano para liberar seu acesso.');
        }

        // 2. Real Signup
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { full_name: fullName }
            }
        });

        if (error) throw error;
        return data;
    };

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    return (
        <AuthContext.Provider value={{ user, signIn, signUp, signOut, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
