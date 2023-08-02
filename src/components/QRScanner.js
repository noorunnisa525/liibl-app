import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  StatusBar,
  TouchableOpacity,
  Text,
  Button,
} from 'react-native';
import {useThemeAwareObject} from '../theme';
import {hp, wp} from '../util';
import FastImage from 'react-native-fast-image';
import QRCodeScanner from 'react-native-qrcode-scanner';
const QrScaneer = props => {
  const createStyles = theme => {
    const themeStyles = StyleSheet.create({
      scrollView: {
        backgroundColor: theme.color.dividerColor,
      },
      body: {
        backgroundColor: theme.color.textWhite,
      },
      sectionContainer: {
        marginTop: hp(2),
        width: hp(50),
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        height: hp(65),
        borderRadius: hp(5),
      },
      resultConatiner: {
        marginTop: hp(2),
        width: hp(50),
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        // height: hp(20),
        borderRadius: hp(5),
      },
      imgConatiner: {
        marginTop: hp(2),
        width: hp(50),
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        height: hp(25),
        borderRadius: hp(5),
      },
      sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: theme.color.textBlack,
      },
      sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
        color: theme.color.textBlack,
      },
      highlight: {
        fontWeight: '700',
      },
      footer: {
        color: theme.color.textBlack,
        fontSize: 12,
        fontWeight: '600',
        padding: 4,
        paddingRight: 12,
        textAlign: 'right',
      },
      centerText: {
        flex: 1,
        fontSize: 18,
        // padding: 32,
        color: '#777',
      },
      textBold: {
        fontWeight: '500',
        color: '#000',
      },
      buttonText: {
        fontSize: theme.size.xsmall,
        // color: 'rgb(0,122,255)',
        color: theme.color.textWhite,
      },
      buttonTouchable: {
        padding: 16,
      },
      thumbStyle: {
        height: hp(25),
        width: hp(25),
        borderRadius: hp(2),
        borderTopColor: 'red',
        // borderWidth: hp(0.75),
        alignSelf: 'center',
        // borderColor: '#3DB249',
        // backgroundColor: '#3DB249',
        // padding: 20,
      },
    });

    return themeStyles;
  };
  const styles = useThemeAwareObject(createStyles);
  // const [result, setResult] = useState();
  const [scan, setScan] = useState(props.setScan);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <View style={styles.body}>
            {!props.scan && (
              <View style={styles.imgConatiner}>
                <TouchableOpacity onPress={() => props.setScan(true)}>
                  <FastImage
                    resizeMode="contain"
                    style={styles.thumbStyle}
                    source={require('../../assets/images/scanQr.png')}
                  />
                </TouchableOpacity>
              </View>
            )}
            {props.scan && (
              <View style={styles.sectionContainer}>
                <QRCodeScanner
                  reactivate={true}
                  showMarker={true}
                  onRead={e => props.setResult(e)}
                  bottomContent={
                    <TouchableOpacity
                      style={styles.buttonTouchable}
                      onPress={() => props.setScan(false)}>
                      <Text style={styles.buttonText}>Cancel Scan</Text>
                    </TouchableOpacity>
                  }
                />
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default QrScaneer;
