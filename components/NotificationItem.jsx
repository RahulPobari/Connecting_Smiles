import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { theme } from './theme'
import { hp } from '../helpers/comman'
import { TouchableOpacity } from 'react-native'
import Avatar from './Avatar'
import moment from 'moment'
import { create } from 'react-test-renderer'

const NotificationItem = ({
    item,
    router
}) => {

    const handleClick = ()=>{
        /// open post detail
        let {postId, commentId} = JSON.parse(item?.data);
        router.push({pathname: 'postDetails', params: {postId, commentId}})
    }

    const createdAt = moment(item.createdAt).format('MMM D');
  return (
    <TouchableOpacity style={styles.container} onPress={handleClick}>
      <Avatar
      uri={item?.sender?.image}
      size={hp(5)}
      />

      <View style={styles.nameTitle}>
        <Text style={styles.text}>
            {
                item?.sender?.name
            }
        </Text>
        <Text style={[styles.text, {color: theme.colors.textDark}]}>
            {
                item?.title
            }
        </Text>
      </View>

      <Text style={[styles.text, {color: theme.colors.textLight}]}>
        {
            createdAt
        }
      </Text>
    </TouchableOpacity>
  )
}

export default NotificationItem

const styles = StyleSheet.create({

    container:{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        backgroundColor: 'white',
        borderWidth: 0.5,
        borderColor: theme.colors.darkLight,
        padding: 15,
        borderRadius: theme.radius.xxl,
        borderCurve: 'continuous'
    },

    nameTitle: {
        flex: 1,
        gap: 2
    },
    text: {
        fontSize: hp(1.6),
        fontWeight: theme.fonts.medium,
        color: theme.colors.text,
    }

})