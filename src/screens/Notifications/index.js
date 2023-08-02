import React, {useRef, useEffect, useState} from 'react';
import {
  ScrollView,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Image,
} from 'react-native';
import Button from '../../components/CustomButton';
import Header from '../../components/CustomHeader';
import Text from '../../components/CustomText';
import {useThemeAwareObject} from '../../theme/index';
import createStyles from './styles';
import {noNotificationSvg as NotificationSvg} from '../../../assets/Icons/Svgs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ManageCard from '../../components/ManageCards';
import Snackbar from 'react-native-snackbar';
import {useSelector} from 'react-redux';
import DialogModal from '../../components/DialogModal';
import FastImage from 'react-native-fast-image';
import {useIsFocused} from '@react-navigation/native';
import {get_notification, get_user_cards} from '../../services/api-confog';
import {usePostApiMutation} from '../../services/service';
import moment from 'moment';
import {baseUrl} from '../../constants';
import {wp} from '../../util';
function ManageCards({navigation}) {
  const styles = useThemeAwareObject(createStyles);
  const isFocused = useIsFocused();
  const [notificationCall, notificationResponse] = usePostApiMutation();
  const [notifications, setNotifications] = useState([]);
  const token = useSelector(state => state.user.token);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    if (isFocused) {
      getNotification();
    }
  }, [isFocused]);

  useEffect(() => {
    onRefresh();
  }, []);

  const onRefresh = () => {
    setIsFetching(false);
  };

  async function getNotification() {
    let apiData = {
      url: get_notification,
      method: 'GET',
      token,
    };
    try {
      let res = await notificationCall(apiData).unwrap();
      if (res.status == 200) {
        setNotifications(res.data);
      } else {
        Snackbar.show({
          text: res?.message,
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    } catch (e) {}
  }

  function renderCards({item}) {
    return (
      <TouchableOpacity
        style={styles.notificationContainer}
        activeOpacity={
          item.type == 'accept job invite' ||
          item.type == 'cancel job' ||
          item.type == 'employee job review' ||
          item.type == 'send proposal'
            ? 0.4
            : 1
        }
        onPress={() => {
          if (item.type == 'accept job invite') {
            navigation.navigate('ActiveJobDetails', {
              id: item.job_id,
            });
          } else if (item.type == 'cancel job') {
            navigation.navigate('CompleteJobDetails', {
              id: item.job_id,
              status: item.job.status,
            });
          } else if (item.type == 'employee job review') {
            navigation.navigate('CompleteJobDetails', {
              id: item.job_id,
              status: item.job.status,
            });
          } else if (item.type == 'send proposal') {
            navigation.navigate('Proposals', {
              id: item.job_id,
            });
          } else {
          }
        }}>
        <View style={styles.topView}>
          <View style={styles.imageContainer}>
            <Image
              style={styles.imageStyle}
              source={
                item?.sender?.image
                  ? {uri: baseUrl.base + '/' + item?.sender?.image}
                  : require('../../components/ImagePicker/Icons/avatar-placeholder.png')
              }
            />
          </View>
          <View style={styles.rightContainer}>
            <Text style={styles.notifText}>{item?.notification_text}</Text>
            <Text numberOfLines={1} style={styles.timeText}>
              {moment(item.created_at).fromNow()}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  const renderEmptyContainer = () => {
    return (
      <View style={styles.activityView}>
        <NotificationSvg />
        <Text style={styles.emptyMessageStyle}>No notification available</Text>
      </View>
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
        leftComponent={
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => {
              navigation.goBack();
            }}>
            <MaterialIcons
              name={'keyboard-arrow-left'}
              size={wp(7)}
              color={'black'}
              onPress={() => {
                navigation.goBack();
              }}
            />
          </TouchableOpacity>
        }
        centerComponent={
          <Text style={styles.headerInitialText}>Notifications</Text>
        }
      />
      {notificationResponse.isLoading ? (
        <View style={styles.activityView}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlatList
          contentContainerStyle={styles.container}
          data={notifications}
          renderItem={renderCards}
          keyExtractor={item => item.id}
          ListEmptyComponent={renderEmptyContainer}
          showsVerticalScrollIndicator={false}
          refreshing={isFetching}
          onRefresh={getNotification}
          ListFooterComponent={() => null}
          ListFooterComponentStyle={styles.footerStyle}
        />
      )}
    </View>
  );
}

export default ManageCards;
