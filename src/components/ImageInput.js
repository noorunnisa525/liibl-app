import React, {useState} from 'react';
import {TouchableOpacity} from 'react-native';
import {BottomSheet, ListItem} from 'react-native-elements';
import ImagePicker from 'react-native-image-crop-picker';

const ImageInput = props => {
  const {setUri, minFiles, multiple, children = null} = props;
  const [isVisible, setIsVisible] = useState(false);
  const list = [
    {
      title: 'Open Camera for Image',
      onPress: () => {
        ImagePicker.openCamera({
          width: 1000,
          height: 1000,
          compressImageMaxHeight: 900,
          compressImageMaxWidth: 900,
          compressImageQuality: 0.99,
          cropping: true,
          mediaType: 'photo',
          showCropGuidelines: false,
          cropperCircleOverlay: props.circle,
        }).then(image => {
          let obj = {};
          const newImageUri = 'file:/' + image.path.split('file:///').join('');
          obj['uri'] = newImageUri;
          obj['type'] = image.mime;
          obj['name'] = newImageUri.split('/').pop();
          setUri(obj);
          setIsVisible(false);
        });
      },
    },
    {
      title: 'Open Camera for Video',
      onPress: () => {
        ImagePicker.openCamera({
          width: 1000,
          height: 1000,
          compressImageMaxHeight: 900,
          compressImageMaxWidth: 900,
          compressImageQuality: 0.99,
          cropping: false,
          mediaType: 'video',
        }).then(image => {
          let obj = {};
          const newImageUri = 'file:/' + image.path.split('file:///').join('');
          obj['uri'] = newImageUri;
          obj['type'] = image.mime;
          obj['name'] = newImageUri.split('/').pop();
          setUri(obj);
          setIsVisible(false);
        });
      },
    },
    {
      title: 'Choose Gallery',
      onPress: () =>
        ImagePicker.openPicker({
          width: 1000,
          height: 1000,
          compressImageMaxHeight: 900,
          compressImageMaxWidth: 900,
          cropping: props.cropping,
          mediaType: 'all',
          showCropGuidelines: false,
          cropperCircleOverlay: true,
        }).then(image => {
          let obj = {};
          const newImageUri = 'file:/' + image.path.split('file:///').join('');
          obj['uri'] = newImageUri;
          obj['type'] = image.mime;
          obj['name'] = newImageUri.split('/').pop();
          setUri(obj);
          setIsVisible(false);
        }),
    },
    {
      title: 'Cancel',
      containerStyle: {backgroundColor: 'white'},
      onPress: () => setIsVisible(false),
    },
  ];
  return (
    <>
      <TouchableOpacity onPress={() => setIsVisible(true)}>
        {children}
      </TouchableOpacity>
      <BottomSheet isVisible={isVisible}>
        {list.map((l, i) => (
          <ListItem
            key={i}
            containerStyle={l.containerStyle}
            onPress={l.onPress}>
            <ListItem.Content>
              <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
            </ListItem.Content>
          </ListItem>
        ))}
      </BottomSheet>
    </>
  );
};

export default ImageInput;
