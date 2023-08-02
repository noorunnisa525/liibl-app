import React, {useEffect, useState} from 'react';
import {FlatList, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import ReactNativeModal from 'react-native-modal';
import OneSignal from 'react-native-onesignal';
import Snackbar from 'react-native-snackbar';
import {WebView} from 'react-native-webview';
import {useDispatch, useSelector} from 'react-redux';
import AccountCard from '../../components/AccountCard';
import Button from '../../components/CustomButton';
import Text from '../../components/CustomText';
import DialogModal from '../../components/DialogModal';
import Header from '../../components/LoggedInHeader';
import {baseUrl} from '../../constants';
import {accountsData} from '../../data/newMemory';
import {onLogin, setTempToken, setToken} from '../../redux/slices/userSlice';
import {useThemeAwareObject} from '../../theme/index';
import {hp} from '../../util';
import createStyles from './styles';

const Account = ({navigation}) => {
  const currentUserData = useSelector(state => state.user.currentUserData);
  const profileImage = currentUserData?.image;
  const styles = useThemeAwareObject(createStyles);
  const [isFetching, setIsFetching] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [dialog, setDialog] = useState(false);
  const [webUri, setWebUri] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    onRefresh();
  }, []);

  useEffect(() => {}, [openModal]);

  const onRefresh = () => {
    setIsFetching(false);
  };
  const renderEmptyContainer = () => {
    return (
      <View style={styles.emptyListStyle}>
        {!isFetching && <Text style={styles.emptyMessageStyle}></Text>}
      </View>
    );
  };

  const renderAccount = ({item}) => {
    return (
      <AccountCard
        viewProposals
        name={item?.name}
        img={item?.photo}
        onPressIcon={() => {
          if (item.name === 'Logout') {
            setOpenModal(true);
          } else if (item.name === 'Privacy Policy') {
            setDialog(true);
            setWebUri('https://liibl.stackup.solutions/privacy_policy');
          } else if (item.name === 'Terms of Service') {
            setDialog(true);
            setWebUri('https://liibl.stackup.solutions/terms-conditions');
          } else {
            if (item.name == 'Change Password') {
              if (currentUserData?.social_platform) {
                Snackbar.show({
                  text: 'This is a social account. Cannot change password',
                  duration: Snackbar.LENGTH_SHORT,
                  backgroundColor: 'red',
                });
              } else {
                navigation.navigate(item.onPress);
              }
            } else {
              navigation.navigate(item.onPress);
            }
          }
        }}
      />
    );
  };

  return (
    <View style={styles.mainContainer}>
      <Header
        placement={'center'}
        barStyle={'dark-content'}
        containerStyle={styles.headerContainerStyle}
        backgroundColor={styles.headerColor}
        statusBarProps={styles.headerColor}
      />
      <View style={styles.subContainer}>
        <View style={styles.profileContainer}>
          <FastImage
            style={styles.imgStyle}
            source={
              profileImage
                ? {uri: baseUrl.base + '/' + profileImage}
                : require('../../components/ImagePicker/Icons/avatar-placeholder.png')
            }
          />
          <View style={styles.nameContainer}>
            <Text style={styles.nameText}>{currentUserData?.name}</Text>
            <Text style={styles.emailText}>{currentUserData?.email}</Text>
            <Button
              style={[styles.viewProfile, styles.viewProfileText]}
              title1="View Profile"
              onPress={() => navigation.navigate('ViewProfile')}
            />
          </View>
        </View>
      </View>
      <FlatList
        contentContainerStyle={styles.scrollViewStyle}
        data={accountsData}
        renderItem={renderAccount}
        keyExtractor={item => item?.name}
        ListEmptyComponent={renderEmptyContainer}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        ListFooterComponent={() => {
          return <View style={{height: hp(10)}}></View>;
        }}
      />
      <DialogModal
        visible={openModal}
        dialogStyle={styles.dialogStyle}
        children={
          <>
            <FastImage
              resizeMode="cover"
              style={styles.thumbStyle}
              source={require('../../../assets/images/tick-circle.png')}
            />
            <Text style={styles.responseText}>
              Are you sure you want to logout from the App?
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Button
                style={[styles.cancelModalButton, styles.modalText]}
                title1="No"
                onPress={() => setOpenModal(false)}
              />
              <Button
                style={[styles.acceptModalButton, styles.modalText]}
                title1="Yes"
                onPress={() => {
                  setOpenModal(false);
                  OneSignal.removeExternalUserId();
                  dispatch(setToken(false));
                  dispatch(setTempToken(false));
                  dispatch(onLogin(false));
                }}
              />
            </View>
          </>
        }
      />
      <ReactNativeModal
        isVisible={dialog}
        onBackdropPress={() => setDialog(false)}
        onBackButtonPress={() => setDialog(false)}
        onRequestClose={() => setDialog(false)}
        hasBackdrop
        backdropOpacity={0.7}
        backdropColor="rgb(0,0,0)"
        style={styles.webModal}>
        <WebView source={{uri: webUri}} startInLoadingState />
      </ReactNativeModal>
    </View>
  );
};

export default Account;
