import React, {useState} from 'react';
import {
  ImageBackground,
  Pressable,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Modal from 'react-native-modal';
import {cameraSvg as CameraSvg} from '../../../assets/Icons/Svgs';
import avatarImage from '../../../assets/images/Avatar.png';
import {useThemeAwareObject} from '../../theme';
import {hp, wp} from '../../util';
import Text from '../CustomText';
import {CameraIcon, ImageIcon} from './Icons/Index';
const ImageCropPicker = props => {
  const createStyles = theme => {
    const themeStyles = StyleSheet.create({
      avatarImage: {
        marginRight: wp(5),
      },

      options: {
        backgroundColor: theme.color.textWhite,
        flexDirection: 'row',
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
      },
      option: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      avatar: {
        height: hp(15),
        width: hp(15),
        borderRadius: hp(15),
        // padding: 20,
      },
      editIconContainer: {
        borderWidth: 1,
        borderColor: theme.color.textWhite,
        alignItems: 'center',
        justifyContent: 'center',
        width: wp(8),
        height: hp(4),
        backgroundColor: theme.color.textBlack,
        borderRadius: hp(10),
        flexDirection: 'row',
        position: 'absolute', //Here is the trick
        bottom: 0, //Here is the trick
        right: 1,
      },
      imageStyle: {
        borderRadius: hp(13),
        backgroundColor: 'black',
        borderColor: theme.color.textGray,
        borderWidth: hp(0.5),
      },
      avatarImageStyle: {
        width: hp(13),
        height: hp(13),
        backgroundColor: theme.color.dividerColor,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: hp(10),
        borderColor: theme.color.dividerColor,
        borderWidth: hp(1),
      },
    });
    return themeStyles;
  };
  const styles = useThemeAwareObject(createStyles);

  const [uri, setUri] = useState(props.source?.uri || props?.uri);

  const [visible, setVisible] = useState(false);
  const close = () => {
    setVisible(false), props.setMediaOpen(false);
  };
  const open = () => {
    setVisible(true);
  };
  const chooseImage = () => {
    ImagePicker.openPicker({
      width: 1000,
      height: 1000,
      compressImageMaxHeight: 900,
      compressImageMaxWidth: 900,
      compressImageQuality: 0.99,
      cropping: true,
      mediaType: props.mediaType ? 'all' : false,
      multiple: props.multipleMedia ? true : false,
    })
      .then(image => {
        let obj = {};
        const newImageUri = 'file:/' + image.path.split('file:///').join('');
        obj['uri'] = newImageUri;
        obj['type'] = image.mime;
        obj['name'] = newImageUri.split('/').pop();
        props.onChange(obj);
        setUri(image.path);
      })
      .finally(close);
  };

  const openCamera = () => {
    ImagePicker.openCamera({
      width: 1000,
      height: 1000,
      compressImageMaxHeight: 900,
      compressImageMaxWidth: 900,
      compressImageQuality: 0.99,
      cropping: true,
    })
      .then(image => {
        let obj = {};
        const newImageUri = 'file:/' + image.path.split('file:///').join('');
        obj['uri'] = newImageUri;
        obj['type'] = image.mime;
        obj['name'] = newImageUri.split('/').pop();
        props.onChange(obj);
        setUri(image.path);
      })
      .finally(close);
  };
  return (
    <>
      <View>
        {/* {props?.uri ? ( */}
        <ImageBackground
          // resizeMode="contain"
          style={styles.avatar}
          imageStyle={styles.imageStyle}
          {...props}
          source={uri ? {uri} : avatarImage}>
          <TouchableOpacity onPress={open} style={styles.editIconContainer}>
            <CameraSvg onPressCamera={open} />
          </TouchableOpacity>
        </ImageBackground>
      </View>
      <Modal
        isVisible={props.mediaOpen == true ? true : visible ? true : false}
        onBackButtonPress={close}
        onBackdropPress={close}
        style={{justifyContent: 'flex-end', margin: 0}}>
        <SafeAreaView style={styles.options}>
          <Pressable style={styles.option} onPress={chooseImage}>
            <ImageIcon />
            <Text>Library </Text>
          </Pressable>
          {props.camera ? (
            <Pressable style={styles.option} onPress={openCamera}>
              <CameraIcon />
              <Text>Camera</Text>
            </Pressable>
          ) : null}
        </SafeAreaView>
      </Modal>
    </>
  );
};

export default ImageCropPicker;
