import { supabase } from './supabase';

export const userService = {
    // Check if user has already completed anamnesis
    async hasAnamnese(userId) {
        const { data, error } = await supabase
            .from('anamneses')
            .select('id')
            .eq('user_id', userId)
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 is "Row not found"
            console.error('Error checking anamnese:', error);
            return false;
        }
        return !!data;
    },

    // Save Anamnese Data
    async saveAnamnese(userId, anameseData) {
        const { error } = await supabase
            .from('anamneses')
            .upsert({
                user_id: userId,
                data: anameseData
            });

        if (error) throw error;
    },

    // Save Fitness Plan
    async savePlan(userId, planData) {
        const { error } = await supabase
            .from('fitness_plans')
            .upsert({
                user_id: userId,
                plan_data: planData
            });

        if (error) throw error;
    },

    // Get full user data (Anamnese + Plan)
    async getUserFullData(userId) {
        const { data: anamnese } = await supabase
            .from('anamneses')
            .select('data')
            .eq('user_id', userId)
            .single();

        const { data: plan } = await supabase
            .from('fitness_plans')
            .select('plan_data')
            .eq('user_id', userId)
            .single();

        return {
            user: anamnese?.data || null,
            plan: plan?.plan_data || null
        };
    }
};
