import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { theme } from './theme'

const Loads = ({ size = "large", color = theme.colors.primary }) => {
  return (
    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size={size} color={color} />
    </View>
  )
}

export default Loads

const styles = StyleSheet.create({})    