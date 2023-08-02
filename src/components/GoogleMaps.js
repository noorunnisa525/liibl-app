import React, {Component} from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {useIsFocused} from '@react-navigation/native';
import MapView, {
  Callout,
  Marker,
  MarkerAnimated,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import {employeeSvg as EmployeeSvg} from '../../assets/Icons/Svgs';
import {connect} from 'react-redux';
import {baseUrl, mapStyle} from '../constants';
import {hp, wp} from '../util';
import ProfileCard from './ProfileCard';
import FastImage from 'react-native-fast-image';

class CarouselMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      markers: [],
      coordinates: [],
      initialPosition: null,
    };
  }
  static navigationOptions = {
    title: 'San Francisco',
  };

  async componentDidMount() {
    this.setState({
      ...this.state,
      coordinates: this.props.data,
    });
    const hasLocationPermission = await this.hasLocationPermission();
    let options = {enableHighAccuracy: false, timeout: 1000};
    Geolocation.getCurrentPosition(
      async position => {
        let initialPosition = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.09,
          longitudeDelta: 0.035,
        };

        this.setState({initialPosition});
      },
      err => console.log('err', err),
      options,
    );
  }

  hasLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const hasPermission = await this.hasPermissionIOS();
      return hasPermission;
    }

    if (Platform.OS === 'android' && Platform.Version < 23) {
      return true;
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }

    if (status === PermissionsAndroid.RESULTS.DENIED) {
      this.hasLocationPermission();
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      this.hasLocationPermission();
    }
    return false;
  };

  hasPermissionIOS = async () => {
    const openSetting = () => {
      Linking.openSettings().catch(() => {
        Alert.alert('Unable to open settings');
      });
    };
    const status = await Geolocation.requestAuthorization('whenInUse');

    if (status === 'granted') {
      return true;
    }

    if (status === 'denied') {
      this.hasPermissionIOS();
    }

    if (status === 'disabled') {
      this.hasPermissionIOS();
    }

    return false;
  };

  onMarkerPressed = (location, index) => {
    this._map.animateToRegion({
      latitude: parseFloat(location.latitude),
      longitude: parseFloat(location.longitude),
      latitudeDelta: 0.06,
      longitudeDelta: 0.02,
    });
  };

  onMapReady = e => {
    if (this.state.initialPosition?.latitude)
      setTimeout(
        () => this._map.animateToRegion(this.state.initialPosition),
        500,
      );
  };

  componentDidUpdate(prevProps) {
    if (this.props.isFocused || this.state.initialPosition?.latitude) {
      this.onMapReady();
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.initialPosition?.latitude ? (
          <MapView
            provider={PROVIDER_GOOGLE}
            ref={map => (this._map = map)}
            showsUserLocation={true}
            customMapStyle={mapStyle}
            style={styles.map}
            onMapReady={this.onMapReady}
            initialRegion={this.state.initialPosition}>
            {this.props.coordinates.map((marker, index) => {
              if (marker.latitude) {
                return (
                  <Marker
                    key={marker.id}
                    ref={ref => (this.state.markers[index] = ref)}
                    pointerEvents="auto"
                    coordinate={{
                      latitude: parseFloat(marker.latitude),
                      longitude: parseFloat(marker.longitude),
                    }}
                    onPress={() => this.onMarkerPressed(marker, index)}>
                    <Image
                      source={
                        marker.image
                          ? {uri: baseUrl.base + '/' + marker.image}
                          : require('../components/ImagePicker/Icons/avatar-placeholder.png')
                      }
                      style={{
                        height: hp(5),
                        width: hp(5),
                        borderRadius: hp(5),
                      }}
                    />
                    <Callout
                      onPress={() => {
                        this.props.navigation.navigate('UserProfile', {
                          item: marker,
                        });
                      }}>
                      <ProfileCard
                        img={marker.image}
                        name={marker.name}
                        category={marker.job_title}
                      />
                    </Callout>
                  </Marker>
                );
              }
            })}
          </MapView>
        ) : (
          <View style={styles.activityView}>
            <ActivityIndicator size="large" />
          </View>
        )}
      </View>
    );
  }
}
const mapStateToProps = state => {
  return {
    coordinates: state.user.getFilteredEmployees,
  };
};

export default connect(mapStateToProps)(CarouselMap);

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    ...StyleSheet.absoluteFillObject,
  },
  activityView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  carousel: {
    position: 'absolute',
    bottom: 0,
    marginBottom: 48,
  },
  cardContainer: {
    height: hp(25),
    width: 300,
    padding: 24,
    borderRadius: 24,
  },
  cardImage: {
    height: 120,
    width: 300,
    bottom: 0,
    position: 'absolute',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  cardTitle: {
    color: 'white',
    fontSize: 22,
    alignSelf: 'center',
  },
});
