import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { createComment, fetchPostDetails, removeComment, removePost } from '../../services/postService';
import { hp, wp } from '../../helpers/comman';
import { theme } from '../../components/theme';
import PostCard from '../../components/PostCard';
import { useAuth } from '../../contexts/AuthContext';
import Loads from '../../components/Loads';
import Input from '../../components/Input';
import Icon from '../../assets/icons';
import CommentItem from '../../components/commetItem';
import ScreenWrapper from '../../components/ScreenWrapper';
import { supabase } from '../../lib/supabase';
import { getUserData } from '../../services/userService';
import { createNotification } from '../../services/notificationService';

const PostDetails = () => {
  const { postId, commentId } = useLocalSearchParams();
  const { user } = useAuth();
  const router = useRouter();
  const [startLoading, setStartLoading] = useState(true);
  const inputRef = useRef(null);
  const commentRef = useRef('');
  const [loading, setLoading] = useState(false);

  const [post, setPost] = useState(null);


  const handleNewComment = async (payload) => {
    if (payload.new) {
      console.log('New comment added:', payload.new);
      let newComment = { ...payload.new };
  
      let res = await getUserData(newComment.userId);
      newComment.user = res.success ? res.data : {};
  
      setPost((prevPost) => {
        return {
          ...prevPost,
          comments: prevPost?.comments ? [newComment, ...prevPost.comments] : [newComment],
        };
      });
    } else {
      console.error('Payload does not contain a new comment');
    }
  };
  
  useEffect(() => {
    let CommentChannel = supabase
      .channel('comments')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'comments',
        filter: `postId=eq.${postId}`,
      }, handleNewComment)
      .subscribe();
  
    getPostDetails();
  
    return () => {
      supabase.removeChannel(CommentChannel);
    };
  }, []);
  

  const getPostDetails = async () => {
    //fetch the post details 
    let res = await fetchPostDetails(postId);
    // console.log('post details ', res.data);
    if (res.success) setPost(res.data);
    setStartLoading(false);
  }


  const onNewComment = async () => {
    if (!commentRef.current) return null;
    let data = {
      userId: user?.id,
      postId: post?.id,
      text: commentRef.current
    }



    // create comment
    setLoading(true);
    let res = await createComment(data);
    console.log(data?.userId);
    setLoading(false);
    if (res.success) {

      if(user.id!=post.userId){
        // send notifcation 
        let notify = {
          senderId: user.id,
          receiverId: post.userId,
          title: "Comment on your post",
          data: JSON.stringify({postId: post.id, commentId: res?.data?.id})
        }
        createNotification(notify);
      }


      inputRef?.current?.clear();
      commentRef.current = "";
    }
    else {
      Alert.alert('Error creating comment');
    }
  }

  const onDeletePost = async (item) =>{
    //delete post
    let res = await removePost(post?.id);
    if(res.success){
      router.back();
    }
    else{
      Alert.alert('Error deleting post');
    }
  }

  const onEditPost = async (item) =>{
    router.back();
    router.push({pathname: 'newPost', params: {...item}});
  }

  if (startLoading) {
    return (
      <View style={styles.center}>
        <Loads />
      </View>
    )
  }

  if (!post) {
    <View style={[styles.center, { justifyContent: 'flex-start', marginTop: 100 }]}>
      <Text style={styles.notFound}>
        Post Not Found!
      </Text>
    </View>
  }

  const onDeleteComment = async (comment) => {
    // console.log("comment delete: " , comment);
    let res = await removeComment(comment?.id);
    if (res.success) {
      // console.log("comment deleted");
      setPost(prevPost => {
        let updatedPost = { ...prevPost };
        updatedPost.comments = updatedPost.comments.filter(c => c.id != comment.id);
        return updatedPost;
      })
    }
    else {
      Alert.alert('Error deleting comment');
    }
  }


 
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
          <PostCard
            item={{ ...post, comments: [{ count: post?.comments?.length }] }}
            currentUser={user}
            router={router}
            hasShadow={false}
            showMoreIcon= {false}
            showDelete={true}
            onDelete={onDeletePost}
            onEdit={onEditPost}
          />

          {/* Comment Input */}

          <View style={styles.inputContainer}>
            <Input
              inputRef={inputRef}
              placeholder="Type comment..."
              onChangeText={value => commentRef.current = value}
              placeholderTextColor={theme.colors.textLight}
              containerStyle={{ flex: 1, height: hp(6.2), borderRadius: theme.radius.xl }}
            />

            {
              loading ? (
                <View style={styles.loading}>
                  <Loads size='small' />
                </View>
              ) : (
                <TouchableOpacity style={styles.sendIcon} onPress={onNewComment}>
                  <Icon name="send" color={theme.colors.primaryDark} />
                </TouchableOpacity>
              )
            }
          </View>

          {/* COMMMETS LIST */}

          <View style={{ marginVertical: 15, gap: 17 }}>
            {
              post?.comments?.map(comment =>
                <CommentItem
                  key={comment?.id?.toString()}
                  item={comment}
                  onDelete={onDeleteComment}
                  highlight = {comment.id == commentId}
                  canDelete={user.id == comment.userId || user.id == post.userId}
                />
              )
            }

            {
              post?.comments?.length == 0 && (
                <Text style={{ color: theme.colors.text, marginLeft: 5 }}>
                  Be first to Comment!
                </Text>
              )
            }
          </View>

        </ScrollView>
      </View>
    </ScreenWrapper>
  )
}

export default PostDetails

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingVertical: wp(4)
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  list: {
    paddingHorizontal: wp(4),
  },
  sendIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.8,
    borderColor: theme.colors.primary,
    borderRadius: theme.radius.lg,
    borderCurve: 'continuous',
    height: hp(5.8),
    width: hp(5.8),
  },
  center: {
    flex: 1,
    justifyContent: 'center',
  },
  notFound: {
    fontSize: hp(2.5),
    color: theme.colors.text,
    fontWeight: theme.fonts.medium
  },
  loading: {
    height: hp(5.8),
    width: hp(5.8),
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ scale: 1.3 }]
  }

})