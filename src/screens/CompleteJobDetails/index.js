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
import {
  workHistorySvg as WorkHistorySvg,
  clockSvg as ClockSvg,
  scanSvg as ScanSvg,
  workSvg as WorkSvg,
} from '../../../assets/Icons/Svgs';
import DialogModal from '../../components/DialogModal';
import {hp, wp} from '../../util';
import QrScaneer from '../../components/QRScanner';
import CustomRatingStars from '../../components/CustomStarReviewRating/CustomStarRating';
// import CustomRatingStars from '../../components/CustomStarReviewRating/CustomStarRating';
import {job_detail} from '../../services/api-confog';
import {useSelector} from 'react-redux';
import {useParamApiMutation} from '../../services/service';
import {baseUrl} from '../../constants';
const CompleteJobDetails = ({navigation}) => {
  const styles = useThemeAwareObject(createStyles);
  const token = useSelector(state => state.user.token);
  const [detailCall, detailResponse] = useParamApiMutation();
  const [data, setData] = useState([]);
  const [defaultRating, setDefaultRating] = useState(2);
  const [maxRating, setMaxRating] = useState([1, 2, 3, 4, 5]);
  const [review, setReview] = useState();
  // Filled Star. You can also give the path from local
  const starImageFilled = require('../../../assets/images/star.png');
  // Empty Star. You can also give the path from local
  const starImageCorner = require('../../../assets/images/emptyStar.png');
  const halfImageStart = require('../../../assets/images/halfStar.png');

  const route = useRoute();

  useEffect(() => {
    getDetails();
  }, []);

  async function getDetails() {
    let apiData = {};
    if (route.params.status == 'cancel') {
      apiData = {
        url: job_detail,
        method: 'GET',
        token: token,
        params: `job_id=${route.params.id}`,
      };
    } else {
      apiData = {
        url: job_detail,
        method: 'GET',
        token: token,
        params: `job_id=${route.params.id}&type=completed`,
      };
    }
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
      navigation.navigate('OurJobs', {
        tab: 'completed',
      });
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
              navigation.navigate('OurJobs', {
                tab: 'completed',
              });
            }}>
            <MaterialIcons
              name={'keyboard-arrow-left'}
              size={wp(7)}
              color={'black'}
              onPress={() => {
                navigation.navigate('OurJobs', {
                  tab: 'completed',
                });
              }}
            />
          </TouchableOpacity>
        }
        centerComponent={
          <Text style={styles.headerInitialText}>Job Details</Text>
        }
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
                  <Text style={styles.experienceText}>
                    {data?.required_skills}
                  </Text>
                </View>
              </View>

              <View style={styles.headetLastContainer}>
                <Text style={styles.priceText}>$ {data?.amount}</Text>
                <Button
                  style={[styles.activeButton, styles.activeText]}
                  title1={route.params.status}
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
            {data?.review?.rating_employee && (
              <View style={styles.reviewContainer}>
                <Text style={styles.aboutText}>Employee Review</Text>
                <CustomRatingStars
                  rating={data?.review?.rating_employee ?? 0}
                  maxRating={maxRating}
                  disabled
                  starSize={styles.starSize}
                />
                <Text style={styles.reviewText}>
                  {data?.review?.review_employee}
                </Text>
              </View>
            )}
            {data?.review?.rating_business && (
              <View style={styles.reviewContainer}>
                <Text style={styles.aboutText}>Your Review</Text>
                <CustomRatingStars
                  rating={data?.review?.rating_business ?? 0}
                  maxRating={maxRating}
                  disabled
                  starSize={styles.starSize}
                />
                <Text style={styles.reviewText}>
                  {data?.review?.review_business}
                </Text>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default CompleteJobDetails;
