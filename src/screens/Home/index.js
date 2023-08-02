import {useIsFocused, useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
  View,
} from 'react-native';
import OneSignal from 'react-native-onesignal';
import {useDispatch, useSelector} from 'react-redux';
import Geolocation from 'react-native-geolocation-service';
import {
  filterSvg as FilterSvg,
  gridActiveSvg as GridActiveSvg,
  gridSvg as GridSvg,
  mapActiveSvg as MapActiveSvg,
  mapSvg as MapSvg,
  noPeopleSvg as NoPeople,
} from '../../../assets/Icons/Svgs';
import Text from '../../components/CustomText';
import GoogleMaps from '../../components/GoogleMaps';
import Header from '../../components/LoggedInHeader';
import ProfileCard from '../../components/ProfileCard';
import SearchBar from '../../components/SearchBar';
import {
  setGetEmployees,
  setGetFilteredEmployees,
} from '../../redux/slices/userSlice';
import {get_employees} from '../../services/api-confog';
import {usePostApiMutation} from '../../services/service';
import {useThemeAwareObject} from '../../theme/index';
import {hp} from '../../util';
import createStyles from './styles';

function Home({navigation}) {
  const styles = useThemeAwareObject(createStyles);
  const route = useRoute();
  let subValue = null,
    categoryValue = null,
    rating = null,
    distance = null;
  if (route?.params?.filter) {
    subValue = route.params.subValue;
    categoryValue = route.params.categoryValue;
    rating = route.params.rating;
    distance = route.params.distance;
  } else {
    subValue = null;
    categoryValue = null;
    rating = null;
    distance = null;
  }

  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(true);
  const [profileModal, toggleModal] = useState(false);
  const [activeSvg, setIsActiveSvg] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  const [locationPermission, setPermission] = useState(false);
  const [getEmployees, getEmployeesReponse] = usePostApiMutation();
  const dispatch = useDispatch();
  const profilesData = useSelector(state => state.user.getFilteredEmployees);
  const [searchFilterData, setSearchFilterData] = useState([]);
  const [searchFilter, setSearchFilter] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const token = useSelector(state => state.user.token);

  useEffect(() => {
    if (!route?.params?.filter) {
      setSearchFilter(false);
    }
  }, [route?.params?.filter]);

  useEffect(() => {
    hasLocationPermission();
    if (locationPermission) {
      getLocation();
    }
  }, [locationPermission]);

  const getLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        if (position?.coords?.latitude) {
          setLatitude(position?.coords?.latitude);
          setLongitude(position?.coords?.longitude);
          let lat = position?.coords?.latitude;
          let lng = position?.coords?.longitude;
        }
      },
      error => {},
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  async function hasLocationPermission() {
    if (Platform.OS === 'ios') {
      const hasPermission = await hasPermissionIOS();
      return hasPermission;
    }

    if (Platform.OS === 'android' && Platform.Version < 23) {
      return true;
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (hasPermission) {
      setPermission(true);
      return true;
    }

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      setPermission(true);
      return true;
    }

    if (status === PermissionsAndroid.RESULTS.DENIED) {
      setPermission(false);
      hasLocationPermission();
      // ToastAndroid.show(
      //   'Location permission denied by user.',
      //   ToastAndroid.LONG,
      // );
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      hasLocationPermission();
      // ToastAndroid.show(
      //   'Location permission revoked by user.',
      //   ToastAndroid.LONG,
      // );
    }
    return false;
  }
  async function hasPermissionIOS() {
    const openSetting = () => {
      Linking.openSettings().catch(() => {
        Alert.alert('Unable to open settings');
      });
    };
    const status = await Geolocation.requestAuthorization('whenInUse');

    if (status === 'granted') {
      setPermission(true);
      return true;
    }

    if (status === 'denied') {
      setPermission(false);
      hasPermissionIOS();
      Alert.alert('Location permission denied');
    }

    if (status === 'disabled') {
      hasPermissionIOS();
      setPermission(false);
      Alert.alert(
        `Turn on Location Services to allow the app to determine your location.`,
        '',
        [
          {text: 'Go to Settings', onPress: openSetting},
          {
            text: "Don't Use Location",
            onPress: () => {
              hasPermissionIOS();
              setPermission(false);
            },
          },
        ],
      );
    }
    return false;
  }

  const fetchGetEmployeesApi = async () => {
    let form = new FormData();
    form.append('latitude', latitude);
    form.append('longitude', longitude);
    form.append('max_distance', 50);
    let apiData = {
      url: get_employees,
      method: 'POST',
      token: token,
      data: form,
    };
    try {
      let getEmployeesRes = await getEmployees(apiData).unwrap();
      if (getEmployeesRes.status == 200) {
        dispatch(setGetEmployees(getEmployeesRes.data));
        dispatch(setGetFilteredEmployees(getEmployeesRes.data));
        setFilteredData(getEmployeesRes.data);
      } else {
        dispatch(setGetEmployees([]));
        dispatch(setGetFilteredEmployees([]));
        setFilteredData([]);
      }
      setLoading(false);
    } catch (e) {
      dispatch(setGetEmployees([]));
      dispatch(setGetFilteredEmployees([]));
      setFilteredData([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (route.params?.filter) {
      let filteredJobList = profilesData;
      if (categoryValue) {
        let temp = (filteredJobList = profilesData.filter(
          item => item.category_id === categoryValue,
        ));
        setFilteredData(temp);
      }
      if (filteredJobList.length > 0 && subValue?.length > 0) {
        subValue.forEach(item => {
          filteredJobList = filteredJobList.filter(el =>
            el.preferences.includes(item.label),
          );
        });
        setFilteredData(filteredJobList);
      }
      if (rating) {
        let temp = filteredJobList.filter(item => {
          return item.rating >= rating;
        });
        setFilteredData(temp);
      }
      if (distance) {
        let temp = filteredJobList.filter(item => {
          return item.distance >= distance;
        });
        setFilteredData(temp);
      }
    } else {
      setFilteredData(profilesData);
    }
  }, [categoryValue, subValue, rating, distance]);

  const renderEmptyContainer = () => {
    return (
      <View style={styles.emptyView}>
        <NoPeople />
        <Text style={styles.emptyMessageStyle}>No people available</Text>
      </View>
    );
  };

  useEffect(() => {
    if (latitude && longitude) {
      fetchGetEmployeesApi();
    }
    onRefresh();
  }, [latitude, longitude]);

  useEffect(() => {
    OneSignal.setNotificationOpenedHandler(notification => {
      if (
        notification?.notification?.additionalData?.type == 'accept job invite'
      ) {
        navigation.navigate('ActiveJobDetails', {
          id: notification?.notification?.additionalData?.job_id,
        });
      } else if (
        notification?.notification?.additionalData?.type == 'cancel job'
      ) {
        navigation.navigate('CompleteJobDetails', {
          id: notification?.notification?.additionalData?.job_id,
          status: item.job.status,
        });
      } else if (
        notification?.notification?.additionalData?.type ==
        'employee job review'
      ) {
        navigation.navigate('CompleteJobDetails', {
          id: notification?.notification?.additionalData?.job_id,
          status: item.job.status,
        });
      } else if (
        notification?.notification?.additionalData?.type == 'job proposal'
      ) {
        navigation.navigate('Proposals', {
          id: notification?.notification?.additionalData?.job_id,
        });
      } else {
      }
    });
  }, []);

  const onRefresh = () => {
    setIsFetching(false);
  };

  const renderPeople = ({item}) => {
    return (
      <ProfileCard
        onPressButton={() => navigation.navigate('UserProfile', {item: item})}
        name={item.name}
        category={item.job_title}
        taskCardStyle={styles.profileCardStyle}
        img={item.image}
      />
    );
  };

  function searchData(text) {
    if (text.length > 0) {
      if (route?.params?.filter) {
        var temp1 = filteredData.filter(item => {
          var temp2 = item.name.toLowerCase();
          const textData = text.toLowerCase();
          return temp2.indexOf(textData) > -1;
        });
        setSearchFilter(true);
        setSearchFilterData(temp1);
      } else {
        var temp1 = profilesData.filter(item => {
          var temp2 = item.name.toLowerCase();
          const textData = text.toLowerCase();
          return temp2.indexOf(textData) > -1;
        });
        setSearchFilter(false);
        setFilteredData(temp1);
      }
    } else {
      if (route?.params?.filter) {
        setSearchFilter(true);
        setSearchFilterData(filteredData);
      } else {
        setSearchFilter(false);
        setFilteredData(profilesData);
      }
    }
  }

  return (
    <View style={styles.mainContainer}>
      <Header
        placement={'center'}
        barStyle={'dark-content'}
        containerStyle={styles.headerContainerStyle}
        backgroundColor={styles.headerColor}
        statusBarProps={styles.headerColor}
        leftComponent={<Text style={styles.headerInitialText}>Home</Text>}
        rightComponent={
          <View style={styles.iconContainer}>
            {/* <TouchableOpacity style={styles.notificationContainer}>
              <NotificationSvg />
            </TouchableOpacity> */}
            {activeSvg ? (
              <>
                <MapActiveSvg onPressSvg={() => setIsActiveSvg(!activeSvg)} />
                <GridSvg onPressSvg={() => setIsActiveSvg(!activeSvg)} />
              </>
            ) : (
              <>
                <MapSvg onPressSvg={() => setIsActiveSvg(!activeSvg)} />
                <GridActiveSvg onPressSvg={() => setIsActiveSvg(!activeSvg)} />
              </>
            )}
          </View>
        }
      />

      {loading || !locationPermission ? (
        <View style={styles.activityView}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <View style={styles.container}>
          {activeSvg ? (
            <GoogleMaps
              data={filteredData}
              navigation={navigation}
              onPressButton={() => navigation.navigate('UserProfile')}
              isFocused={isFocused}
            />
          ) : (
            <View>
              <View style={styles.searchView}>
                <SearchBar
                  placeholder="Search Employee...."
                  onChangeText={value => {
                    setSearchText(value);
                    searchData(value);
                  }}
                  value={searchText}
                />
                <TouchableOpacity style={{paddingLeft: hp(1)}}>
                  <FilterSvg
                    onPressFilter={() => {
                      navigation.navigate('FilterScreen');
                    }}
                  />
                </TouchableOpacity>
              </View>
              <FlatList
                data={searchFilter ? searchFilterData : filteredData}
                contentContainerStyle={styles.flatlistContainer}
                renderItem={renderPeople}
                numColumns={2}
                refreshing={isFetching}
                onRefresh={fetchGetEmployeesApi}
                keyExtractor={item => item.email}
                ListEmptyComponent={renderEmptyContainer}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                ListFooterComponent={() => null}
                ListFooterComponentStyle={styles.footerStyle}
              />
            </View>
          )}
        </View>
      )}
    </View>
  );
}

export default Home;
