import { Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import Header from '../../components/Header'
import { hp, wp } from '../../helpers/comman'
import { theme } from '../../components/theme'
import { useAuth } from '../../contexts/AuthContext'
import Avatar from '../../components/Avatar'
import RichTextEditor from '../../components/RichTextEditor'
import { useLocalSearchParams, useRouter } from 'expo-router'
import Icon from '../../assets/icons'
import Button from '../../components/Button'
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'react-native'
import { getSupabaseFileUrl } from '../../services/imageService'
import { Video } from 'expo-av'
import { createOrUpdatePost } from '../../services/postService'
// import { rgbaColor } from 'react-native-reanimated/lib/typescript/Colors'

const NewPost = () => {

  const post = useLocalSearchParams();
  // console.log("passed detail for edit",post);

  const user = useAuth();

  const bodyRef = useRef("");
  const editorRef = useRef(null);

  const router = useRouter();

  const [loading, setloading] = useState(false);
  const [file, setfile] = useState(file);

  useEffect(()=>{
      if(post && post?.id){
        bodyRef.current= post.body;
        setfile(post?.file || null);
        setTimeout(() =>{
          editorRef?.current?.setContentHTML(post.body);
        },300);
      }
  },[])


  const onPick = async (isImage) => {

    let mediaConfig = {
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4,3],
      quality: 0.7,
    }
    if (!isImage) {
      mediaConfig = {
        mediaTypes: ['videos'],
        allowsEditing: true,
      }
    }
    let result = await ImagePicker.launchImageLibraryAsync({ mediaConfig });
    

    // console.log('file', result.assets[0]  );
    if (!result.canceled) {
      setfile(result.assets[0]);
    }
  }

  const isLocalFile = file=>{
    if(!file) return null;
    if(typeof file == 'object') return true;

    return false;
  }
  const getFileType = file =>{
    if(!file) return null;
    if(isLocalFile(file)){
      return file.type;
    }

    // check for the remote file 

    if(file.includes('postImages')){
      return 'image';
    }

    return 'video';
  }

  const getFileUri = file =>{
    if(!file) return null;
    if(isLocalFile(file)){
      return file.uri;
    }

    return getSupabaseFileUrl(file)?.uri;
  }

  const onSubmit = async () => { 

    if(!bodyRef.current && !file){
      Alert.alert('Post','Please choose the image or add post text');
    }

    let data ={
      file,
      body: bodyRef.current,
      userId: user?.user.id,
    }

    if(post && post.id) data.id = post.id;

    //create post
    setloading(true);
    let res = await createOrUpdatePost(data);
    setloading(false);
    if(res.success){
      setfile(null);
      bodyRef.current='';
      editorRef.current?.setContentHTML('');
      router.back();
    }else{
      Alert.alert('Post', res.msg);
    }
  }

  // console.log(user?.user.id);
  return (
    <ScreenWrapper bg="white">
      <View style={styles.container}>
        <Header title="Create Post" />
        <ScrollView contentContainerStyle={{ gap: 20 }}>
          {/* AVTAR */}
          <View style={styles.header} >
            <Avatar
              uri={user?.user.image}
              size={hp(6.5)}
              rounded={theme.radius.xl}
            />
            <View style={{ gap: 2 }}>
              <Text style={styles.username}>
                {
                  user && user?.user.name
                }
              </Text>
              <Text style={styles.publicText}>
                Public
              </Text>
            </View>
          </View>
          <View style={styles.texteditor}>
            <RichTextEditor editorRef={editorRef} onChange={body => bodyRef.current = body} />
          </View>

          {
              file && (
                <View style={styles.file}>
                  {
                    getFileType(file) == 'video'?(
                      <Video 
                      style={{flex: 1}}
                      source={{
                        uri: getFileUri(file)
                      }}
                      useNativeControls
                      resizeMode='cover'
                      isLooping
                      />
                    ):(
                      <Image source={{uri: getFileUri(file)}} resizeMode='cover' style={{flex: 1}}/>
                    )
                  }

                  <Pressable style={styles.closeIcon} onPress={() => setfile(null)}>
                    <Icon name="delete" size={20} color="white" />
                  </Pressable>
                </View>
              )
          }

          <View style={styles.media}>
            <Text style={styles.addTextImage}>Add to your post</Text>
            <View style={styles.mediaIcons}>
              <TouchableOpacity onPress={() => onPick(true)}>
                <Icon name="image" size={30} color={theme.colors.dark} />
              </TouchableOpacity>
              {/* <TouchableOpacity onPress={() => onPick(false)}>
                <Icon name="video" size={33} color={theme.colors.dark} />
              </TouchableOpacity> */}
            </View>
          </View>
        </ScrollView>
 
        <Button
          buttonStyle={{ height: hp(6.2) }}
          title={post && post.id? "Update" : "Post"}
          loading={loading}
          hasShadow={false}
          onPress={onSubmit}
        />
      </View>
    </ScreenWrapper>
  )
}

export default NewPost

const styles = StyleSheet.create({

  container: {
    flex: 1,
    marginBottom: 30,
    paddingHorizontal: wp(4)
  },

  title: {
    fontSize: hp(2.5),
    fontWeight: theme.fonts.semibold,
    color: theme.colors.text,
    textAlign: 'center'

  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  username: {
    fontSize: hp(2.2),
    fontWeight: theme.fonts.semibold,
    color: theme.colors.text,
  },
  avatar: {
    height: hp(6.5),
    width: hp(6.5),
    borderRadius: theme.radius.xl,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  publicText: {
    fontSize: hp(1.7),
    fontWeight: theme.colors.textLight,
  },
  texteditor: {
    // marginTop: 10,
  },
  media: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderWidth: 1.5,
    padding: 12,
    paddingHorizontal: 18,
    borderRadius: theme.radius.xl,
    borderCurve: 'continuous',
    borderColor: theme.colors.gray
  },
  mediaIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15
  },
  addTextImage: {
    fontSize: hp(1.9),
    fontWeight: theme.fonts.semibold
  },
  imageIcon: {
    borderRadius: theme.radius.md,
  },
  file: {
    height: hp(30),
    width: '100%',
    borderRadius: theme.radius.xl,
    overflow: 'hidden',
    borderCurve: 'continuous'
  },
  video: {

  },
  closeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255,0,0, 0.6)',
    padding: 7,
    borderRadius: 50,

    },



})