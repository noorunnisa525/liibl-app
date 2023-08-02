import {useRoute} from '@react-navigation/native';
import {Formik} from 'formik';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Snackbar from 'react-native-snackbar';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useSelector} from 'react-redux';
import * as yup from 'yup';
import {workHistorySvg as WorkHistorySvg} from '../../../assets/Icons/Svgs';
import Button from '../../components/CustomButton';
import DateTimePicker from '../../components/CustomDatePicker';
import CustomDropDown from '../../components/CustomDropdown';
import CustomInputField from '../../components/CustomInputField';
import CustomRadioButtons from '../../components/CustomRadioButton';
import Text from '../../components/CustomText';
import DialogModal from '../../components/DialogModal';
import Header from '../../components/LoggedInHeader';
import {baseUrl} from '../../constants';
import {
  get_categories,
  get_skills,
  get_sub_categories,
  send_hire_invite,
  view_employee_by_id,
} from '../../services/api-confog';
import {useParamApiMutation, usePostApiMutation} from '../../services/service';
import {useThemeAwareObject} from '../../theme/index';
import {hp, wp} from '../../util';
import createStyles from './styles';
const UserProfile = ({navigation}) => {
  const styles = useThemeAwareObject(createStyles);
  const token = useSelector(state => state.user.token);
  const [employeeCall, employeeResponse] = useParamApiMutation();
  const [categoriesCall, categoriesCallResponse] = useParamApiMutation();
  const [subCategoriesCall, subCategoriesCallResponse] = useParamApiMutation();
  const [categoriesSkillsCall, categoriesSkillsCallResponse] =
    useParamApiMutation();
  const [sendHireCall, sendHireResponse] = usePostApiMutation();
  const [open, setOpen] = useState(false);
  const [loaction, setLocation] = useState();
  const [errorLoaction, setErrorLocation] = useState(false);
  const [openModal, toggleModal] = useState(false);
  const [date, setDate] = useState(new Date());
  const [time1, setTime1] = useState(new Date());
  const [time2, setTime2] = useState(new Date());
  const [timeError, setTimeError] = useState(false);
  const [chosenOption, setChosenOption] = useState('hourly');
  const options = [
    {label: 'Hourly', value: 'hourly'},
    {label: 'Pay Job', value: 'payJob'},
  ]; //will store our current user options

  const [categoryValue, setCategoryValue] = useState();
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categoryItems, setCategoryItems] = useState([]);
  const [errorCategory, setErrorCategory] = useState(false);

  const [subCategoryValue, setSubCategoryValue] = useState([]);
  const [subCategoryOpen, setSubCategoryOpen] = useState(false);
  const [subCategoryItems, setSubCategoryItems] = useState([]);
  const [errorSubCategory, setErrorSubCategory] = useState(false);

  const [skillValue, setSkillValue] = useState([]);
  const [skillOpen, setSkillOpen] = useState(false);
  const [skillItems, setSkillItems] = useState([]);
  const [errorSkill, setErrorSkill] = useState(false);

  const [employee, setEmployee] = useState();
  const [history, setHistory] = useState([]);

  const route = useRoute();
  const {item} = route.params;

  useEffect(() => {
    getCategoriesApi();
    getEmployee();
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
        setCategoryItems(tempCategory);
      } else {
        Snackbar.show({
          text: getCategoryList?.message,
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    } catch (e) {}
  };

  const getEmployee = async () => {
    let apiData = {
      url: view_employee_by_id,
      method: 'GET',
      token: token,
      params: `id=${item.id}`,
    };
    try {
      let res = await employeeCall(apiData).unwrap();
      if (res.status == 200) {
        let dateSort = res.data.employee_completed_jobs;
        dateSort = [...dateSort];
        dateSort.sort(function compare(a, b) {
          var dateA = new Date(a.created_at);
          var dateB = new Date(b.created_at);
          return dateB - dateA;
        });
        setHistory(dateSort);
        setEmployee(res.data);
      } else {
        Snackbar.show({
          text: res?.message,
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    } catch (e) {
      console.log('e', e);
    }
  };

  const getSubCategoriesApi = async id => {
    setSkillValue([]);
    setSubCategoryValue([]);
    let apiData = {
      url: get_sub_categories,
      params: `category_id=${id}`,
      method: 'GET',
      token,
    };
    try {
      let getSubCategoryList = await subCategoriesCall(apiData).unwrap();
      if (getSubCategoryList.statusCode == 200) {
        let tempSubCategories = getSubCategoryList?.Data?.map(item => ({
          label: item.name,
          value: item.name,
        }));
        setSubCategoryItems(tempSubCategories);
      } else {
        Snackbar.show({
          text: getSubCategoryList?.message,
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    } catch (e) {}
  };
  const getCategoriesSkillsApi = async id => {
    let apiData = {
      url: get_skills,
      params: `category_id=${id}`,
      method: 'GET',
      token,
    };
    try {
      let categoriesSkills = await categoriesSkillsCall(apiData).unwrap();
      if (categoriesSkills.statusCode == 200) {
        let tempSkills = categoriesSkills?.Data?.map(item => ({
          label: item.name,
          value: item.name,
        }));
        setSkillItems(tempSkills);
      } else {
        Snackbar.show({
          text: categoriesSkills?.message,
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    } catch (e) {}
  };

  const loginValidationSchema = yup.object().shape({
    jobTitle: yup.string().required('Job title is required'),
    jobDetails: yup.string().required('Job details is required'),
    amount: yup.string().required('Amount is required'),
  });

  let difference = moment(time2).diff(moment(time1), 'minutes');

  return (
    <View style={styles.mainContainer}>
      <Header
        placement={'center'}
        barStyle={'dark-content'}
        containerStyle={styles.headerContainerStyle}
        backgroundColor={styles.headerColor}
        statusBarProps={styles.headerColor}
        centerComponent={
          <Text style={styles.headerInitialText}>User Profile</Text>
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
      {employeeResponse.isLoading ? (
        <View style={styles.activityView}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <>
          <ScrollView
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
            keyboardShouldPersistTaps="always">
            <>
              <View style={styles.profileConatiner}>
                <FastImage
                  // resizeMode="contain"
                  style={styles.imgStyle}
                  source={
                    item.image
                      ? {uri: baseUrl.base + '/' + item.image}
                      : require('../../components/ImagePicker/Icons/avatar-placeholder.png')
                  }
                />
                <View style={styles.nameContainer}>
                  <Text style={styles.nameText}>{item.name}</Text>
                  <Text style={styles.categoryText}>
                    {item.job_title ? item.job_title : 'No Title'}
                  </Text>
                  {/* <Text style={styles.experienceText}>{item.experience}</Text> */}
                </View>
              </View>
              <ScrollView
                nestedScrollEnabled={true}
                contentContainerStyle={styles.aboutContainer}>
                <Text style={styles.nameText}>About Me</Text>
                <Text style={styles.aboutText}>{item.about}</Text>
              </ScrollView>
              <Text style={styles.historyText}>Work History</Text>
              <FlatList
                data={history?.slice(0, 25)}
                contentContainerStyle={{flexGrow: 1}}
                renderItem={({item}) => {
                  return (
                    <View style={styles.workContainer}>
                      <View style={styles.workHistoryContainer}>
                        <View style={styles.workImage}>
                          <WorkHistorySvg />
                        </View>
                        <View style={styles.nameContainer}>
                          <Text style={styles.workHistoryText}>
                            {item.title}
                          </Text>
                          <Text
                            numberOfLines={1}
                            style={styles.descriptionText}>
                            {item.description}
                          </Text>
                          <Text style={styles.experienceText}>{item.date}</Text>
                        </View>
                      </View>
                    </View>
                  );
                }}
                ListEmptyComponent={() => {
                  return (
                    <View style={styles.activityView}>
                      <Text style={styles.emptyMessageStyle}>
                        No completed jobs yet
                      </Text>
                    </View>
                  );
                }}
              />
              <DialogModal
                visible={openModal}
                dialogStyle={styles.inviteModal}
                onPress={() => toggleModal(false)}
                children={
                  <>
                    <KeyboardAwareScrollView
                      contentContainerStyle={styles.modalContainer}
                      showsVerticalScrollIndicator={false}
                      nestedScrollEnabled={true}
                      keyboardShouldPersistTaps="always">
                      <Text style={styles.modalTitle}>Send Hire Invite</Text>
                      <Formik
                        validationSchema={loginValidationSchema}
                        initialValues={{
                          jobTitle: '',
                          jobDetails: '',
                          amount: '',
                        }}
                        onSubmit={async values => {
                          if (
                            categoryValue &&
                            subCategoryValue.length > 0 &&
                            skillValue.length > 0
                          ) {
                            let form = new FormData();
                            form.append('employee_id', item.id);
                            form.append('title', values.jobTitle);
                            form.append('description', values.jobDetails);
                            form.append('category_id', categoryValue);
                            subCategoryValue.forEach((subCategory, index) => {
                              if (subCategory !== null) {
                                form.append(
                                  `sub_categories[${index}]`,
                                  subCategory,
                                );
                              }
                            });
                            skillValue.forEach((skill, index) => {
                              if (skill !== null) {
                                form.append(`required_skills[${index}]`, skill);
                              }
                            });
                            form.append(
                              'date',
                              moment(date).format('YYYY-MM-DD'),
                            );
                            form.append(
                              'start_time',
                              moment(time1).format('LT'),
                            );
                            form.append('end_time', moment(time2).format('LT'));
                            form.append('job_type', chosenOption);
                            form.append('amount', values.amount);
                            form.append(
                              'qr_code',
                              Math.floor(Math.random() * 1000) + 1,
                            );
                            let apiData = {
                              url: send_hire_invite,
                              method: 'POST',
                              token,
                              data: form,
                            };
                            try {
                              let res = await sendHireCall(apiData).unwrap();
                              if (res.status == 200) {
                                toggleModal(false);
                                setOpen(true);
                                setCategoryValue();
                                setSubCategoryValue([]);
                                setSkillValue([]);
                              } else {
                                Snackbar.show({
                                  text: res?.message,
                                  duration: Snackbar.LENGTH_SHORT,
                                });
                              }
                            } catch (e) {}
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
                          <>
                            <View style={styles.inputContainer}>
                              <Text style={styles.textFieldTitle}>
                                Job Title
                              </Text>
                              <CustomInputField
                                name="jobTitle"
                                inputStyle={styles.loginInputText}
                                inputContainerStyle={{borderColor: 'lightgray'}}
                                placeholder="Enter Job Title"
                                value={values.jobTitle}
                                onChangeText={handleChange('jobTitle')}
                                onBlur={handleBlur('jobTitle')}
                              />
                              {errors.jobTitle && touched.jobTitle && (
                                <Text style={styles.errorText}>
                                  {errors.jobTitle}
                                </Text>
                              )}
                              <Text style={styles.textFieldTitle}>
                                Job Details
                              </Text>
                              <CustomInputField
                                name="jobDetails"
                                inputStyle={styles.loginInputText}
                                inputContainerStyle={{borderColor: 'lightgray'}}
                                placeholder="Enter Job Description"
                                value={values.jobDetails}
                                onChangeText={handleChange('jobDetails')}
                                onBlur={handleBlur('jobDetails')}
                              />
                              {errors.jobDetails && touched.jobDetails && (
                                <Text style={styles.errorText}>
                                  {errors.jobDetails}
                                </Text>
                              )}

                              <Text style={styles.textFieldTitle}>
                                Category
                              </Text>

                              <CustomDropDown
                                // disable={categoriesCallResponse.isLoading}

                                value={categoryValue}
                                setValue={setCategoryValue}
                                onChangeValue={id => {
                                  if (categoryValue) {
                                    getSubCategoriesApi(id);
                                    getCategoriesSkillsApi(categoryValue);
                                  }
                                }}
                                containerStyle={styles.dropdownContainerStyle}
                                open={categoryOpen}
                                setOpen={setCategoryOpen}
                                items={categoryItems}
                                setItems={setCategoryItems}
                                zIndex={300}
                                zIndexReverse={100}
                                placeholder={'Select Business Category'}
                              />
                              {errorCategory ? (
                                <Text style={styles.dropdownErrorText}>
                                  Category is required
                                </Text>
                              ) : (
                                <Text style={styles.dropdownErrorText}></Text>
                              )}

                              <Text style={styles.textFieldTitle}>
                                Sub Category
                              </Text>

                              <CustomDropDown
                                // disabled={subCategoriesCallResponse.isLoading}
                                value={subCategoryValue}
                                setValue={setSubCategoryValue}
                                containerStyle={styles.dropdownContainerStyle}
                                multiple={true}
                                open={subCategoryOpen}
                                setOpen={setSubCategoryOpen}
                                zIndex={200}
                                zIndexReverse={200}
                                items={subCategoryItems}
                                setItems={setSubCategoryItems}
                                placeholder={'Select Sub Category'}
                              />
                              {errorSubCategory ? (
                                <Text style={styles.dropdownErrorText}>
                                  Sub-categories are required
                                </Text>
                              ) : (
                                <Text style={styles.dropdownErrorText}></Text>
                              )}

                              <Text style={styles.textFieldTitle}>
                                Required Skills
                              </Text>

                              <CustomDropDown
                                // disabled={categoriesSkillsCallResponse.isLoading}
                                value={skillValue}
                                setValue={setSkillValue}
                                containerStyle={styles.dropdownContainerStyle}
                                multiple={true}
                                open={skillOpen}
                                setOpen={setSkillOpen}
                                zIndex={100}
                                zIndexReverse={300}
                                items={skillItems}
                                setItems={setSkillItems}
                                placeholder={'Select Skills'}
                              />
                              {errorSkill ? (
                                <Text style={styles.dropdownErrorText}>
                                  Skills are required
                                </Text>
                              ) : (
                                <Text style={styles.dropdownErrorText}></Text>
                              )}
                              <Text style={styles.textFieldTitle}>Date</Text>

                              <View
                                style={{
                                  width: wp(71),
                                  marginLeft: wp(2),
                                }}>
                                <DateTimePicker
                                  value={date}
                                  type="date"
                                  // setCurrentDate={setDate}
                                  onChange={date => setDate(date)}
                                />
                              </View>

                              <Text style={styles.timeFieldTitle}>Time</Text>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  marginHorizontal: wp(2),
                                }}>
                                <View
                                  style={{
                                    flexDirection: 'column',
                                    width: wp(34),
                                  }}>
                                  <DateTimePicker
                                    value={time1}
                                    // setCurrentDate={setTime1}
                                    onChange={date => setTime1(date)}
                                  />
                                </View>
                                <View
                                  style={{
                                    flexDirection: 'column',
                                    width: wp(34),
                                  }}>
                                  <DateTimePicker
                                    value={time2}
                                    // setCurrentDate={setTime2}
                                    onChange={date => setTime2(date)}
                                  />
                                </View>
                              </View>
                              {timeError ? (
                                <Text style={styles.errorText}>
                                  Starting time should be greater than ending
                                  time
                                </Text>
                              ) : (
                                <Text style={styles.errorText}></Text>
                              )}

                              <Text style={styles.textFieldTitle}>
                                Job Type
                              </Text>

                              <CustomRadioButtons
                                options={options}
                                setChosenOption={setChosenOption}
                              />
                              <Text style={styles.textFieldTitle}>Amount</Text>

                              <CustomInputField
                                name="location"
                                inputStyle={styles.loginInputText}
                                inputContainerStyle={{borderColor: 'lightgray'}}
                                placeholder="Enter Amount"
                                keyboardType={'numeric'}
                                value={values.amount}
                                onChangeText={handleChange('amount')}
                                onBlur={handleBlur('amount')}
                              />
                              {errors.amount && touched.amount && (
                                <Text style={styles.errorText}>
                                  {errors.amount}
                                </Text>
                              )}
                            </View>
                            <View style={styles.formButtonContainer}>
                              <Button
                                style={[
                                  styles.cancelButton,
                                  styles.sendHireInviteButtonText,
                                ]}
                                title1="Cancel"
                                onPress={() => {
                                  toggleModal(false);
                                  setErrorCategory(false);
                                  setErrorSubCategory(false);
                                  setErrorSkill(false);
                                  setTimeError(false);
                                }}
                              />
                              <Button
                                style={[
                                  styles.inviteFormButton,
                                  styles.sendHireInviteButtonText,
                                ]}
                                loading={sendHireResponse.isLoading}
                                title1="Send Hire Invite"
                                onPress={() => {
                                  handleSubmit();
                                  if (!categoryValue) {
                                    setErrorCategory(true);
                                  } else {
                                    setErrorCategory(false);
                                  }
                                  if (subCategoryValue.length == 0) {
                                    setErrorSubCategory(true);
                                  } else {
                                    setErrorSubCategory(false);
                                  }
                                  if (skillValue.length == 0) {
                                    setErrorSkill(true);
                                  } else {
                                    setErrorSkill(false);
                                  }
                                  if (difference <= 0) {
                                    setTimeError(true);
                                  } else {
                                    setTimeError(false);
                                  }
                                }}
                              />
                            </View>
                          </>
                        )}
                      </Formik>
                    </KeyboardAwareScrollView>
                  </>
                }
              />
              <DialogModal
                visible={open}
                dialogStyle={styles.dialogStyle}
                children={
                  <>
                    <FastImage
                      resizeMode="contain"
                      style={styles.thumbStyle}
                      source={require('../../../assets/images/thumb.png')}
                    />
                    <Text style={styles.responseText}>
                      Hire invite has been sent to the user. We will let you
                      know their response.
                    </Text>
                    <Button
                      style={[styles.responseButton, styles.modalOKbutton]}
                      title1="OK"
                      onPress={() => setOpen(false)}
                    />
                  </>
                }
              />
            </>
          </ScrollView>
          <View style={styles.buttonContainer}>
            <Button
              style={[styles.ChatButton, styles.ChatButtonText]}
              title1="Start Chat"
              onPress={() => {
                navigation.navigate('Inbox', {
                  name: item.name,
                  id: item.id,
                  image: item.image,
                });
              }}
            />
            <Button
              style={[
                styles.sendHireInviteButton,
                styles.sendHireInviteButtonText,
              ]}
              title1="Send Hire Invite"
              onPress={() => toggleModal(true)}
            />
          </View>
        </>
      )}
    </View>
  );
};

export default UserProfile;
