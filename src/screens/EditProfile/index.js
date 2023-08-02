import React, {useState, useEffect} from 'react';
import {View, ScrollView, TouchableOpacity} from 'react-native';
import Button from '../../components/CustomButton';
import Header from '../../components/LoggedInHeader';
import Text from '../../components/CustomText';
import {useThemeAwareObject} from '../../theme/index';
import createStyles from './styles';
import CustomInputField from '../../components/CustomInputField';
import ImageCropPicker from '../../components/ImagePicker/ImageCropPicker';
import {useDispatch, useSelector} from 'react-redux';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  workSvg as WorkSvg,
  callSvg as CallSvg,
  locationSvg as LocationSvg,
} from '../../../assets/Icons/Svgs';
import {Formik} from 'formik';
import * as yup from 'yup';
import CustomDropDown from '../../components/CustomDropdown';
import {get_categories, update_profile} from '../../services/api-confog';
import {usePostApiMutation} from '../../services/service';
import Snackbar from 'react-native-snackbar';
import {useRoute} from '@react-navigation/native';
import {setForgetPasswordFlag} from '../../redux/slices/userSlice';
import {hp, wp} from '../../util';

const EditProfile = ({navigation}) => {
  const route = useRoute();
  let address = null;
  let latitude = null;
  let longitude = null;
  if (route.params) {
    address = route.params.address;
    latitude = route.params.latitude;
    longitude = route.params.longitude;
  }
  const styles = useThemeAwareObject(createStyles);
  const [mediaOpen, setMediaOpen] = useState(true);
  const [uri, setUri] = useState();
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(true);
  const [dorpDownValue, setValue] = useState();
  const [open, setOpen] = useState(false);
  const [location, setLocation] = useState('');
  const [errorLocation, setErrorLocation] = useState(false);
  const [errorCategory, setErrorCategory] = useState(false);
  const [aboutBusiness, setAboutBusiness] = useState();
  const [profileImage, setProfileImage] = useState();
  const [categoriesCall, getCategoriesResponse] = usePostApiMutation();
  const [updateProfileCall, updateProfileResponse] = usePostApiMutation();
  const token = useSelector(state => state.user.tempToken);
  const isEditMode = useSelector(state => state.user.editModeFlag);
  const onChange = image => {
    setProfileImage(image);
  };
  const dispatch = useDispatch();

  const loginValidationSchema = yup.object().shape({
    fullName: yup.string().required('Business name is required'),
    phoneNumber: yup.string().required('Phone number is required'),
    about: yup.string().required('Business description is required'),
  });
  const [items, setItems] = useState([]);

  // api post updateProfile
  const updateProfileApi = async values => {
    setErrorLocation(false);
    setErrorCategory(false);
    var apiValue = new FormData();
    apiValue.append('name', values.fullName);
    apiValue.append('phone', values.phoneNumber);
    apiValue.append('category_id', dorpDownValue);
    apiValue.append('address', address);
    apiValue.append('about', values.about);
    if (profileImage) {
      apiValue.append('image', profileImage);
    }
    apiValue.append('latitude', latitude);
    apiValue.append('longitude', longitude);
    let apiData = {
      url: update_profile,
      token: token,
      method: 'POST',
      data: apiValue,
    };
    try {
      let res = await updateProfileCall(apiData).unwrap();
      if (res.status == 200) {
        dispatch(setForgetPasswordFlag(false));
        Snackbar.show({
          text: res?.message,
          duration: Snackbar.LENGTH_SHORT,
        });
        navigation.navigate('PhoneVerification', {
          data: {phoneNumber: values.phoneNumber},
        });
        // navigation.navigate('Subscription');
      } else {
        Snackbar.show({
          text: res?.message,
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    } catch (e) {}
  };

  //api getCategories
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
    getCategoriesApi();
  }, []);
  return (
    <View style={styles.mainContainer}>
      <Header
        placement={'center'}
        barStyle={'dark-content'}
        containerStyle={styles.headerContainerStyle}
        backgroundColor={styles.headerColor}
        statusBarProps={styles.headerColor}
        centerComponent={
          <Text style={styles.headerInitialText}>
            {isEditMode ? 'Update Profile' : 'Profile Setup'}
          </Text>
        }
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
      <KeyboardAwareScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps="always">
        <>
          <ImageCropPicker
            onChange={onChange}
            uri={uri}
            profile={true}
            mediaType={true}
            setMediaOpen={setMediaOpen}
            camera={true}
          />

          <View style={styles.memoryContainer}>
            <Formik
              validationSchema={loginValidationSchema}
              initialValues={{
                fullName: route?.params?.name ?? '',
                phoneNumber: '+1',
                about: '',
              }}
              onSubmit={values => {
                if (dorpDownValue && address != '') {
                  updateProfileApi(values);
                } else {
                  if (!dorpDownValue) {
                    setErrorCategory(true);
                  }
                  if (address == '') {
                    setErrorLocation(true);
                  }
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
                    inputStyle={styles.loginInputText}
                    inputContainerStyle={{borderColor: 'lightgray'}}
                    placeholder="Enter Business Name"
                    maxLength={21}
                    value={values.fullName}
                    onChangeText={handleChange('fullName')}
                    onBlur={handleBlur('fullName')}
                    leftIcon={<WorkSvg />}
                  />
                  {errors.fullName && touched.fullName && (
                    <Text style={styles.errorText}>{errors.fullName}</Text>
                  )}
                  <Text style={styles.textFieldTitle}>
                    Business Phone Number
                  </Text>
                  <CustomInputField
                    name="phoneNumber"
                    inputStyle={styles.loginInputText}
                    inputContainerStyle={{borderColor: 'lightgray'}}
                    placeholder="+19159969739"
                    value={values.phoneNumber}
                    keyboardType="phone-pad"
                    onChangeText={handleChange('phoneNumber')}
                    onBlur={handleBlur('phoneNumber')}
                    leftIcon={<CallSvg />}
                  />
                  {errors.phoneNumber && touched.phoneNumber && (
                    <Text style={styles.errorText}>
                      Phone Number is required
                    </Text>
                  )}
                  <Text style={styles.textFieldTitle}>Business Category</Text>

                  <CustomDropDown
                    value={dorpDownValue}
                    setValue={setValue}
                    open={open}
                    setOpen={setOpen}
                    style={{
                      marginBottom: hp(1),
                      marginLeft: wp(1),
                      width: wp(82),
                    }}
                    items={items}
                    setItems={setItems}
                    placeholder={'Select Business Category'}
                  />
                  {errorCategory && (
                    <Text style={styles.dropdownError}>
                      Category is required
                    </Text>
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
                    name="about"
                    maxLength={300}
                    inputStyle={styles.loginInputText}
                    inputContainerStyle={{borderColor: 'lightgray'}}
                    placeholder="Type here..."
                    value={values.about}
                    onChangeText={handleChange('about')}
                    onBlur={handleBlur('about')}
                  />
                  {errors.about && touched.about && (
                    <Text style={styles.errorText}>{errors.about}</Text>
                  )}

                  <Button
                    onPress={() => {
                      handleSubmit();
                      if (!dorpDownValue) {
                        setErrorCategory(true);
                      }
                      if (!address) {
                        setErrorLocation(true);
                      } else {
                        setErrorLocation(false);
                      }
                    }}
                    style={[styles.createBusinessProfileButton, styles.text]}
                    title1={
                      isEditMode
                        ? 'Update Business Profile'
                        : 'Create Business Profile'
                    }
                    loading={updateProfileResponse.isLoading}
                  />
                </View>
              )}
            </Formik>
          </View>
        </>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default EditProfile;
