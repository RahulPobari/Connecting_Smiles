import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Icon from '../assets/icons'
import { theme } from './theme'

const BackButton = ({ size = 26, router }) => {
  return (
    <View>
      <Pressable onPress={() => router.back()} style={styles.btn}>
        <Icon name="arrowLeft" strokeWidth={2.5} size={size} color={theme.colors.text} />
      </Pressable>
    </View>
  )
}

export default BackButton

const styles = StyleSheet.create({

  btn: {
    alignSelf: 'flex-start',
    padding: 5,
    borderRadius: theme.radius.sm,
    backgroundColor: 'rgba(0,0,0,0.07)'
  }
})