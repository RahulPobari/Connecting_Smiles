import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { hp } from '../helpers/comman'
import { theme } from './theme'
import { Image } from 'expo-image'
import { getUserImageSrc } from '../services/imageService'
// import { ImageBackground,Image } from 'expo-image'
// import {Image} from 'expo-image'

const Avatar = (
  {
    uri,
    size = hp(4.5),
    rounded = theme.radius.md,
    style = {}
  }
) => {
  return (

    <Image
      source={getUserImageSrc(uri)}
      transition={100}
      style={[styles.avatar, { height: size, width: size, borderRadius: rounded }, style]}
    />

  )
}

export default Avatar

const styles = StyleSheet.create({
  avatar: {
    borderCurve: 'continuous',
    borderColor: theme.colors.darkLight,
    borderWidth: 1,
  }
})