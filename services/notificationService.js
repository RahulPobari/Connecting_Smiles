import { supabase } from "../lib/supabase";

export const createNotification = async (notification) => {
    try {
        const { data, error } = await supabase
            .from('notifications')
            .insert(notification)
            .select()
            .single();

        if (error) {
            console.log("notifcations error", error);
            return { success: false, msg: 'Could not create notfication' };
        }

        return { success: true, data: data }

    } catch (error) {
        console.log("notifcation error", error);
        return { success: false, msg: 'Could not create notification' };
    }
}

export const fetchNotification = async (receiverId) => {
    try {
        const { data, error } = await supabase
            .from('notifications')
            .select(`
                *,
                sender: senderId(id, name, image)
            `)
            .eq('receiverId', receiverId)
            .order("created_at", { ascending: false });

        if (error) {
            console.log("fetch Notifcation error", error);
            return { success: false, msg: 'Could not fetch notification Details' };
        }

        return { success: true, data: data }

    } catch (error) {
        console.log("fetch notification error", error);
        return { success: false, msg: 'Could not fetch notifcation Details ' };
    }
}