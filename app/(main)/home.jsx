// import { Alert, Button, FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
// import React, { useEffect, useState } from 'react'
// import ScreenWrapper from '../../components/ScreenWrapper'
// import { useAuth } from '../../contexts/AuthContext'
// import { supabase } from '../../lib/supabase'
// import { hp, wp } from '../../helpers/comman'
// import { theme } from '../../components/theme'
// import Icon from '../../assets/icons'
// import { useRouter } from 'expo-router'
// import Avatar from '../../components/Avatar'
// import { fetchPosts } from '../../services/postService'
// import PostCard from '../../components/PostCard'
// import Loads from '../../components/Loads'
// import { getUserData } from '../../services/userService'
// // import Icon from '../assets/icons'


// var limit = 0;
// const Home = () => {

//   const { user, setAuth } = useAuth();
//   const router = useRouter();

//   // console.log('user ', user);

//   const [post, setPosts] = useState([]);
//   const [hasMore, setHasMore] = useState(true);
//   const [notificationCount, setNotificationsCount] = useState(0);

//   const handlePostEvent = async (payload)=> {
//     if(payload.eventType == 'INSERT' && payload?.new?.id){
//       let newPost ={...payload.new};
//       let res = await getUserData(newPost.userId);
//       newPost.postLikes =[];
//       newPost.comments= [{count: 0}];
//       newPost.user = res.success? res.data: {};
//       setPosts(prevPosts=> [newPost, ...prevPosts]);
//     }
//     if(payload.eventType=='DELETE' && payload?.old?.id){
//       setPosts(prevPosts=>{
//         let updatedPosts = prevPosts.filter(post=> post.id!=payload.old.id);
//         return updatedPosts;
//       })
//     }
//     if(payload.eventType == 'UPDATE' && payload?.new?.id){
//       setPosts(prevPosts=>{
//         let updatedPosts = prevPosts.map(post => {

//           if(post.id==payload.new.id){
//             post.body= payload.new.body;
//             post.file=payload.new.file;
//           }
//           return post;
//         });
//         return updatedPosts;
//       })
//     }
//   }

//   const handleNewNotifcation = async (payload)=>{
//     console.log("got new notfication", payload);
//     setNotificationsCount(prevCount => prevCount + 1);
//   }


//   useEffect(() => {

//     let postChannel = supabase
//     .channel('posts')
//     .on('postgres_changes', {event: '*', schema: 'public', table: 'posts'}, handlePostEvent)
//     .subscribe();

//     // getPosts();

//     let notificationChannel = supabase
//     .channel('notifications')
//     .on('postgres_changes', {event: 'INSERT', schema: 'public', table: 'notifications', filter: `receiverId=eq.${user.id}`,}, handleNewNotifcation)
//     .subscribe();


//     return ()=> {
//       supabase.removeChannel(postChannel);
//       supabase.removeChannel(notificationChannel);
//     }
//   }, [])

// // abovie code is working properly


//   const getPosts = async () => {
//     // call the api

//     if(!hasMore) return null;
//     limit = limit + 10;

//     // console.log('fetching post : ', limit);
//     let res = await fetchPosts(limit);
//     if (res.success) {
//       if(post.length== res.data.length) setHasMore(false);
//       setPosts(res.data);

//     }
//   }


//   return (
//     <ScreenWrapper bg="white">
//       <View style={styles.container}>
//         {/* HEADER */}
//         <View style={styles.header}>
//           <Text style={styles.title}> CampusMinds </Text>
//           <View style={styles.icons}>
//             <Pressable onPress={() => {
//               setNotificationsCount(0)
//                router.push('notifications')
//             }}>
//               <Icon name="heart" size={hp(3.3)} strokeWidth={2} color={theme.colors.text} />
//               {
//                 notificationCount > 0 && (
//                   <View style={styles.pill}>
//                     <Text style={styles.pillText}>
//                       {notificationCount}
//                     </Text>
//                   </View>
//                 )
//               }
//             </Pressable>
//             <Pressable onPress={() => router.push('newPost')}>
//               <Icon name="plus" size={hp(3.3)} strokeWidth={2} color={theme.colors.text} />
//             </Pressable>
//             <Pressable onPress={() => router.push('profile')}>
//               <Avatar
//                 uri={user?.image}
//                 size={hp(4.3)}
//                 rounded={theme.radius.sm}
//                 style={{ borderWidth: 2 }}
//               />
//             </Pressable>
//           </View>
//         </View>

