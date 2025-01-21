export const updateUser = async (userId, data) => {
    try {
        const {  error } = await supabase
            .from('users')
            .update(data)
            .eq('id' , userId);
            

        if (error) {
            return { success: false, msg: error?.message }
        }

        // console.log(user)
        return { success: true, data }

    } catch (error) {
        console.log('got error', error);
        return { success: false, msg: error.message }
    }

} 



import { supabase } from "../lib/supabase";

export const getUserData = async (userId) => {
    try {
        const { data, error } = await supabase
            .from('users') // Ensure this table has all required fields
            .select('id, name, email, address, phoneNumber, bio, image') // Add all required fields
            .eq('id', userId)
            .single();

        if (error) {
            return { success: false, msg: error?.message };
        }

        return { success: true, data };
    } catch (error) {
        console.error("Error fetching user data:", error);
        return { success: false, msg: error.message };
    }
};
