import React, {useRef, useEffect, useState, useCallback} from 'react';
import {ScrollView, View, TouchableOpacity} from 'react-native';
import Button from '../../components/CustomButton';
import Header from '../../components/CustomHeader';
import Text from '../../components/CustomText';
import {useThemeAwareObject} from '../../theme/index';
import createStyles from './styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useDispatch, useSelector} from 'react-redux';
import CustomDropDown from '../../components/CustomDropdown';
import CustomRadioButtons from '../../components/CustomRadioButton';
import {Formik} from 'formik';
import * as yup from 'yup';
import CustomInputField from '../../components/CustomInputField';
import DateTimePicker from '../../components/CustomDatePicker';
import {hp, wp} from '../../util';
import DialogModal from '../../components/DialogModal';
import FastImage from 'react-native-fast-image';
import CheckBox from '@react-native-community/checkbox';
import {
  create_job,
  get_categories,
  get_skills,
  get_sub_categories,
} from '../../services/api-confog';
import {useParamApiMutation, usePostApiMutation} from '../../services/service';
import Snackbar from 'react-native-snackbar';
import moment from 'moment';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

function PostJobs({navigation}) {
  const token = useSelector(state => state.user.token);
  const currentUserData = useSelector(state => state.user.currentUserData);

  const [createJob, createJobResponse] = usePostApiMutation();
  const otpRef = useRef();
  const styles = useThemeAwareObject(createStyles);
  const [open, setOpen] = useState(false);
  const [openRequiredSkills, setOpenRequiredSkills] = useState(false);
  const [openJobDuty, setOpenJobDuty] = useState(false);
  const [date, setDate] = useState(new Date(Date.now()));
  const [chosenOption, setChosenOption] = useState('hourly');
  const [value, setValue] = useState();
  const [requiredSkillsvValue, setRequiredSkillsvValue] = useState([]);
  const [isSelected, setSelection] = useState(false);
  const [jobDutyValue, setJobDutyValue] = useState([]);
  const [errorCategory, setErrorCategory] = useState(false);
  const [errorSkills, setErrorSkills] = useState(false);
  const [errorDuty, setErrorDuty] = useState(false);
  const [timeError, setTimeError] = useState(false);
  const [startTimeError, setStartTimeError] = useState(false);
  const [endTimeError, setEndTimeError] = useState(false);
  const [startTime, setStartTime] = useState(new Date(Date.now()));
  const [endTime, setEndTime] = useState(new Date(Date.now()));
  const [amount, setAmount] = useState();
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [categoriesCall, categoriesCallResponse] = useParamApiMutation();
  const [subCategoriesCall, subCategoriesCallResponse] = useParamApiMutation();
  const [categoriesSkillsCall, categoriesSkillsCallResponse] =
    useParamApiMutation();
  const [items, setItems] = useState([]);
  const [skills, setSkills] = useState([]);
  // const [subItem, setSubItem] = useState([
  //   {label: 'Baking chef', value: 'Baking chef'},
  //   {label: 'Washroom Cleaner', value: 'Washroom Cleaner'},
  //   {label: 'Publican Bartender', value: 'Publican Bartender'},
  // ]);
  const [duties, setDuties] = useState([]);
  // const [duties, setDuties] = useState([
  //   {label: 'washing', value: 'Washing'},
  //   {label: 'cleaning', value: 'Cleaning'},
  //   {label: 'punctuality', value: 'Punctuality'},
  // ]);
  const dispatch = useDispatch();

  useEffect(() => {
    otpRef?.current?.focusField(0);
  });

  const options = [
    {label: 'Hourly', value: 'hourly'},
    {label: 'Pay Job', value: 'payJob'},
  ]; //will store our current user options

  const loginValidationSchema = yup.object().shape({
    jobTitle: yup
      .string('Job title is required')
      .required('Job title is required'),
    jobDetails: yup
      .string('Job details is required')
      .required('Job details is required'),
    amount: yup.string('Amount is required').required('Amount is required'),
  });

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
  const getSubCategoriesApi = async id => {
    setDuties([]);
    setJobDutyValue([]);
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
          value: item.id,
        }));
        setDuties(tempSubCategories);
      } else {
        Snackbar.show({
          text: getSubCategoryList?.message,
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    } catch (e) {}
  };
  const getCategoriesSkillsApi = async id => {
    setSkills([]);
    setRequiredSkillsvValue([]);
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
          value: item.id,
        }));
        setSkills(tempSkills);
      } else {
        Snackbar.show({
          text: categoriesSkills?.message,
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    } catch (e) {}
  };

  useEffect(() => {
    getCategoriesApi();
  }, []);

  const handleCreateJob = async values => {
    setErrorCategory(false);
    setErrorSkills(false);
    setErrorDuty(false);
    setStartTimeError(false);
    setEndTimeError(false);

    var apiValue = new FormData();
    apiValue.append('title', values.jobTitle);
    apiValue.append('category_id', value);
    jobDutyValue.forEach((item, index) => {
      if (item !== null) {
        let itemValue = duties.find(duty => duty.value == item);
        apiValue.append(`sub_categories[${index}]`, itemValue.label);
      }
    });

    apiValue.append('job_type', chosenOption);
    apiValue.append('description', values.jobDetails);

    requiredSkillsvValue.forEach((item, index) => {
      let itemValue = skills.find(skill => skill.value == item);
      if (item !== null) {
        apiValue.append(`required_skills[${index}]`, itemValue.label);
      }
    });

    let dateFormat = moment(date).format('YYYY-MM-DD');
    let timeStart = moment(startTime).format('LT');
    let timeEnd = moment(endTime).format('LT');
    apiValue.append('date', dateFormat);
    apiValue.append('start_time', timeStart);
    apiValue.append('end_time', timeEnd);
    apiValue.append('amount', values.amount);
    apiValue.append('qr_code', Math.floor(Math.random() * 1000) + 1);
    if (isSelected) {
      apiValue.append('is_featured', isSelected);
    }
    let apiData = {
      url: create_job,
      data: apiValue,
      method: 'POST',
      token: token,
    };

    console.log('here');

    try {
      let res = await createJob(apiData).unwrap();
      if (res.status == 200) {
        setOpenSuccessModal(true);
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

  let tempDate = moment(date).format('YYYY-MM-DD');
  let tempTime = moment(startTime).format('HH:mm:ss');

  let is24 = tempDate + 'T' + tempTime;
  let seconds = moment(is24).diff(moment());
  let duration = moment.duration(seconds);
  let hoursDiff =
    Math.floor(duration.asHours()) + moment.utc(seconds).format(':mm:ss');
  let hoursValue = hoursDiff.split(':')[0];

  let difference = moment(endTime).diff(moment(startTime), 'minutes');

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
          <Text style={styles.headerInitialText}>Post a job</Text>
        }
      />
      <KeyboardAwareScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps="always">
        <View style={styles.optContainer}>
          <>
            <Formik
              validationSchema={loginValidationSchema}
              initialValues={{jobTitle: '', jobDetails: '', amount: ''}}
              onSubmit={values => {
                if (
                  value &&
                  jobDutyValue.length > 0 &&
                  requiredSkillsvValue.length > 0 &&
                  difference > 0
                ) {
                  handleCreateJob(values);
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
                    <Text style={styles.textFieldTitle}>Job Title</Text>
                    <CustomInputField
                      name="jobTitle"
                      inputStyle={styles.loginInputText}
                      inputContainerStyle={{
                        borderColor: 'lightgray',
                        marginBottom: hp(0.5),
                      }}
                      placeholder="Enter Job Title"
                      value={values.jobTitle}
                      onChangeText={handleChange('jobTitle')}
                      onBlur={handleBlur('jobTitle')}
                    />
                    {errors.jobTitle && touched.jobTitle && (
                      <Text style={styles.errorText}>{errors.jobTitle}</Text>
                    )}
                    <Text style={styles.textFieldTitle}>Job Details</Text>
                    <CustomInputField
                      name="jobDetails"
                      inputStyle={styles.loginInputText}
                      inputContainerStyle={{
                        borderColor: 'lightgray',
                        marginBottom: hp(0.5),
                      }}
                      placeholder="Enter Job Description"
                      value={values.jobDetails}
                      onChangeText={handleChange('jobDetails')}
                      onBlur={handleBlur('jobDetails')}
                    />
                    {errors.jobDetails && touched.jobDetails && (
                      <Text style={styles.errorText}>{errors.jobDetails}</Text>
                    )}
                    <Text style={styles.textFieldTitle}>Job Category</Text>
                    <CustomDropDown
                      // disable={categoriesCallResponse.isLoading}
                      value={value}
                      setValue={setValue}
                      onChangeValue={id => {
                        if (value) {
                          getSubCategoriesApi(id);
                          getCategoriesSkillsApi(id);
                        }
                      }}
                      containerStyle={styles.dropdownContainerStyle}
                      open={open}
                      setOpen={setOpen}
                      items={items}
                      setItems={setItems}
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

                    <Text style={styles.textFieldTitle}>Sub Category</Text>
                    <CustomDropDown
                      // disabled={subCategoriesCallResponse.isLoading}
                      value={jobDutyValue}
                      setValue={setJobDutyValue}
                      containerStyle={styles.dropdownContainerStyle}
                      multiple={true}
                      open={openJobDuty}
                      setOpen={setOpenJobDuty}
                      zIndex={200}
                      zIndexReverse={200}
                      items={duties}
                      setItems={setDuties}
                      placeholder={'Select Sub Category'}
                    />
                    {errorDuty ? (
                      <Text style={styles.dropdownErrorText}>
                        Sub-categories are required
                      </Text>
                    ) : (
                      <Text style={styles.dropdownErrorText}></Text>
                    )}

                    <Text style={styles.textFieldTitle}>Required Skills</Text>

                    <CustomDropDown
                      // disabled={categoriesSkillsCallResponse.isLoading}
                      value={requiredSkillsvValue}
                      setValue={setRequiredSkillsvValue}
                      containerStyle={styles.dropdownContainerStyle}
                      multiple={true}
                      open={openRequiredSkills}
                      setOpen={setOpenRequiredSkills}
                      zIndex={100}
                      zIndexReverse={300}
                      items={skills}
                      setItems={setSkills}
                      placeholder={'Select Skills'}
                    />
                    {errorSkills ? (
                      <Text style={styles.dropdownErrorText}>
                        Skills are required
                      </Text>
                    ) : (
                      <Text style={styles.dropdownErrorText}></Text>
                    )}
                    <Text style={styles.textFieldTitle}>Date </Text>
                    <View
                      style={{
                        width: wp(88),
                        marginHorizontal: wp(2.5),
                      }}>
                      <DateTimePicker
                        value={date}
                        type="date"
                        // setCurrentDate={setDate}
                        minDate={new Date()}
                        onChange={date => setDate(date)}
                      />
                    </View>

                    <Text style={styles.timeFieldTitle}>Time</Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginHorizontal: wp(2.5),
                      }}>
                      <View
                        style={{
                          flexDirection: 'column',
                          width: wp(42),
                        }}>
                        <DateTimePicker
                          type="time"
                          value={startTime}
                          // setCurrentDate={setStartTime}
                          onChange={date => setStartTime(date)}
                        />
                      </View>
                      <View
                        style={{
                          flexDirection: 'column',
                          width: wp(42),
                        }}>
                        <DateTimePicker
                          type="time"
                          value={endTime}
                          // setCurrentDate={setEndTime}
                          onChange={date => setEndTime(date)}
                        />
                      </View>
                    </View>
                    {timeError ? (
                      <Text style={styles.errorText}>
                        Starting time should be greater than ending time
                      </Text>
                    ) : (
                      <Text style={styles.errorText}></Text>
                    )}
                    <Text style={styles.textFieldTitle}>Job Type</Text>

                    <CustomRadioButtons
                      options={options}
                      setChosenOption={setChosenOption}
                    />
                    <Text style={styles.textFieldTitle}>Amount </Text>

                    <CustomInputField
                      name="Amount"
                      inputStyle={styles.loginInputText}
                      inputContainerStyle={{
                        borderColor: 'lightgray',
                        marginBottom: hp(0.5),
                      }}
                      placeholder="Enter Amount"
                      keyboardType={'numeric'}
                      value={values.amount}
                      onChangeText={handleChange('amount')}
                      onBlur={handleBlur('amount')}
                    />
                    {errors.amount && touched.amount && (
                      <Text style={styles.errorText}>{errors.amount}</Text>
                    )}
                    {currentUserData?.is_featured_job
                      ? hoursValue >= 0 &&
                        hoursValue <= 24 && (
                          <View style={styles.checkboxContainer}>
                            <CheckBox
                              value={isSelected}
                              onValueChange={setSelection}
                              style={styles.checkbox}
                              tintColors={{true: 'black', false: 'black'}}
                              boxType="square"
                            />
                            <Text style={styles.checkText}>
                              Make this as Featured
                            </Text>
                          </View>
                        )
                      : null}
                  </View>
                  <Button
                    style={[styles.postJobButton, styles.postJobButtonText]}
                    title1="Post Job"
                    loading={createJobResponse.isLoading}
                    onPress={() => {
                      handleSubmit();
                      if (!value) {
                        setErrorCategory(true);
                      } else {
                        setErrorCategory(false);
                      }
                      if (jobDutyValue.length == 0) {
                        setErrorDuty(true);
                      } else {
                        setErrorDuty(false);
                      }
                      if (requiredSkillsvValue.length == 0) {
                        setErrorSkills(true);
                      } else {
                        setErrorSkills(false);
                      }
                      if (difference <= 0) {
                        setTimeError(true);
                      } else {
                        setTimeError(false);
                      }
                    }}
                  />
                </>
              )}
            </Formik>
          </>
          <DialogModal
            visible={openSuccessModal}
            dialogStyle={styles.dialogStyle}
            children={
              <>
                <FastImage
                  resizeMode="contain"
                  style={styles.thumbStyle}
                  source={require('../../../assets/images/thumb.png')}
                />
                <Text style={styles.responseText}>
                  Congrats! Your job has been successfully posted.
                </Text>
                <Button
                  style={[styles.responseButton, styles.postJobButtonText]}
                  title1="OK"
                  onPress={() => {
                    setOpenSuccessModal(false), navigation.navigate('Home');
                  }}
                />
              </>
            }
          />
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}

export default PostJobs;
