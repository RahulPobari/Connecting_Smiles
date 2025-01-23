import { Alert, FlatList, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import { useAuth } from '../../contexts/AuthContext'
import { useRouter } from 'expo-router'
import Header from '../../components/Header'
import { hp, wp } from '../../helpers/comman'
import Icon from '../../assets/icons'
import { theme } from '../../components/theme'
import { supabase } from '../../lib/supabase'
import Avatar from '../../components/Avatar'
import { fetchPosts } from '../../services/postService'
import PostCard from '../../components/PostCard'
import Loads from '../../components/Loads'
// import { getUserImageSrc } from '../../services/imageService'

var limit = 0;
const Profile = () => {

  const { user, fetchAndSetUser } = useAuth();
  const router = useRouter();


  const [post, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);


  const getPosts = async () => {

    if (!hasMore) return null;
    limit = limit + 10;

    // console.log('fetching post : ', limit);
    let res = await fetchPosts(limit, user?.id);
    if (res.success) {
      if (post.length == res.data.length) setHasMore(false);
      setPosts(res.data);

    }
  }



  const onLogout = async () => {
    // setAuth(null);
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert('SignOut', "Error Signing out!")
    }
  }

  const handleLogout = async () => {
    Alert.alert("Confirm", "Are you sure you want to Logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          const { error } = await supabase.auth.signOut();
          if (error) {
            Alert.alert("SignOut", "Error Signing out!");
          } else {
            console.log("User logged out");
          }
        },
      },
    ]);
  };
  useEffect(() => {
    if (!user) {
      const session = supabase.auth.session();
      if (session?.user?.id) {
        fetchAndSetUser(session.user.id);
      }
    }
  }, [user]);

  if (!user) {
    return <Text>Loading user data...</Text>;
  }



  return (
    <ScreenWrapper bg='white' >

      <FlatList
        data={post}
        ListHeaderComponent={<UserHeader user={user} router={router} handleLogout={handleLogout} />}
        ListHeaderComponentStyle={{ marginBottom: 30 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listStyle}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => <PostCard
          item={item}
          currentUser={user}
          router={router}
        />
        }


        onEndReached={() => {
          getPosts();
          // console.log('got to the end');
        }}
        onEndReachedThreshold={0}
        ListFooterComponent={hasMore ? (
          <View style={{ marginVertical: post.length == 0 ? 100 : 30 }}>
            <Loads />
          </View>
        ) : (
          <View style={{ marginVertical: 30 }}>
            <Text style={styles.noPosts}>No more posts</Text>
          </View>
        )}
      />

    </ScreenWrapper>
  )
}

const UserHeader = ({ user, router, handleLogout }) => {
  // const imageSource = getUserImageSrc(user?.image);
  return (
    <View style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: wp(4) }}>
      <View>
        <Header title="Profile " mb={30} />
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} >
          <Icon name="logout" color={theme.colors.rose} />
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <View style={{ gap: 15 }}>
          <View style={styles.avatarContainer}>
            <Avatar
              uri={user?.image}
              size={hp(12)}
              rounded={theme.radius.xxl * 1.4}
            />
            <Pressable style={styles.editIcon} onPress={() => router.push('editProfile')}>
              <Icon name="edit" strokeWidth={2.5} size={20} />
            </Pressable>
          </View>

          {/* USER Name && Address */}
          {/* console.log(user.name); */}

          <View style={{ alignItems: 'center', gap: 4 }}>
            <Text style={styles.userName}>{user && user.name}</Text>
            <Text style={styles.infoText}>{user && user.address}</Text>
          </View>

          {/* Email, Phone, Bio */}

          <View style={{ gap: 10 }}>
            <View style={styles.info}>
              <Icon name="mail" size={20} color={theme.colors.textLight} />
              <Text style={styles.infoText}>{user && user.email}</Text>
            </View>

            {
              user && user.phoneNumber && (
                <View style={styles.info}>
                  <Icon name="call" size={20} color={theme.colors.textLight} />
                  <Text style={styles.infoText}>{user && user.phoneNumber}</Text>
                </View>
              )}

            {
              user && user.bio && (
                <View style={styles.info}>

                  <Text style={styles.infoText}>{user && user.bio}</Text>
                </View>
              )
            }
          </View>

        </View>
      </View>
    </View>
  )
}

export default Profile

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  headerContainer: {
    marginHorizontal: wp(4),
    marginBottom: 20
  },
  headerShape: {
    width: wp(100),
    height: hp(20)
  },
  avatarContainer: {
    height: hp(12),
    width: hp(12),
    alignSelf: 'center'
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: -12,
    padding: 7,
    borderRadius: 50,
    backgroundColor: 'white',
    shadowColor: theme.colors.textLight,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 7
  },
  userName: {
    fontSize: hp(3),
    fontWeight: '500',
    color: theme.colors.textDark
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  infoText: {
    fontSize: hp(1.6),
    fontWeight: '500',
    color: theme.colors.textLight
  },
  logoutButton: {
    position: 'absolute',
    right: 0,
    padding: 5,
    borderRadius: theme.radius.sm,
    backgroundColor: '#fee2e2'
  },
  listStyle: {
    paddingHorizontal: wp(4),
    paddingBottom: 30,
  },
  noPosts: {
    fontSize: hp(2),
    textAlign: 'center',
    color: theme.colors.text
  }
})