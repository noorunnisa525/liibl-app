import React, {useState, useEffect} from 'react';
import {View, ScrollView, TouchableOpacity, BackHandler} from 'react-native';
import Button from '../../components/CustomButton';
import Header from '../../components/LoggedInHeader';
import Text from '../../components/CustomText';
import {useThemeAwareObject} from '../../theme/index';
import createStyles from './styles';
import CustomInputField from '../../components/CustomInputField';
import ImageCropPicker from '../../components/ImagePicker/ImageCropPicker';
import DialogModal from '../../components/DialogModal';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  workSvg as WorkSvg,
  callSvg as CallSvg,
  locationSvg as LocationSvg,
} from '../../../assets/Icons/Svgs';
import {Formik} from 'formik';
import * as yup from 'yup';
import CustomDropDown from '../../components/CustomDropdown';
import FastImage from 'react-native-fast-image';
import {useDispatch, useSelector} from 'react-redux';
import {baseUrl} from '../../constants';
import {get_categories, update_profile} from '../../services/api-confog';
import Snackbar from 'react-native-snackbar';
import {useParamApiMutation, usePostApiMutation} from '../../services/service';
import {setCurrentUserData} from '../../redux/slices/userSlice';
import {useRoute} from '@react-navigation/native';
import {hp, wp} from '../../util';
const EditViewProfile = ({navigation}) => {
  const route = useRoute();
  const styles = useThemeAwareObject(createStyles);
  const token = useSelector(state => state.user.token);
  const currentUserData = useSelector(state => state.user.currentUserData);
  const dispatch = useDispatch();
  let address = currentUserData?.address;
  let latitude = currentUserData?.latitude;
  let longitude = currentUserData?.longitude;
  if (route.params) {
    address = route.params.address;
    latitude = route.params.latitude;
    longitude = route.params.longitude;
  }

  const [categoriesCall, categoriesCallResponse] = useParamApiMutation();
  const [updateCall, updateResponse] = usePostApiMutation();
  const [meadiaOpen, setMediaOpen] = useState(true);
  const [uri, setUri] = useState(null);
  const [image, setImage] = useState(currentUserData?.image);
  const [value, setValue] = useState(currentUserData?.category?.id);
  const [location, setLocation] = useState('');
  const [errorLocation, setErrorLocation] = useState(false);
  const [open, setOpen] = useState(false);
  const [errorCategory, setErrorCategory] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const onChange = ImageOrVideo => {};
  const loginValidationSchema = yup.object().shape({
    fullName: yup.string().required('Business name is required'),
    location: yup.string().required('Location is required'),
    aboutMe: yup.string().required('Business description is required'),
  });
  const [items, setItems] = useState([]);

  useEffect(() => {
    getCategoriesApi();
  }, []);

  const getCategoriesApi = async () => {
    let apiData = {
      url: get_categories,
      method: 'GET',
    };
    try {
      let getCategoryList = await categoriesCall(apiData).unwrap();
      if (getCategoryList.statusCode == 200) {
        let tempCategory = getCategoryList?.Data?.map(item => ({
          label: item.name,
          value: item.id,
        }));
        setItems(tempCategory);
      } else {
        Snackbar.show({
          text: getCategoryList?.message,
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    } catch (e) {}
  };

  useEffect(() => {
    const backAction = () => {
      navigation.replace('ViewProfile');
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

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
              navigation.replace('ViewProfile');
            }}>
            <MaterialIcons
              name={'keyboard-arrow-left'}
              size={wp(7)}
              color={'black'}
              onPress={() => {
                navigation.replace('ViewProfile');
              }}
            />
          </TouchableOpacity>
        }
        centerComponent={
          <Text style={styles.headerInitialText}>Edit Profile</Text>
        }
      />
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps="always">
        <>
          <ImageCropPicker
            onChange={image => {
              onChange;
              setImage(image);
              setUri(image);
            }}
            uri={image ? baseUrl.base + '/' + image : uri}
            mediaType={true}
            setMediaOpen={setMediaOpen}
            camera={true}
          />

          <View style={styles.memoryContainer}>
            <Formik
              validationSchema={loginValidationSchema}
              initialValues={{
                fullName: currentUserData?.name,
                location: currentUserData?.address,
                aboutMe: currentUserData?.about,
              }}
              onSubmit={async values => {
                if (value) {
                  // navigation.navigate('Subscription');
                  let form = new FormData();
                  form.append('name', values.fullName);
                  form.append('category_id', value);
                  form.append('about', values.aboutMe);
                  form.append('address', address);
                  form.append('latitude', latitude);
                  form.append('longitude', longitude);
                  if (uri) {
                    form.append('image', uri);
                  }
                  let apiData = {
                    url: update_profile,
                    token: token,
                    method: 'POST',
                    data: form,
                  };
                  try {
                    let res = await updateCall(apiData).unwrap();
                    if (res.status == 200) {
                      setOpenModal(true);
                      setErrorCategory(false);
                      dispatch(setCurrentUserData(res.data.user));
                    }
                  } catch (e) {}
                } else {
                  setErrorCategory(true);
                }
              }}
              validateOnChange={false}
              validateOnBlur={false}>
              {({
                handleChange,
                handleSubmit,
                handleBlur,
                values,
                errors,
                touched,
              }) => (
                <View style={styles.inputContainer}>
                  <Text style={styles.textFieldTitle}>Business Name</Text>
                  <CustomInputField
                    name="fullName"
                    maxLength={21}
                    inputStyle={styles.loginInputText}
                    inputContainerStyle={{borderColor: 'lightgray'}}
                    placeholder="Enter Business Name"
                    value={values.fullName}
                    onChangeText={handleChange('fullName')}
                    onBlur={handleBlur('fullName')}
                  />
                  {errors.fullName && touched.fullName && (
                    <Text style={styles.errorText}>{errors.fullName}</Text>
                  )}
                  <Text style={styles.textFieldTitle}>Business Category</Text>

                  <CustomDropDown
                    value={value}
                    setValue={setValue}
                    open={open}
                    style={{
                      marginBottom: hp(1),
                      marginLeft: wp(1),
                      width: wp(92),
                    }}
                    setOpen={setOpen}
                    items={items}
                    setItems={setItems}
                    placeholder={'Select Business Category'}
                  />
                  {errorCategory && (
                    <Text style={styles.errorText}>Category is required</Text>
                  )}
                  <Text style={styles.textFieldTitle}>Address</Text>
                  <TouchableOpacity
                    style={styles.addressTouchField}
                    onPress={() => {
                      navigation.navigate('Address');
                    }}>
                    <Text
                      style={
                        address
                          ? styles.addressInputField
                          : styles.addressPlaceholder
                      }>
                      {address ? address : 'Add Address'}
                    </Text>

                    {/* <CustomInputField
                      name="location"
                      inputStyle={styles.loginInputText}
                      inputContainerStyle={{borderColor: 'lightgray'}}
                      placeholder="Add address"
                      editable={false}
                      value={address}
                      onChangeText={setLocation}
                      leftIcon={<LocationSvg />}
                    /> */}
                  </TouchableOpacity>

                  {errorLocation && (
                    <Text style={styles.errorText}>Location is required</Text>
                  )}

                  <Text style={styles.textFieldTitle}>About your Business</Text>

                  <CustomInputField
                    name="aboutMe"
                    maxLength={300}
                    inputContainerStyle={{borderColor: 'lightgray'}}
                    placeholder="Type here..."
                    value={values.aboutMe}
                    onChangeText={handleChange('aboutMe')}
                    onBlur={handleBlur('aboutMe')}
                  />
                  {errors.aboutMe && touched.aboutMe && (
                    <Text style={styles.errorText}>{errors.aboutMe}</Text>
                  )}

                  <Button
                    onPress={handleSubmit}
                    style={[styles.createBusinessProfileButton, styles.text]}
                    title1="Update Profile"
                    loading={updateResponse.isLoading}
                  />
                </View>
              )}
            </Formik>
            <DialogModal
              visible={openModal}
              dialogStyle={styles.dialogStyle}
              children={
                <>
                  <FastImage
                    resizeMode="contain"
                    style={styles.thumbStyle}
                    source={require('../../../assets/images/thumb.png')}
                  />
                  <Text style={styles.responseText}>
                    Your profile has been successfuly updated!
                  </Text>
                  <Button
                    style={[
                      styles.responseButton,
                      styles.completedJobButtonText,
                    ]}
                    title1="OK"
                    onPress={() => {
                      setOpenModal(false);
                      navigation.replace('ViewProfile');
                    }}
                  />
                </>
              }
            />
          </View>
        </>
      </ScrollView>
    </View>
  );
};

export default EditViewProfile;