//         {/* posts */}

//         <FlatList
//           data={post}
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={styles.listStyle}
//           keyExtractor={item => item.id.toString()}
//           renderItem={({item }) => <PostCard
//             item={item}
//             currentUser={user}
//             router={router}
//           />
//           }


//           onEndReached={() =>{
//             getPosts();
//             // console.log('got to the end');
//           }}
//           onEndReachedThreshold={0}
//           ListFooterComponent={hasMore ? (
//             <View style={{marginVertical: post.length==0 ? 200 :  30}}>
//               <Loads/>
//               </View>
//           ):(
//             <View style={{marginVertical: 30}}>
//               <Text style={styles.noPosts}>No more posts</Text>
//               </View>
//           )}
//         />

//       </View>
//       {/* <Button title='logout' onPress={onLogout} /> */}
//     </ScreenWrapper>
//   )
// }

// export default Home

// const styles = StyleSheet.create({

//   container: {
//     flex: 1,
//     // paddingHorizontal: wp(4),
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginBottom: 10,
//     marginHorizontal: wp(4),
//   },

//   title: {
//     color: theme.colors.text,
//     fontSize: hp(3.2),
//     fontWeight: theme.fonts.bold
//   },

//   avatarImage: {
//     height: hp(4.3),
//     width: hp(4.3),
//     borderRadius: theme.radius.sm,
//     borderCurve: 'continuous',
//     borderColor: theme.colors.gray,
//     borderWidth: 3
//   },

//   listStyle: {
//     paddingTop: 20,
//     paddingHorizontal: wp(4),
//   },

//   icons: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     gap: 18
//   },

//   noPosts: {
//     fontSize: hp(2),
//     textAlign: 'center',
//     color: theme.colors.text
//   },

//   pill: {
//     position: 'absolute',
//     right: -10,
//     top: -4,
//     height: hp(2.2),
//     width: hp(2.2),
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 20,
//     backgroundColor: theme.colors.roseLight
//   },

//   pillText: {
//     color: 'white',
//     fontSize: hp(1.2),
//     fontWeight: theme.fonts.bold,
//   }




// })

