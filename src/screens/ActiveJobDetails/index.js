import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  BackHandler,
} from 'react-native';
import Button from '../../components/CustomButton';
import Header from '../../components/LoggedInHeader';
import Text from '../../components/CustomText';
import {useThemeAwareObject} from '../../theme/index';
import createStyles from './styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FastImage from 'react-native-fast-image';
import {useRoute} from '@react-navigation/native';
import {
  workHistorySvg as WorkHistorySvg,
  clockSvg as ClockSvg,
  scanSvg as ScanSvg,
  workSvg as WorkSvg,
  closeSvg as CloseSvg,
} from '../../../assets/Icons/Svgs';
import DialogModal from '../../components/DialogModal';
import {hp, wp} from '../../util';
import QrScaneer from '../../components/QRScanner';
import {useSelector} from 'react-redux';
import {useParamApiMutation, usePostApiMutation} from '../../services/service';
import {job_cancel, job_detail, start_job} from '../../services/api-confog';
import {ActivityIndicator} from 'react-native';
import {baseUrl} from '../../constants';
import Snackbar from 'react-native-snackbar';
const ActiveJobDetails = ({navigation, route}) => {
  const styles = useThemeAwareObject(createStyles);
  const token = useSelector(state => state.user.token);
  const [detailCall, detailResponse] = useParamApiMutation();
  const [cancelCall, cancelResponse] = usePostApiMutation();
  const [startCall, startResponse] = usePostApiMutation();
  const [jobActive, setJobActive] = useState(false);
  const [open, setOpen] = useState(false);
  const [openModal, toggleModal] = useState(false);
  const [openScannerModal, setOpenScannerModal] = useState(false);
  const [scan, setScan] = useState(false);
  const [result, setResult] = useState();
  const [qr, setQR] = useState(false);
  const [apiCall, setApiCall] = useState(false);
  const [data, setData] = useState([]);
  const onPressColse = () => {
    setOpenScannerModal(false);
    setScan(false);
  };

  useEffect(() => {
    getDetails();
  }, []);

  useEffect(() => {
    if (apiCall) {
      startJob();
    }
  }, [apiCall]);

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

  async function startJob() {
    let form = new FormData();
    form.append('job_id', route.params.id);
    let apiData = {
      url: start_job,
      token: token,
      method: 'POST',
      data: form,
    };
    try {
      let res = await startCall(apiData).unwrap();
      if (res.status == 200) {
        setApiCall(false);
      } else {
        Snackbar.show({
          text: res?.Message,
          duration: Snackbar.LENGTH_SHORT,
        });
        setApiCall(false);
      }
    } catch (e) {}
  }

  useEffect(() => {
    const backAction = () => {
      jobActive
        ? navigation.navigate('OurJobs', {
            tab: 'InProgress',
          })
        : navigation.navigate('OurJobs', {
            tab: 'Active',
          });
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [jobActive]);

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
              jobActive
                ? navigation.navigate('OurJobs', {
                    tab: 'InProgress',
                  })
                : navigation.navigate('OurJobs', {
                    tab: 'Active',
                  });
            }}>
            <MaterialIcons
              name={'keyboard-arrow-left'}
              size={wp(7)}
              color={'black'}
              onPress={() => {
                jobActive
                  ? navigation.navigate('OurJobs', {
                      tab: 'InProgress',
                    })
                  : navigation.navigate('OurJobs', {
                      tab: 'Active',
                    });
              }}
            />
          </TouchableOpacity>
        }
        centerComponent={
          <Text style={styles.headerInitialText}>Job Details</Text>
        }
        // rightComponent={
        //   <TouchableOpacity onPress={() => setOpenScannerModal(true)}>
        //     <ScanSvg />
        //   </TouchableOpacity>
        // }
      />
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps="always">
        {detailResponse.isLoading ? (
          <View style={styles.activityView}>
            <ActivityIndicator size="large" />
          </View>
        ) : (
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
                  <Text style={styles.skillText}>{data?.required_skills}</Text>
                </View>
              </View>

              <View style={styles.headetLastContainer}>
                <Text style={styles.priceText}>$ {data?.amount}</Text>
                <Button
                  style={[styles.activeButton, styles.activeText]}
                  title1="Active"
                  disabled={true}

                  // onPress={handleSubmit}
                />
              </View>
            </View>

            <Text style={styles.employeedText}>Employed to</Text>
            <View style={styles.profileContainer}>
              <FastImage
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
                  <Text style={styles.noteText}>Note</Text>
                  <Text style={styles.responseText}>
                    Your Job has been cancelled
                  </Text>
                  <Button
                    style={[styles.okButton, styles.modalText]}
                    title1="OK"
                    onPress={() => {
                      toggleModal(false);
                      navigation.pop();
                    }}
                  />
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
                    source={require('../../../assets/images/tick-circle.png')}
                  />
                  <Text style={styles.responseText}>
                    Are you sure you want to cancel this job?
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Button
                      style={[styles.cancelModalButton, styles.modalText]}
                      title1="No"
                      onPress={() => setOpen(false)}
                    />
                    <Button
                      style={[styles.acceptModalButton, styles.modalText]}
                      title1="Yes"
                      loading={cancelResponse.isLoading}
                      onPress={async () => {
                        let data = {
                          job_id: route.params.id,
                        };
                        let apiData = {
                          url: job_cancel,
                          method: 'POST',
                          token: token,
                          data: data,
                        };
                        try {
                          let res = await cancelCall(apiData).unwrap();
                          if (res.status == 200) {
                            setOpen(false);
                            toggleModal(true);
                          } else {
                            Snackbar.show({
                              text: res?.Message,
                              duration: Snackbar.LENGTH_SHORT,
                            });
                          }
                        } catch (e) {}
                      }}
                    />
                  </View>
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
                      <>
                        <FastImage
                          resizeMode="contain"
                          style={styles.thumbStyle}
                          source={require('../../../assets/images/thumb.png')}
                        />
                        {apiCall ? (
                          <View style={{marginVertical: hp(5)}}>
                            <ActivityIndicator size="large" />
                          </View>
                        ) : (
                          <Text style={styles.responseText}>
                            Your job has been started. You can check it in "In
                            Progress" tab
                          </Text>
                        )}
                        <Button
                          style={[
                            styles.responseButton,
                            styles.completedJobButtonText,
                          ]}
                          title1="OK"
                          onPress={() => {
                            setOpenScannerModal(false);
                            setJobActive(true);
                          }}
                        />
                      </>
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
                        Scan the QR code of job to start it.
                      </Text>
                    </View>
                  )}
                </>
              }
            />
          </>
        )}
      </ScrollView>
      {data?.status == 'active' && !qr && (
        <View style={styles.buttonContainer}>
          <Button
            style={[styles.startJobButton, styles.startJobButtonText]}
            title1="Start the Job"
            onPress={() => setOpenScannerModal(true)}
          />
          <Button
            style={[styles.cancelJobButton, styles.cancelJobButtonText]}
            title1="Cancel the Job"
            onPress={() => setOpen(true)}
          />
        </View>
      )}
    </View>
  );
};

export default ActiveJobDetails;
