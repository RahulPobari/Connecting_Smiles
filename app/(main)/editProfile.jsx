import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import { hp, wp } from '../../helpers/comman'
import { theme } from '../../components/theme'
import Header from '../../components/Header'
import { Image } from 'expo-image'
import Avatar from '../../components/Avatar'
import { useAuth } from '../../contexts/AuthContext'
import Icon from '../../assets/icons'
import Input from '../../components/Input'
import { getUserImageSrc, uploadFile } from '../../services/imageService'
import Button from '../../components/Button'
import { updateUser } from '../../services/userService'
import { router, useRouter } from 'expo-router'
import * as ImagePicker from 'expo-image-picker';


const editProfile = () => {
    const { user: currentUser, setUserData } = useAuth();
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const [user, setUser] = useState({
        name: '',
        phoneNumber: '',
        image: null,
        bio: '',
        address: ''
    });


    useEffect(() => {
        if (currentUser) {
            // console.log('Current User Data:', currentUser);

            const imagePath = currentUser.image || null;
            const publicImageSrc = getUserImageSrc(imagePath);

            setUser({
                name: currentUser.name || '',
                phoneNumber: currentUser.phoneNumber || '',
                image: publicImageSrc?.uri || null,
                address: currentUser.address || '',
                bio: currentUser.bio || ''
            });
        }
    }, [currentUser]);

    const onPickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });

        if (!result.canceled) {
            setUser((prevUser) => ({
                ...prevUser,
                image: result.assets[0].uri,
            }));
        }

    }

    const onSubmit = async () => {
        let userData = { ...user };
        let { name, phoneNumber, address, image, bio } = userData;

        if (!name || !phoneNumber || !address || !bio || !image) {
            Alert.alert('Profile', "Please fill all the fields");
            return;
        }
        setLoading(true);

        if (typeof image === 'string' && image.startsWith('file://')) {
            // console.log('Uploading image:', image);

            const imageRes = await uploadFile('profiles', image, true);

            if (imageRes.success) {
                userData.image = imageRes.data;
                setUser((prevUser) => ({
                    ...prevUser,
                    image: getUserImageSrc(imageRes.data).uri,
                }));
                // console.log('Uploaded Image Path:', imageRes.data);
            } else {
                // console.error('Image upload failed:', imageRes.msg);
                userData.image = null;
            }
        }
        const res = await updateUser(currentUser?.id, userData);

        if (res.success) {
            setUserData({ ...currentUser, ...userData });
            console.log('User profile updated successfully');
            router.back();
        } else {
            console.error('User update failed:', res);
        }

        setLoading(false);
    };

    let imageSource = null;
    if (user.image) {
        imageSource = { uri: user.image };
    }

    return (
        <ScreenWrapper bg="white">
            <View style={styles.container}>
                <ScrollView style={{ flex: 1 }}>
                    <Header title="Edit Profile" />

                    {/* FORM */}
                    <View style={styles.form}>
                        <View style={styles.avatarContainer}>
                            <Image source={imageSource || require('../../assets/images/defaultUser.png')} style={styles.avatar} />
                            <Pressable style={styles.cameraIcon} onPress={onPickImage}>
                                <Icon name="camera" strokewidth={2.5} size={20} />
                            </Pressable>
                        </View>
                        <Text style={{ fontSize: hp(1.5), color: theme.colors.text }}>
                            Please Fill you profile details
                        </Text>
                        <Input
                            icon={<Icon name="user" />}
                            placeholder='Enter your name'
                            value={user.name}
                            onChangeText={value => setUser({ ...user, name: value })}
                        />
                        <Input
                            icon={<Icon name="call" />}
                            placeholder='Enter your Phone Number'
                            value={user.phoneNumber}
                            onChangeText={value => setUser({ ...user, phoneNumber: value })}
                        />
                        <Input
                            icon={<Icon name="location" />}
                            placeholder='Enter your location'
                            value={user.address}
                            onChangeText={value => setUser({ ...user, address: value })}
                        />
                        <Input
                            placeholder='Enter your Bio'
                            value={user.bio}
                            multiline={true}
                            containerStyle={styles.bio}
                            onChangeText={value => setUser({ ...user, bio: value })}
                        />

                        <Button title='Update' loading={loading} onPress={onSubmit} />

                    </View>


                </ScrollView>
            </View>
            <View>


            </View>
        </ScreenWrapper>
    )
}

export default editProfile

const styles = StyleSheet.create({

    container: {
        flex: 1,
        paddingHorizontal: wp(4)
    },
    avatarContainer: {
        height: hp(14),
        width: hp(14),
        alignSelf: 'center'
    },
    avatar: {
        width: '100%',
        height: '100%',
        borderRadius: theme.radius.xxl * 1.8,
        borderCurve: 'continuous',
        borderWidth: 1,
        borderColor: theme.colors.darkLight,
    },
    cameraIcon: {
        position: 'absolute',
        bottom: 0,
        right: -10,
        padding: 8,
        borderRadius: 50,
        backgroundColor: 'white',
        shadowColor: theme.colors.textLight,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 5,
        elevation: 7
    },
    form: {
        gap: 18,
        marginTop: 20
    },
    input: {
        flexDirection: 'row',
        borderWidth: 0.4,
        borderColor: theme.colors.text,
        borderRadius: theme.radius.xxl,
        borderCurve: 'continuous',
        padding: 17,
        paddingHorizontal: 20,
        gap: 15
    },
    bio: {
        flexDirection: 'row',
        height: hp(15),
        alignItems: 'flex-start',
        paddingVertical: 15
    }


})


