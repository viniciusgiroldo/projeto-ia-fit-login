import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { supabase } from '../services/supabase';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        // Check active session
        const initSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (mounted) {
                setUser(session?.user ?? null);
                setLoading(false);
            }
        };
        initSession();

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (mounted) {
                setUser(session?.user ?? null);
                setLoading(false);
            }
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);

    // Memoize the value to prevent unnecessary re-renders
    const value = useMemo(() => ({
        user,
        signIn,
        signUp,
        signOut,
        loading
    }), [user, loading]);

    // Define functions strictly outside/inside to avoid hoisting issues, but better here:
    async function signIn(email, password) {
        // 1. GATEKEEPER CHECK (Whitelist)
        const { data: allowed } = await supabase
            .from('allowed_users')
            .select('email')
            .eq('email', email)
            .single();

        if (!allowed) {
            throw new Error('Acesso restrito. Este email não possui uma licença ativa.');
        }

        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
    }

    async function signUp(email, password, fullName) {
        const { data: allowed } = await supabase
            .from('allowed_users')
            .select('email')
            .eq('email', email)
            .single();

        if (!allowed) {
            throw new Error('Cadastro restrito. Adquira o plano para liberar seu acesso.');
        }

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name: fullName } }
        });

        if (error) throw error;
        return data;
    }

    async function signOut() {
        await supabase.auth.signOut();
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
