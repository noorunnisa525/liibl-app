import React from 'react';
import {StyleSheet} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Dialog} from 'react-native-simple-dialogs';
import {useThemeAwareObject} from '../theme';

function DialogModal(props) {
  const createStyles = theme => {
    const themeStyles = StyleSheet.create({
      dialogStyle: {
        backgroundColor: theme.color.textWhite,
        borderRadius: theme.borders.radius2,
      },
    });
    return themeStyles;
  };
  const styles = useThemeAwareObject(createStyles);
  return (
    <KeyboardAwareScrollView keyboardShouldPersistTaps="always">
      <Dialog
        keyboardShouldPersistTaps={'always'}
        dialogStyle={[styles.dialogStyle, props.dialogStyle]}
        contentStyle={props.contentStyle}
        onTouchOutside={props.onPress}
        visible={props.visible}
        onRequestClose={props.onPress}>
        {props.children}
      </Dialog>
    </KeyboardAwareScrollView>
  );
}

export default DialogModal;
