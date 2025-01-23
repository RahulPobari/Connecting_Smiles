import { StyleSheet, Text, View, Image, TouchableOpacity, Pressable } from 'react-native';
import React from 'react'
import ScreenWrapper from '../components/ScreenWrapper'
import { StatusBar } from 'expo-status-bar'
import { hp, wp } from '../helpers/comman'
import { theme } from '../components/theme';
import Button from '../components/Button';
import { useRouter } from 'expo-router';
// import { Image } from 'react-native-web'

const Welcome = () => {

  const router = useRouter();

  return (
    <ScreenWrapper bg='white'>
      <StatusBar style="dark" />
      <View style={styles.container}>
        {/* WELCOME IMAGE  */}
        <Image style={styles.welcomeImage} resizeMode='contain' source={require('../assets/images/CampusMinds.png')} />

        {/* TITLE */}

        <View style={{ gap: 20 }}>
          <Text style={styles.title}>CampusMinds</Text>
          <Text style={styles.punchline}>
            "Welcome to CampusMinds – the ultimate space for sharing ideas, collaborating on projects, and celebrating moments. Whether you’re working on your next big concept or reliving unforgettable events, CampusMinds connects you with your college community to inspire, create, and innovate together."
          </Text>
        </View>

        {/* FOOTER  */}

        <View style={styles.footer}>
          <Button
            title="Getting Started"
            buttonStyle={{ marginHorizontal: wp(3) }}
            onPress={() => router.push('signUp')}
          />
          <View style={styles.bottomTextContainer}>
            <Text style={[styles.loginText, styles.btns]}>
              Already have an account!
            </Text>
            <Pressable onPress={() => router.push('login')}>
              <Text style={[styles.loginText, styles.btn]}>
                Login
              </Text>
            </Pressable>
          </View>

        </View>


      </View>
    </ScreenWrapper>


  )
}

export default Welcome

const styles = StyleSheet.create(
  {


    welcomeImage: {
      width: wp(100),
      height: hp(50),
      alignSelf: 'center'
    },

    container: {
      flex: 1,
      backgroundColor: 'white',
      justifyContent: 'space-around',
      paddingHorizontal: wp(4),
      alignItems: 'center'
    },
    title: {
      fontSize: hp(4),
      textAlign: 'center',
      color: theme.colors.text,
      fontWeight: theme.fonts.extraBold

    },
    punchline: {
      textAlign: 'justify',
      paddingHorizontal: wp(10),
      fontSize: hp(1.8),
      color: theme.colors.text
    },
    footer: {
      gap: 30,
      width: '100%'
    },
    bottomTextContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center'

    },
    btn: {
      marginLeft: '-30',
      color: theme.colors.primaryDark,
      fontWeight: theme.fonts.bold

    },
    btns: {
      marginRight: "40"
    },
    loginText: {
      textAlign: 'center',
      color: theme.colors.text,
      fontSize: hp(1.6)
    }

  }
)