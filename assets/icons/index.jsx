// import { View, Text } from 'react-native'
// import React from 'react'
// import Home from './Home';
// import Mail from './Mail';
// import Lock from './Lock';
// import User from './User';
// import Heart from './Heart';
// import Plus from './Plus';
// import Search from './Search';
// import Location from './Location';
// import Call from './Call';
// // import { theme } from '../../constants/theme';
// import Camera from './Camera';
// import Edit from './Edit';
// import ArrowLeft from './ArrowLeft';
// import ThreeDotsCircle from './ThreeDotsCircle';
// import ThreeDotsHorizontal from './ThreeDotsHorizontal';
// import Comment from './Comment';
// import Share from './Share';
// import Send from './Send';
// import Delete from './Delete';
// import Logout from './logout';
// import Image from './Image';
// import Video from './Video';
// import { theme } from '../../components/theme';

// // import { theme } from '../components/theme';

// const icons = {
//     home: Home,
// mail: Mail,
// lock: Lock,
// user: User,
// }

// const Icon = ({name, ...props}) => {
//     const IconComponent = icons[name];
//   return (
//     <IconComponent
//         height={props.size || 24}
//         width={props.size || 24}
//         strokeWidth={props.strokeWidth || 1.9}
//         // color={theme.colors}
//         // color={theme.colors.textLight}
//         // color={theme.colors.textLight}
//         color={theme.colors.textLight}
//         {...props}
//     />
//   )
// }

// export default Icon;


import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Home from './Home'
import ArrowLeft from './ArrowLeft'
import { theme } from '../../components/theme'
import Mail from './Mail'
import Lock from './Lock'
import User from './User'
import Heart from './Heart'
import Plus from './Plus'
import Search from './Search'
import Call from './Call'
import Camera from './Camera'
import Edit from './Edit'
import ThreeDotsCircle from './ThreeDotsCircle'
import ThreeDotsHorizontal from './ThreeDotsHorizontal'
import Comment from './Comment'
import Share from './Share'
import Send from './Send'
import Delete from './Delete'
import Logout from './logout'
import Image from './Image'
import Video from './Video'
import Location from './Location'

const icons = {
  home: Home,
  mail: Mail,
  lock: Lock,
  user: User,
  heart: Heart,
  heart: Heart,
  plus: Plus,
  search: Search,
  location: Location,
  call: Call,
  camera: Camera,
  edit: Edit,
  arrowLeft: ArrowLeft,
  threeDotsCircle: ThreeDotsCircle,
  threeDotsHorizontal: ThreeDotsHorizontal,
  comment: Comment,
  share: Share,
  send: Send,
  delete: Delete,
  logout: Logout,
  image: Image,
  video: Video,




}

const Icon = ({ name, ...props }) => {
  const IconComponent = icons[name];
  return (
    <View>
      <IconComponent
        height={props.size || 24}
        width={props.size || 24}
        strokeWidth={props.strokeWidth || 1.9}
        color={theme.colors.textLight}
        {...props}
      />
    </View>
  )
}

export default Icon

const styles = StyleSheet.create({})