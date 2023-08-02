import React, {useState, useEffect} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  SafeAreaView,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import Modal from 'react-native-modal';
import Button from '../../components/CustomButton';
import Header from '../../components/LoggedInHeader';
import Text from '../../components/CustomText';
import {useThemeAwareObject} from '../../theme/index';
import createStyles from './styles';
import {accountsData} from '../../data/newMemory';
import FastImage from 'react-native-fast-image';
import {
  viewProfileCall as ViewProfileCall,
  viewProfileEmail as ViewProfileEmail,
  viewProfileLocation as ViewProfileLocation,
} from '../../../assets/Icons/Svgs';
import {CameraIcon, ImageIcon} from '../../components/ImagePicker/Icons/Index';
import DialogModal from '../../components/DialogModal';
import {hp, wp} from '../../util';
import AccountCard from '../../components/AccountCard';
import {useDispatch, useSelector} from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import PeopleCard from '../../components/PeopleCard';
import ViewProfileCard from '../../components/ViewProfileCard';
import GoogleMaps from '../../components/GoogleMaps';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {baseUrl, mapStyle} from '../../constants';
import ImageCropPicker from 'react-native-image-crop-picker';
import {update_profile} from '../../services/api-confog';
import Snackbar from 'react-native-snackbar';
import {usePostApiMutation} from '../../services/service';
import {setCurrentUserData} from '../../redux/slices/userSlice';
const ViewProfile = ({navigation}) => {
  const currentUserData = useSelector(state => state.user.currentUserData);
  const token = useSelector(state => state.user.token);
  const [coverCall, coverResponse] = usePostApiMutation();
  const styles = useThemeAwareObject(createStyles);
  const [isFetching, setIsFetching] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [uri, setUri] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    mapCall();
  }, [currentUserData]);

  function mapCall() {
    return (
      currentUserData && (
        <View style={styles.mapContainer}>
          <MapView
            provider={PROVIDER_GOOGLE}
            customMapStyle={mapStyle}
            style={styles.map}
            initialRegion={mapRegion}
            scrollEnabled={false}>
            <Marker coordinate={markerPoint} />
          </MapView>
        </View>
      )
    );
  }

  useEffect(() => {
    onRefresh();
  }, []);
  useEffect(() => {}, [openModal]);
  const onRefresh = () => {
    setIsFetching(false);
  };

  const mapRegion = {
    latitude: parseFloat(currentUserData?.latitude),
    longitude: parseFloat(currentUserData?.longitude),
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  const markerPoint = {
    latitude: parseFloat(currentUserData?.latitude),
    longitude: parseFloat(currentUserData?.longitude),
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
          } else {
            navigation.navigate(item.onPress);
          }
        }}
      />
    );
  };

  const chooseImage = () => {
    ImageCropPicker.openPicker({
      width: wp(100),
      height: hp(30),
      cropping: true,
      mediaType: 'image',
      multiple: false,
    })
      .then(async image => {
        let obj = {};
        const newImageUri = 'file:/' + image.path.split('file:///').join('');
        obj['uri'] = newImageUri;
        obj['type'] = image.mime;
        obj['name'] = newImageUri.split('/').pop();
        setUri(obj);
        let form = new FormData();
        form.append('name', currentUserData?.name);
        form.append('about', currentUserData?.about);
        form.append('address', currentUserData?.address);
        form.append('category_id', currentUserData?.category_id);
        form.append('latitude', currentUserData?.latitude);
        form.append('longitude', currentUserData?.longitude);
        form.append('cover_image', obj);
        let apiData = {
          url: update_profile,
          token: token,
          method: 'POST',
          data: form,
        };
        try {
          let res = await coverCall(apiData).unwrap();
          if (res.status == 200) {
            dispatch(setCurrentUserData(res.data.user));
            Snackbar.show({
              text: res?.message,
              duration: Snackbar.LENGTH_SHORT,
            });
          } else {
            setUri(null);
          }
        } catch (e) {}
      })
      .catch(err => {
        setUri(null);
      })
      .finally(setModalShow(false));
  };

  const openCamera = () => {
    ImageCropPicker.openCamera({
      width: wp(100),
      height: hp(30),
      cropping: true,
    })
      .then(async image => {
        let obj = {};
        const newImageUri = 'file:/' + image.path.split('file:///').join('');
        obj['uri'] = newImageUri;
        obj['type'] = image.mime;
        obj['name'] = newImageUri.split('/').pop();
        setUri(obj);
        let form = new FormData();
        form.append('cover_image', obj);
        let apiData = {
          url: update_profile,
          token: token,
          method: 'POST',
          data: form,
        };
        try {
          let res = await coverCall(apiData).unwrap();
          if (res.status == 200) {
            dispatch(setCurrentUserData(res.data.user));
            Snackbar.show({
              text: res?.message,
              duration: Snackbar.LENGTH_SHORT,
            });
          } else {
            setUri(null);
          }
        } catch (e) {}
      })
      .catch(err => {
        setUri(null);
      })
      .finally(setModalShow(false));
  };

  return (
    <View style={styles.mainContainer}>
      <ImageBackground
        style={{height: hp(30)}}
        source={
          currentUserData?.cover_image
            ? {
                uri: uri
                  ? uri?.uri
                  : baseUrl.base + '/' + currentUserData?.cover_image,
              }
            : uri
            ? {uri: uri?.uri}
            : require('../../components/ImagePicker/Icons/avatar-placeholder.png')
        }
        imageStyle={{
          borderRadius: hp(2),
          height: hp(30),
          width: wp(100),
        }}>
        <Header
          placement={'center'}
          barStyle={'dark-content'}
          containerStyle={styles.headerContainerStyle}
          backgroundColor={styles.headerColor}
          statusbar={styles.statusBar}
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
        />
        <View style={styles.coverIconView}>
          <MaterialIcons
            name={'camera-alt'}
            size={hp(3.5)}
            color={'white'}
            onPress={() => {
              setModalShow(true);
            }}
          />
        </View>
      </ImageBackground>
      <View style={{marginTop: -hp(4)}}>
        <AccountCard
          listStyle={styles.profileCard}
          viewProposals
          name={currentUserData?.name}
          category={currentUserData?.category?.name}
          onPressIcon={() => navigation.replace('EditViewProfile')}
          onPressEdit={() => navigation.replace('EditViewProfile')}
          viewProfile
          img={
            <Image
              source={
                currentUserData?.image
                  ? {uri: baseUrl.base + '/' + currentUserData?.image}
                  : require('../../components/ImagePicker/Icons/avatar-placeholder.png')
              }
              style={styles.imgStyle}
            />
          }
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps="always">
        <Text style={styles.nameText}>About us</Text>
        <Text style={styles.emailText}>{currentUserData?.about}</Text>
        <ViewProfileCard
          viewProposals
          name={'Email:'}
          category={currentUserData?.email}
          img={<ViewProfileEmail />}
        />
        <ViewProfileCard
          viewProposals
          name={'Phone Number:'}
          category={currentUserData?.phone}
          img={<ViewProfileCall />}
        />
        <ViewProfileCard
          viewProposals
          name={'Location:'}
          category={currentUserData?.address}
          img={<ViewProfileLocation />}
        />
        {mapCall()}
      </ScrollView>
      <Modal
        isVisible={modalShow}
        onBackButtonPress={() => setModalShow(false)}
        onBackdropPress={() => setModalShow(false)}
        style={{justifyContent: 'flex-end', margin: 0}}>
        <SafeAreaView style={styles.options}>
          <Pressable style={styles.option} onPress={chooseImage}>
            <ImageIcon />
            <Text>Library </Text>
          </Pressable>
          <Pressable style={styles.option} onPress={openCamera}>
            <CameraIcon />
            <Text>Camera</Text>
          </Pressable>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

export default ViewProfile;
