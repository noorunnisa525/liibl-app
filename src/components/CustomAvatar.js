import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {useThemeAwareObject} from '../theme';
import {Avatar} from 'react-native-elements';
import AvatarImage from './ImagePicker/Icons/avatar-placeholder.png';
import {hp} from '../util';
function CustomAvatar(props) {
  const createStyles = theme => {
    const themeStyles = StyleSheet.create({
      avatarContainer: {
        backgroundColor: theme.color.avatarColor,
        borderColor: theme.color.textWhite,
        borderWidth: hp('0.25'),
      },
      accessoryBackgroundColor: {backgroundColor: theme.color.backgroundColor},
    });
    return themeStyles;
  };
  const styles = useThemeAwareObject(createStyles);
  return props.image == null ? (
    <TouchableOpacity onPress={props.onPressAvatar} disabled={props.disabled}>
      <Avatar
        source={require('./ImagePicker/Icons/avatar-placeholder.png')}
        rounded
        size={props.size}
        containerStyle={[styles.avatarContainer, props.avatarContainer]}>
        {props.acessory == null ? null : (
          <Avatar.Accessory size={30} style={styles.accessoryBackgroundColor} />
        )}
      </Avatar>
    </TouchableOpacity>
  ) : (
    <TouchableOpacity onPress={props.onPressAvatar} disabled={props.disabled}>
      <Avatar
        source={{
          uri: props.image,
        }}
        rounded
        size={props.size}
        containerStyle={[styles.avatarContainer, props.avatarContainer]}>
        {props.acessory == null ? null : (
          <Avatar.Accessory size={30} style={styles.accessoryBackgroundColor} />
        )}
      </Avatar>
    </TouchableOpacity>
  );
}

export default CustomAvatar;
