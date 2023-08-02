import React, {useRef, useEffect, useState, useCallback} from 'react';
import {View, FlatList, ActivityIndicator} from 'react-native';
import Header from '../../components/CustomHeader';
import Text from '../../components/CustomText';
import {useThemeAwareObject} from '../../theme/index';
import createStyles from './styles';
import {
  notificationSvg as NotificationSvg,
  noJobSvg as JobSvg,
} from '../../../assets/Icons/Svgs';
import CustomTopBar from '../../components/CustomTopBar';
import PostedJobCard from '../../components/PostedJobCard';
import FastImage from 'react-native-fast-image';
import ActiveJobCard from '../../components/ActiveJobCard';
import CompletedJobCard from '../../components/CompletedJobCard';
import {useSelector} from 'react-redux';
import {
  active_job,
  completed_job,
  posted_job,
  progress_job,
} from '../../services/api-confog';
import Snackbar from 'react-native-snackbar';
import {usePostApiMutation} from '../../services/service';
import {useIsFocused, useRoute} from '@react-navigation/native';
import {hp, wp} from '../../util';

function OurJobs({navigation}) {
  const route = useRoute();
  const otpRef = useRef();
  const token = useSelector(state => state.user.token);
  const isFocused = useIsFocused();
  const [postedCall, postedResponse] = usePostApiMutation();
  const [activeCall, activeResponse] = usePostApiMutation();
  const [progressCall, progressResponse] = usePostApiMutation();
  const [completedCall, completedResponse] = usePostApiMutation();

  const styles = useThemeAwareObject(createStyles);
  const [selectedTab, setSelectedTab] = useState(
    route?.params?.tab ?? 'Posted',
  );
  const [isFetching, setIsFetching] = useState(true);
  const [postedLoading, setPostedLoading] = useState(true);
  const [postedApiCalling, setPostedApiCalling] = useState(false);
  const [postedPage, setPostedPage] = useState(1);
  const [postedData, setPostedData] = useState([]);
  const [activeLoading, setActiveLoading] = useState(true);
  const [activeApiCalling, setActiveApiCalling] = useState(false);
  const [activePage, setActivePage] = useState(1);
  const [activeData, setActiveData] = useState([]);
  const [progressLoading, setProgressLoading] = useState(true);
  const [progressApiCalling, setProgressApiCalling] = useState(false);
  const [progressPage, setProgressPage] = useState(1);
  const [progressData, setProgressData] = useState([]);
  const [completedLoading, setCompletedLoading] = useState(true);
  const [completedApiCalling, setCompletedApiCalling] = useState(false);
  const [completedPage, setCompletedPage] = useState(1);
  const [completedData, setCompletedData] = useState([]);

  const renderEmptyContainer = () => {
    return (
      <View style={styles.activityView}>
        <JobSvg />
        <Text style={styles.emptyMessageStyle}>No jobs available</Text>
      </View>
    );
  };

  useEffect(() => {
    onRefresh();
  }, []);

  const onRefresh = () => {
    setIsFetching(false);
  };

  useEffect(() => {
    if (isFocused) {
      getPostedJob();
      getActiveJob();
      getProgressJob();
      getCompletedJob();
      setSelectedTab(route?.params?.tab ?? 'Posted');
    }
  }, [isFocused]);

  async function getPostedJob() {
    setPostedApiCalling(false);
    let apiData = {
      url: `${posted_job}${1}`,
      method: 'GET',
      token: token,
    };
    try {
      let res = await postedCall(apiData).unwrap();
      if (res.statusCode == 200) {
        setPostedApiCalling(true);
        setPostedData([...res.Data.data]);
        setPostedLoading(false);
      } else {
        setPostedLoading(false);
        Snackbar.show({
          text: res?.Message,
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    } catch (e) {
      setPostedLoading(false);
    }
  }

  async function fetchNextPostedJob(postedPage) {
    setPostedApiCalling(false);
    let apiData = {
      url: `${posted_job}${postedPage}`,
      method: 'GET',
      token: token,
    };
    try {
      let res = await postedCall(apiData).unwrap();
      if (res.statusCode == 200) {
        setPostedApiCalling(true);
        setPostedData([...postedData, ...res.Data.data]);
        setPostedLoading(false);
      } else {
        Snackbar.show({
          text: res?.Message,
          duration: Snackbar.LENGTH_SHORT,
        });
        setPostedLoading(false);
      }
    } catch (e) {
      setPostedLoading(false);
    }
  }

  async function getActiveJob() {
    setActiveApiCalling(false);
    let apiData = {
      url: `${active_job}${1}`,
      method: 'GET',
      token: token,
    };
    try {
      let res = await activeCall(apiData).unwrap();
      if (res.statusCode == 200) {
        setActiveApiCalling(true);
        setActiveData([...res.Data.data]);
        setActiveLoading(false);
      } else {
        setActiveLoading(false);
        Snackbar.show({
          text: res?.Message,
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    } catch (e) {
      setActiveLoading(false);
    }
  }

  async function fetchNextActiveJob(activePage) {
    setActiveApiCalling(false);
    let apiData = {
      url: `${active_job}${activePage}`,
      method: 'GET',
      token: token,
    };
    try {
      let res = await activeCall(apiData).unwrap();
      if (res.statusCode == 200) {
        setActiveApiCalling(true);
        setActiveData([...activeData, ...res.Data.data]);
        setActiveLoading(false);
      } else {
        Snackbar.show({
          text: res?.Message,
          duration: Snackbar.LENGTH_SHORT,
        });
        setActiveLoading(false);
      }
    } catch (e) {
      setActiveLoading(false);
    }
  }

  async function getProgressJob() {
    setProgressApiCalling(false);
    let apiData = {
      url: `${progress_job}${1}`,
      method: 'GET',
      token: token,
    };
    try {
      let res = await progressCall(apiData).unwrap();
      if (res.statusCode == 200) {
        setProgressApiCalling(true);
        setProgressData([...res.Data.data]);
        setProgressLoading(false);
      } else {
        setProgressLoading(false);
        Snackbar.show({
          text: res?.Message,
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    } catch (e) {
      setProgressLoading(false);
    }
  }

  async function fetchNextProgressJob(progressPage) {
    setProgressApiCalling(false);
    let apiData = {
      url: `${progress_job}${progressPage}`,
      method: 'GET',
      token: token,
    };
    try {
      let res = await progressCall(apiData).unwrap();
      if (res.statusCode == 200) {
        setProgressApiCalling(true);
        setProgressData([...progressData, ...res.Data.data]);
        setProgressLoading(false);
      } else {
        Snackbar.show({
          text: res?.Message,
          duration: Snackbar.LENGTH_SHORT,
        });
        setProgressLoading(false);
      }
    } catch (e) {
      setProgressLoading(false);
    }
  }

  async function getCompletedJob() {
    setCompletedApiCalling(false);
    let apiData = {
      url: `${completed_job}${1}`,
      method: 'GET',
      token: token,
    };
    try {
      let res = await completedCall(apiData).unwrap();
      if (res.statusCode == 200) {
        setCompletedApiCalling(true);
        setCompletedData([...res.Data.data]);
        setCompletedLoading(false);
      } else {
        setCompletedLoading(false);
        Snackbar.show({
          text: res?.Message,
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    } catch (e) {
      setCompletedLoading(false);
    }
  }

  async function fetchNextCompletedJob(completedPage) {
    setCompletedApiCalling(false);
    let apiData = {
      url: `${completed_job}${completedPage}`,
      method: 'GET',
      token: token,
    };
    try {
      let res = await completedCall(apiData).unwrap();
      if (res.statusCode == 200) {
        setCompletedApiCalling(true);
        setCompletedData([...completedData, ...res.Data.data]);
        setCompletedLoading(false);
      } else {
        Snackbar.show({
          text: res?.Message,
          duration: Snackbar.LENGTH_SHORT,
        });
        setCompletedLoading(false);
      }
    } catch (e) {
      setCompletedLoading(false);
    }
  }

  const renderPost = ({item}) => {
    return (
      <PostedJobCard
        onPressHeader={() => navigation.navigate('Proposals', {id: item.id})}
        name={item.title}
        category={item.category?.name}
        skills={item.required_skills}
        taskCardStyle={styles.profileCardStyle}
        price={item.amount}
        date={item.date}
        time={`${item.start_time}-${item.end_time}`}
        description={item.description}
        proposalCount={item.proposal_count}
        featured={item.is_featured}
      />
    );
  };

  const renderActive = ({item}) => {
    return (
      <ActiveJobCard
        onPressHeader={() =>
          navigation.navigate('ActiveJobDetails', {id: item.id})
        }
        name={item?.employee?.name}
        category={item?.category?.name}
        skills={item?.required_skills}
        taskCardStyle={styles.profileCardStyle}
        price={item?.amount}
        title={item?.title}
        profileImage={item?.employee?.image}
        date={item?.date}
        time={`${item.start_time}-${item.end_time}`}
        description={item?.descriptions}
      />
    );
  };

  const renderProgress = ({item}) => {
    return (
      <ActiveJobCard
        onPressHeader={() =>
          navigation.navigate('InProgressJobDetails', {id: item.id})
        }
        name={item?.employee?.name}
        category={item?.category?.name}
        skills={item?.required_skills}
        taskCardStyle={styles.profileCardStyle}
        price={item?.amount}
        title={item?.title}
        profileImage={item?.employee?.image}
        date={item?.date}
        time={`${item.start_time}-${item.end_time}`}
        description={item?.descriptions}
      />
    );
  };

  const renderComplete = ({item}) => {
    return (
      <CompletedJobCard
        onPressHeader={() =>
          navigation.navigate('CompleteJobDetails', {
            id: item.id,
            status: item.status,
          })
        }
        name={item?.employee?.name}
        category={item?.category?.name}
        skills={item?.required_skills}
        taskCardStyle={styles.profileCardStyle}
        price={item?.amount}
        title={item?.title}
        profileImage={item?.employee?.image}
        date={item?.date}
        time={`${item.start_time}-${item.end_time}`}
        description={item?.descriptions}
      />
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
        centerComponent={<Text style={styles.headerInitialText}>Our Jobs</Text>}
        // rightComponent={<NotificationSvg />}
      />
      <CustomTopBar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      <View style={styles.container}>
        {selectedTab == 'Posted' &&
          (postedLoading ? (
            <View style={styles.activityView}>
              <ActivityIndicator size="large" />
            </View>
          ) : (
            <FlatList
              data={postedData}
              contentContainerStyle={{
                flexGrow: 1,
              }}
              renderItem={renderPost}
              refreshing={isFetching}
              onRefresh={getPostedJob}
              keyExtractor={item => item.id}
              ListEmptyComponent={renderEmptyContainer}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              onEndReachedThreshold={0.8}
              onEndReached={() => {
                if (postedApiCalling) {
                  let tempPage = postedPage + 1;
                  setPostedPage(tempPage);
                  fetchNextPostedJob(tempPage);
                }
              }}
              ListFooterComponent={() => null}
              ListFooterComponentStyle={
                postedData.length > 0 && styles.footerStyle
              }
            />
          ))}
        {selectedTab == 'Active' &&
          (activeLoading ? (
            <View style={styles.activityView}>
              <ActivityIndicator size="large" />
            </View>
          ) : (
            <FlatList
              data={activeData}
              contentContainerStyle={{
                flexGrow: 1,
              }}
              renderItem={renderActive}
              refreshing={isFetching}
              onRefresh={getActiveJob}
              keyExtractor={item => item.id}
              ListEmptyComponent={renderEmptyContainer}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              onEndReachedThreshold={0.8}
              onEndReached={() => {
                if (activeApiCalling) {
                  let tempPage = activePage + 1;
                  setActivePage(tempPage);
                  fetchNextActiveJob(tempPage);
                }
              }}
              ListFooterComponent={() => null}
              ListFooterComponentStyle={
                activeData.length > 0 && styles.footerStyle
              }
            />
          ))}
        {selectedTab == 'InProgress' &&
          (progressLoading ? (
            <View style={styles.activityView}>
              <ActivityIndicator size="large" />
            </View>
          ) : (
            <FlatList
              data={progressData}
              contentContainerStyle={{
                flexGrow: 1,
              }}
              renderItem={renderProgress}
              refreshing={isFetching}
              onRefresh={getProgressJob}
              keyExtractor={item => item.id}
              ListEmptyComponent={renderEmptyContainer}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              onEndReachedThreshold={0.8}
              onEndReached={() => {
                if (progressApiCalling) {
                  let tempPage = progressPage + 1;
                  setProgressPage(tempPage);
                  fetchNextProgressJob(tempPage);
                }
              }}
              ListFooterComponent={() => null}
              ListFooterComponentStyle={
                progressData.length > 0 && styles.footerStyle
              }
            />
          ))}
        {selectedTab == 'completed' &&
          (completedLoading ? (
            <View style={styles.activityView}>
              <ActivityIndicator size="large" />
            </View>
          ) : (
            <FlatList
              data={completedData}
              contentContainerStyle={{
                flexGrow: 1,
              }}
              renderItem={renderComplete}
              refreshing={isFetching}
              onRefresh={getCompletedJob}
              keyExtractor={item => item.id}
              ListEmptyComponent={renderEmptyContainer}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              onEndReachedThreshold={0.8}
              onEndReached={() => {
                if (completedApiCalling) {
                  let tempPage = completedPage + 1;
                  setCompletedPage(tempPage);
                  fetchNextCompletedJob(tempPage);
                }
              }}
              ListFooterComponent={() => null}
              ListFooterComponentStyle={
                completedData.length > 0 && styles.footerStyle
              }
            />
          ))}
      </View>
    </View>
  );
}

export default OurJobs;
