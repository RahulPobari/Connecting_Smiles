import { View, Text, Button,ActivityIndicator } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'
// import { theme } from './theme'
import ScreenWrapper from '../components/ScreenWrapper'

const index = () => {
  const router = useRouter();
  
  return (
  
  <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
       <View style={{justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size={'large'} color={'#00C26F'} />
    </View>
  </View>
  )
}

export default index