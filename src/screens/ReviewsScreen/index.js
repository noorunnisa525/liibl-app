import React, {useEffect, useState} from 'react';
import {FlatList, View, TouchableOpacity} from 'react-native';
import Header from '../../components/CustomHeader';
import Text from '../../components/CustomText';
import {useThemeAwareObject} from '../../theme/index';
import createStyles from './styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {reviewsData} from '../../data/newMemory';
import {
  notificationSvg as NotificationSvg,
  noReviewSvg as ReviewSvg,
} from '../../../assets/Icons/Svgs';
import ReviewsCard from '../../components/ReviewsCard';
import CustomRatingStars from '../../components/CustomStarReviewRating/CustomStarRating';
import {useIsFocused} from '@react-navigation/native';
import Snackbar from 'react-native-snackbar';
import {get_reviews} from '../../services/api-confog';
import {useSelector} from 'react-redux';
import {usePostApiMutation} from '../../services/service';
import {baseUrl} from '../../constants';
import {ActivityIndicator} from 'react-native';
import {wp} from '../../util';

function ReviewsScreen({navigation}) {
  const styles = useThemeAwareObject(createStyles);
  const token = useSelector(state => state.user.token);
  const isFocused = useIsFocused();
  const [reviewCall, reviewResponse] = usePostApiMutation();
  const [isFetching, setIsFetching] = useState(true);
  const [defaultRating, setDefaultRating] = useState(2);
  const [maxRating, setMaxRating] = useState([1, 2, 3, 4, 5]);
  const [ratingData, setRatingData] = useState([]);
  // Filled Star. You can also give the path from local
  const starImageFilled = require('../../../assets/images/star.png');
  // Empty Star. You can also give the path from local
  const starImageCorner = require('../../../assets/images/emptyStar.png');
  const halfImageStart = require('../../../assets/images/halfStar.png');
  useEffect(() => {
    onRefresh();
  }, []);
  const onRefresh = () => {
    setIsFetching(false);
  };

  useEffect(() => {
    if (isFocused) {
      getReview();
    }
  }, [isFocused]);

  async function getReview() {
    let apiData = {
      url: get_reviews,
      method: 'GET',
      token: token,
    };
    try {
      let res = await reviewCall(apiData).unwrap();
      if (res.status == 200) {
        setRatingData(res.data.userReview);
      } else {
        Snackbar.show({
          text: res?.message,
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    } catch (e) {}
  }

  const renderEmptyContainer = () => {
    return (
      <View style={styles.activityView}>
        <ReviewSvg />
        <Text style={styles.emptyMessageStyle}>No reviews available</Text>
      </View>
    );
  };
  const renderReviews = ({item}) => {
    return (
      item.review_employee && (
        <ReviewsCard
          stars={
            <CustomRatingStars
              rating={item?.rating_employee ?? 0}
              maxRating={maxRating}
              disabled
              starSize={styles.starSize}
            />
          }
          description={item?.review_employee}
          title={item?.employee?.name}
          profileImage={
            item?.employee?.image
              ? {uri: baseUrl.base + '/' + item?.employee?.image}
              : require('../../components/ImagePicker/Icons/avatar-placeholder.png')
          }
        />
      )
    );
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
        centerComponent={<Text style={styles.headerInitialText}>Reviews</Text>}
      />
      {reviewResponse.isLoading ? (
        <View style={styles.activityView}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlatList
          contentContainerStyle={styles.container}
          data={ratingData}
          renderItem={renderReviews}
          refreshing={isFetching}
          onRefresh={getReview}
          keyExtractor={item => item?.name}
          ListEmptyComponent={renderEmptyContainer}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          ListFooterComponent={() => null}
          ListFooterComponentStyle={styles.footerStyle}
        />
      )}
    </View>
  );
}

export default ReviewsScreen;
