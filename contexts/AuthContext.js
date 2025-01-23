import { createContext, useContext, useState, useEffect } from "react";
import { getUserData } from "../services/userService";
import { supabase } from "../lib/supabase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const fetchAndSetUser = async (userId) => {
        const { success, data, msg } = await getUserData(userId);
        if (success) {
            setUser(data);
        } else {
            console.error("Failed to fetch user data:", msg);
        }
    };

    const setAuth = (authUser) => {
        setUser(authUser);
    };

    const setUserData = (userData) => {
        setUser({ ...userData });
    };

    useEffect(() => {
        const { data: subscription } = supabase.auth.onAuthStateChange((event, session) => {
            if (session?.user) {
                fetchAndSetUser(session.user.id);
            } else {
                setUser(null);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setAuth, setUserData, fetchAndSetUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);


