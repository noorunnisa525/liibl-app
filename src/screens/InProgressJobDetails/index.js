import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import Button from '../../components/CustomButton';
import Header from '../../components/LoggedInHeader';
import Text from '../../components/CustomText';
import {useThemeAwareObject} from '../../theme/index';
import createStyles from './styles';
import CustomInputField from '../../components/CustomInputField';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FastImage from 'react-native-fast-image';
import {useRoute} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {
  workHistorySvg as WorkHistorySvg,
  clockSvg as ClockSvg,
  scanSvg as ScanSvg,
  workSvg as WorkSvg,
} from '../../../assets/Icons/Svgs';
import DialogModal from '../../components/DialogModal';
import {hp, wp} from '../../util';
import QrScaneer from '../../components/QRScanner';
import CustomRatingStars from '../../components/CustomRatingStars';
import CustomReview from '../../components/CustomStarReviewRating/CustomReview';
import CustomStarRating from '../../components/CustomStarReviewRating/CustomStarRating';
import {
  business_review,
  complete_job,
  job_detail,
} from '../../services/api-confog';
import Snackbar from 'react-native-snackbar';
import {useParamApiMutation, usePostApiMutation} from '../../services/service';
import {baseUrl} from '../../constants';
const InProgressJobDetails = ({navigation}) => {
  const styles = useThemeAwareObject(createStyles);
  const token = useSelector(state => state.user.token);
  const [detailCall, detailResponse] = useParamApiMutation();
  const [completeCall, completeResponse] = usePostApiMutation();
  const [reviewCall, reviewResponse] = usePostApiMutation();
  const [open, setOpen] = useState(false);
  const [jobStart, setJobStart] = useState(false);
  const [openModal, toggleModal] = useState(false);
  const [openScannerModal, setOpenScannerModal] = useState(false);
  const [scan, setScan] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [result, setResult] = useState();
  const [defaultRating, setDefaultRating] = useState(0);
  const [qr, setQR] = useState(false);
  const [apiCall, setApiCall] = useState(false);
  const [maxRating, setMaxRating] = useState([1, 2, 3, 4, 5]);
  const [review, setReview] = useState('');
  const [data, setData] = useState('');
  const [ratingError, setRatingError] = useState(false);
  const [reviewError, setReviewError] = useState(false);
  // Filled Star. You can also give the path from local
  const starImageFilled = require('../../../assets/images/star.png');
  // Empty Star. You can also give the path from local
  const starImageCorner = require('../../../assets/images/emptyStar.png');
  const halfImageStart = require('../../../assets/images/halfStar.png');

  const route = useRoute();
  const {item} = route.params;

  useEffect(() => {
    getDetails();
  }, []);

  useEffect(() => {
    if (apiCall) {
      completeJob();
    }
  }, [apiCall]);

  async function completeJob() {
    let form = new FormData();
    form.append('job_id', route.params.id);
    let apiData = {
      url: complete_job,
      token: token,
      method: 'POST',
      data: form,
    };
    try {
      let res = await completeCall(apiData).unwrap();
      if (res.status == 200) {
        setApiCall(false);
      } else {
        Snackbar.show({
          text: res?.Message,
          duration: Snackbar.LENGTH_SHORT,
        });
        setApiCall(false);
      }
    } catch (e) {
      setApiCall(false);
    }
  }

  async function getDetails() {
    let apiData = {
      url: job_detail,
      method: 'GET',
      token: token,
      params: `job_id=${route.params.id}`,
    };
    try {
      let res = await detailCall(apiData).unwrap();
      if (res.statusCode == 200) {
        setData(res.Data);
      } else {
        Snackbar.show({
          text: res?.Message,
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    } catch (e) {}
  }

  useEffect(() => {
    const backAction = () => {
      jobStart
        ? navigation.navigate('OurJobs', {
            tab: 'completed',
          })
        : navigation.navigate('OurJobs', {
            tab: 'InProgress',
          });
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [jobStart]);

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
              jobStart
                ? navigation.navigate('OurJobs', {
                    tab: 'completed',
                  })
                : navigation.goBack();
            }}>
            <MaterialIcons
              name={'keyboard-arrow-left'}
              size={wp(7)}
              color={'black'}
              onPress={() => {
                jobStart
                  ? navigation.navigate('OurJobs', {
                      tab: 'completed',
                    })
                  : navigation.navigate('OurJobs', {
                      tab: 'InProgress',
                    });
              }}
            />
          </TouchableOpacity>
        }
        centerComponent={
          <Text style={styles.headerInitialText}>Job Details</Text>
        }
        // rightComponent={<ScanSvg />}
      />
      {detailResponse.isLoading ? (
        <View style={styles.activityView}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
          keyboardShouldPersistTaps="always">
          <>
            <View style={styles.profileConatiner}>
              <View style={{flexDirection: 'row'}}>
                <View style={styles.imageStyle}>
                  <WorkSvg />
                </View>
                <View style={styles.nameContainer}>
                  <Text style={styles.titleText}>{data?.title}</Text>
                  <Text style={styles.categoryText}>
                    {data?.category?.name}
                  </Text>
                  <Text style={styles.experienceText}>
                    {data?.required_skills}
                  </Text>
                </View>
              </View>

              <View style={styles.headetLastContainer}>
                <Text style={styles.priceText}>$ {data?.amount}</Text>
                <Button
                  style={[styles.activeButton, styles.activeText]}
                  title1="In Progress"
                  disabled={true}

                  // onPress={handleSubmit}
                />
              </View>
            </View>

            <Text style={styles.employeedText}>Employed to</Text>
            <View style={styles.profileContainer}>
              <FastImage
                resizeMode="cover"
                style={styles.profileImage}
                source={
                  data?.employee?.image
                    ? {uri: baseUrl.base + '/' + data?.employee?.image}
                    : require('../../components/ImagePicker/Icons/avatar-placeholder.png')
                }
              />
              <Text style={styles.nameText}>{data?.employee?.name}</Text>
            </View>
            <View style={styles.aboutContainer}>
              <Text style={styles.aboutText}>Job Description</Text>
              <Text style={styles.experienceText}>{data?.description}</Text>
            </View>

            <DialogModal
              visible={openModal}
              dialogStyle={styles.dialogStyle}
              children={
                <>
                  <Text style={styles.modalTitle}>Note</Text>
                  <Text style={styles.responseText}>
                    Are you sure you want to cancel the job?
                  </Text>
                  <Button
                    style={[styles.okButton, styles.completedJobButtonText]}
                    title1="OK"
                    onPress={() => toggleModal(false)}
                  />
                </>
              }
            />

            <DialogModal
              visible={submit}
              dialogStyle={styles.dialogStyle}
              children={
                <>
                  <FastImage
                    resizeMode="contain"
                    style={styles.thumbStyle}
                    source={require('../../../assets/images/thumb.png')}
                  />
                  <Text style={styles.responseText}>
                    Your job has been mark completed and review has been saved
                  </Text>
                  <Button
                    style={[
                      styles.responseButton,
                      styles.completedJobButtonText,
                    ]}
                    title1="OK"
                    onPress={() => {
                      setSubmit(false);
                      setJobStart(true);
                    }}
                  />
                </>
              }
            />
            <DialogModal
              visible={openScannerModal}
              dialogStyle={styles.dialogStyle}
              children={
                <>
                  {result ? (
                    qr ? (
                      apiCall ? (
                        <View style={{marginVertical: hp(5)}}>
                          <ActivityIndicator size="large" />
                        </View>
                      ) : (
                        <>
                          <View style={styles.modalTitle}>
                            <Text style={styles.nameText}>Give rating</Text>
                            <TouchableOpacity
                              onPress={() => {
                                setOpenScannerModal(false);
                              }}>
                              <Ionicons
                                name={'close-circle-outline'}
                                size={hp(4)}
                              />
                            </TouchableOpacity>
                          </View>
                          <Text style={styles.nameText}>Rating</Text>

                          <CustomStarRating
                            rating={defaultRating}
                            onChangeValue={txt => {
                              setDefaultRating(txt);
                            }}
                          />
                          {ratingError ? (
                            <Text style={styles.errorText}>
                              Rating is Required
                            </Text>
                          ) : (
                            <Text style={styles.errorText}></Text>
                          )}

                          <Text style={styles.nameText}>Review</Text>
                          <CustomInputField
                            name="location"
                            containerStyle={{height: hp(8)}}
                            inputStyle={styles.loginInputText}
                            inputContainerStyle={{
                              borderColor: 'lightgray',
                              height: hp(8),
                            }}
                            placeholder="Type here..."
                            numberOfLines={2}
                            multiline={true}
                            value={review}
                            onChangeText={text => {
                              setReview(text);
                            }}
                          />
                          {reviewError ? (
                            <Text style={styles.errorText}>
                              Review is Required
                            </Text>
                          ) : (
                            <Text style={styles.errorText}></Text>
                          )}

                          <Button
                            style={[
                              styles.submitButton,
                              styles.completedJobButtonText,
                            ]}
                            loading={reviewResponse.isLoading}
                            title1="Submit"
                            onPress={async () => {
                              if (defaultRating != 0 && review !== '') {
                                // if (defaultRating != 0) {
                                setRatingError(false);
                                setReviewError(false);
                                let form = new FormData();
                                form.append('job_id', route.params.id);
                                form.append('review', review);
                                form.append('rating', defaultRating);
                                let apiData = {
                                  url: business_review,
                                  method: 'POST',
                                  token: token,
                                  data: form,
                                };
                                try {
                                  let res = await reviewCall(apiData).unwrap();
                                  if (res.status == 200) {
                                    setSubmit(true);
                                    setOpenScannerModal(false);
                                  } else {
                                    Snackbar.show({
                                      text: res?.message,
                                      duration: Snackbar.LENGTH_SHORT,
                                    });
                                  }
                                } catch (e) {
                                  console.log('e', e);
                                }
                              } else {
                                if (review == '') {
                                  setReviewError(true);
                                } else {
                                  setReviewError(false);
                                }
                                if (defaultRating == 0) {
                                  setRatingError(true);
                                } else {
                                  setRatingError(false);
                                }
                              }
                            }}
                          />
                        </>
                      )
                    ) : (
                      <>
                        <Text style={styles.responseText}>
                          The QR code does not match with the job ID
                        </Text>
                        <Button
                          style={[styles.responseButton, styles.chatText]}
                          title1="OK"
                          onPress={() => {
                            setOpenScannerModal(false);
                          }}
                        />
                      </>
                    )
                  ) : (
                    <View>
                      <View style={styles.modalTitle}>
                        <Text style={styles.nameText}>Scan Code</Text>
                        <TouchableOpacity
                          onPress={() => {
                            setOpenScannerModal(false);
                          }}>
                          <Ionicons
                            name={'close-circle-outline'}
                            size={hp(4)}
                          />
                        </TouchableOpacity>
                      </View>

                      <QrScaneer
                        scan={scan}
                        setScan={setScan}
                        result={result}
                        setResult={async e => {
                          setResult(e?.data);
                          if (e?.data == data?.job_qr_code) {
                            setQR(true);
                            setApiCall(true);
                          } else {
                            setQR(false);
                          }
                        }}
                      />
                      <Text style={styles.responseText}>
                        Scan the QR Code of job to complete it.
                      </Text>
                    </View>
                  )}
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
                    Are sure you want to cancel this job?
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Button
                      style={[
                        styles.cancelModalButton,
                        styles.completedJobButtonText,
                      ]}
                      title1="No"
                      onPress={() => setOpen(false)}
                    />
                    <Button
                      style={[
                        styles.acceptModalButton,
                        styles.completedJobButtonText,
                      ]}
                      title1="Yes"
                      onPress={() => {
                        setOpen(false), toggleModal(true);
                      }}
                    />
                  </View>
                </>
              }
            />
          </>
        </ScrollView>
      )}
      {!qr && (
        <View style={styles.buttonContainer}>
          <Button
            style={[styles.completedJobButton, styles.completedJobButtonText]}
            title1="Complete the Job"
            onPress={() => setOpenScannerModal(true)}
          />
        </View>
      )}
    </View>
  );
};

export default InProgressJobDetails;
