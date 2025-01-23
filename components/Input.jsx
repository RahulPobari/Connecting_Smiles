import { StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import { theme } from './theme'
import { hp } from '../helpers/comman'

const Input = (props) => {
  return (
    <View style={[styles.container, props.containerStyle && props.containerStyle]}>

      {
        props.icon && props.icon
      }
      <TextInput
        style={{ flex: 1 }}
        placeholderTextColor={theme.colors.textLight}
        ref={props.inputRef && props.inputRef}
        {...props}
      ></TextInput>
    </View>

  )
}

export default Input

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.4,
    borderColor: theme.colors.text,
    borderRadius: theme.radius.xxl,
    borderCurve: 'continuous',
    paddingHorizontal: 18,
    gap: 12,
    height: hp(7.2)
  },
})   