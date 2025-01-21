import { createContext, useContext, useState, useEffect } from "react";
import { getUserData } from "../services/userService";
import { supabase } from "../lib/supabase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Fetch user data and set in state
    const fetchAndSetUser = async (userId) => {
        const { success, data, msg } = await getUserData(userId);
        if (success) {
            setUser(data); // Populate user state
        } else {
            console.error("Failed to fetch user data:", msg);
        }
    };

    const setAuth = (authUser) => {
        setUser(authUser); // Set basic auth data (e.g., after signup/login)
    };

    const setUserData = (userData) => {
        setUser({ ...userData }); // Update user state with additional info
    };

    // Automatically restore session and fetch user data on app start
    useEffect(() => {
        const { data: subscription } = supabase.auth.onAuthStateChange((event, session) => {
            if (session?.user) {
                fetchAndSetUser(session.user.id); // Fetch user data using userId
            } else {
                setUser(null); // Clear user state on logout
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