import { Alert, FlatList, Pressable, StyleSheet, Text, View, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import ScreenWrapper from '../../components/ScreenWrapper';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { hp, wp } from '../../helpers/comman';
import { theme } from '../../components/theme';
import Icon from '../../assets/icons';
import { useRouter } from 'expo-router';
import Avatar from '../../components/Avatar';
import { fetchPosts } from '../../services/postService';
import PostCard from '../../components/PostCard';
import Loads from '../../components/Loads';
import { getUserData } from '../../services/userService';
// import * as Updates from 'expo-updates';

let limit = 0;

const Home = () => {
  const { user } = useAuth();
  const router = useRouter();

  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [notificationCount, setNotificationCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  // Handle Post Events
  const handlePostEvent = async (payload) => {
    if (payload.eventType === 'INSERT' && payload?.new?.id) {
      const newPost = { ...payload.new };
      const res = await getUserData(newPost.userId);
      newPost.postLikes = [];
      newPost.comments = [{ count: 0 }];
      newPost.user = res.success ? res.data : {};
      setPosts((prevPosts) => [newPost, ...prevPosts]);
    }

    if (payload.eventType === 'DELETE' && payload?.old?.id) {
      setPosts((prevPosts) =>
        prevPosts.filter((post) => post.id !== payload.old.id)
      );
    }

    if (payload.eventType === 'UPDATE' && payload?.new?.id) {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === payload.new.id
            ? { ...post, body: payload.new.body, file: payload.new.file }
            : post
        )
      );
    }
  };

  // Handle Like Events
  const handleLikeEvent = (payload) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === payload.new.postId
          ? { ...post, postLikes: [...post.postLikes, payload.new] }
          : post
      )
    );
  };

  const handleUnlikeEvent = (payload) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === payload.old.postId
          ? {
            ...post,
            postLikes: post.postLikes.filter((like) => like.id !== payload.old.id),
          }
          : post
      )
    );
  };

  // Handle Comment Events
  const handleCommentEvent = (payload) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === payload.new.postId
          ? { ...post, comments: [{ count: post.comments[0].count + 1 }] }
          : post
      )
    );
  };

  const handleDeleteCommentEvent = (payload) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === payload.old.postId
          ? { ...post, comments: [{ count: post.comments[0].count - 1 }] }
          : post
      )
    );
  };

  // Handle Notification Event
  const handleNewNotification = (payload) => {
    console.log('New Notification:', payload);
    setNotificationCount((prevCount) => prevCount + 1);
  };

  // Fetch Posts
  const getPosts = async () => {
    if (!hasMore) return;
    limit += 10;
    const res = await fetchPosts(limit);

    if (res.success) {
      if (posts.length === res.data.length) setHasMore(false);
      setPosts(res.data);
    }
  };
  const refreshPosts = async () => {
    setRefreshing(true); 
    setPosts([]); 
    setHasMore(true); 
    limit = 0; 
    await getPosts(); 
    setRefreshing(false);
  };



  useEffect(() => {
    // Subscribe to real-time updates for posts
    const postChannel = supabase
      .channel('posts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, handlePostEvent)
      .subscribe();

    // Subscribe to real-time updates for likes
    const likeChannel = supabase
      .channel('likes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'likes' }, handleLikeEvent)
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'likes' }, handleUnlikeEvent)
      .subscribe();

    // Subscribe to real-time updates for comments
    const commentChannel = supabase
      .channel('comments')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'comments' }, handleCommentEvent)
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'comments' }, handleDeleteCommentEvent)
      .subscribe();

    // Subscribe to real-time updates for notifications
    const notificationChannel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `receiverId=eq.${user.id}`,
        },
        handleNewNotification
      )
      .subscribe();

    return () => {
      supabase.removeChannel(postChannel);
      supabase.removeChannel(likeChannel);
      supabase.removeChannel(commentChannel);
      supabase.removeChannel(notificationChannel);
    };
  }, []);

  return (
    <ScreenWrapper bg="white">
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>CampusMinds</Text>
          <View style={styles.icons}>
            <Pressable
              onPress={() => {
                setNotificationCount(0);
                router.push('notifications');
              }}
            >
              <Icon name="heart" size={hp(3.3)} strokeWidth={2} color={theme.colors.text} />
              {notificationCount > 0 && (
                <View style={styles.pill}>
                  <Text style={styles.pillText}>{notificationCount}</Text>
                </View>
              )}
            </Pressable>
            <Pressable onPress={() => router.push('newPost')}>
              <Icon name="plus" size={hp(3.3)} strokeWidth={2} color={theme.colors.text} />
            </Pressable>
            <Pressable onPress={() => router.push('profile')}>
              <Avatar
                uri={user?.image}
                size={hp(4.3)}
                rounded={theme.radius.sm}
                style={{ borderWidth: 2 }}
              />
            </Pressable>
          </View>
        </View>

        {/* Posts */}
        <FlatList
          data={posts}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listStyle}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <PostCard item={item} currentUser={user} router={router} />}
          refreshControl={
            <RefreshControl
              refreshing={refreshing} // Show the loader
              onRefresh={refreshPosts} // Trigger the refresh action
              colors={[theme.colors.primary]} // Customize loader color
            />
          }
          onEndReached={getPosts}
          onEndReachedThreshold={0}
          ListFooterComponent={
            hasMore ? (
              <View style={{ marginVertical: posts.length === 0 ? 200 : 30 }}>
                <Loads />
              </View>
            ) : (
              <View style={{ marginVertical: 30 }}>
                <Text style={styles.noPosts}>No more posts</Text>
              </View>
            )
          }
        />
      </View>
    </ScreenWrapper>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginHorizontal: wp(4),
  },
  title: {
    color: theme.colors.text,
    fontSize: hp(3.2),
    fontWeight: theme.fonts.bold,
  },
  listStyle: { paddingTop: 20, paddingHorizontal: wp(4) },
  icons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  noPosts: {
    fontSize: hp(2),
    textAlign: 'center',
    color: theme.colors.text,
  },
  pill: {
    position: 'absolute',
    right: -10,
    top: -4,
    height: hp(2.2),
    width: hp(2.2),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: theme.colors.roseLight,
  },
  pillText: {
    color: 'white',
    fontSize: hp(1.2),
    fontWeight: theme.fonts.bold,
  },
});


