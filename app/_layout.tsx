import { View, Text, LogBox } from 'react-native';
import React, { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { getUserData } from '../services/userService';
import { User } from '@supabase/supabase-js';

LogBox.ignoreLogs(['Warning: TNodeChildrenRenderer', 'Warning: MemoizedTNodeRenderer', 'Warning: TRenderEngineProvider'])
const _layout = () => {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
};

const MainLayout = () => {
  const { setAuth, setUserData } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Session user:', session?.user?.id);

      if (session) {
        setAuth(session.user);
        updateUserData(session.user);
        router.replace('/home');
      } else {
        setAuth(null);
        router.replace('/welcome');
      }
    });


    // return () => subscription.unsubscribe(); // Clean up the subscription on unmount
  }, []);

  const updateUserData = async (user: User) => {
    const res = await getUserData(user.id);

    if (res.success) {
      setUserData(res.data); // Directly pass res.data
    } else {
      console.error('Failed to fetch user data:', res.msg);
    }
  };

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="(main)/postDetails"
        options={{
          presentation: 'modal'
        }}
      />
    </Stack>
  );
};

export default _layout;
