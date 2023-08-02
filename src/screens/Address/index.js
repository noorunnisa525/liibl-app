import React, {useRef, useEffect, useState} from 'react';
import {View, TouchableOpacity} from 'react-native';
import Header from '../../components/LoggedInHeader';
import Text from '../../components/CustomText';
import {useThemeAwareObject} from '../../theme/index';
import createStyles from './styles';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {hp, wp} from '../../util';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

function Address({navigation, route}) {
  const styles = useThemeAwareObject(createStyles);
  const ref = useRef();
  const [address, setAddress] = useState();
  const [longitude, setLongitude] = useState();
  const [latitude, setLatitude] = useState();
  useEffect(() => {
    ref.current?.setAddressText('Some Text');
  }, []);
  const onPressAddress = details => {
    route?.params?.login
      ? navigation.navigate('EditViewProfile', {
          address: details?.formatted_address,
          latitude: details?.geometry?.location?.lat,
          longitude: details?.geometry?.location?.lng,
        })
      : navigation.navigate('EditProfile', {
          address: details?.formatted_address,
          latitude: details?.geometry?.location?.lat,
          longitude: details?.geometry?.location?.lng,
        });
    setAddress(details?.formatted_address);
    setLongitude(details?.geometry?.location?.lng);
    setLatitude(details?.geometry?.location?.lat);
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
              navigation.pop();
              // route?.params?.login
              //   ? navigation.navigate('EditViewProfile', {
              //       address: address,
              //       latitude: latitude,
              //       longitude: longitude,
              //     })
              //   : navigation.navigate('EditProfile', {
              //       address: address,
              //       latitude: latitude,
              //       longitude: longitude,
              //     });
            }}>
            <MaterialIcons
              name={'keyboard-arrow-left'}
              size={wp(7)}
              color={'black'}
            />
          </TouchableOpacity>
        }
        centerComponent={
          <Text style={styles.headerInitialText}>
            <Text style={styles.headerInitialText}>Search Locations</Text>
          </Text>
        }
      />
      <GooglePlacesAutocomplete
        placeholder="Search"
        minLength={2} // minimum length of text to search
        autoFocus={false}
        returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
        listViewDisplayed="auto" // true/false/undefined
        fetchDetails={true}
        renderDescription={row => row.description} // custom description render
        onPress={(data, details = null) => {
          onPressAddress(details);
        }}
        getDefaultValue={() => {
          return ''; // text input default value
        }}
        query={{
          key: 'AIzaSyAIcPQAbvHb24yVWVRBbc2S8torUFVcs8Q',
          language: 'en', // language of the results
        }}
        styles={{
          predefinedPlacesDescription: {
            color: '#1faadb',
          },
          textInput: {
            backgroundColor: '#ededed',
            height: 44,
            borderRadius: 5,
            paddingVertical: 5,
            marginHorizontal: hp(2),
            fontSize: 15,
            flex: 1,
          },
        }}
        //currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
        currentLocationLabel="Current location"
        nearbyPlacesAPI="GooglePlacesSearch" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
        GoogleReverseGeocodingQuery={
          {
            // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
          }
        }
        GooglePlacesSearchQuery={{
          // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
          rankby: 'distance',
        }}
        // filterReverseGeocodingByTypes={[
        //   'locality',
        // ]} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
        debounce={200}
      />
    </View>
  );
}

export default Address;
