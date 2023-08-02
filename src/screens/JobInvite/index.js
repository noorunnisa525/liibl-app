import React, {useEffect, useState} from 'react';
import {
  FlatList,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Button from '../../components/CustomButton';
import Header from '../../components/CustomHeader';
import Text from '../../components/CustomText';
import {useThemeAwareObject} from '../../theme/index';
import createStyles from './styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {profileData} from '../../data/newMemory';
import PeopleCard from '../../components/PeopleCard';
import DialogModal from '../../components/DialogModal';
import {
  notificationSvg as NotificationSvg,
  noJobSvg as JobSvg,
} from '../../../assets/Icons/Svgs';
import FastImage from 'react-native-fast-image';
import {hp, wp} from '../../util';
import {useSelector} from 'react-redux';
import Snackbar from 'react-native-snackbar';
import {invites_job} from '../../services/api-confog';
import {usePostApiMutation} from '../../services/service';
function JobInvite({navigation}) {
  const styles = useThemeAwareObject(createStyles);
  const token = useSelector(state => state.user.token);
  const [inviteCall, inviteResponse] = usePostApiMutation();
  const [isFetching, setIsFetching] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [Item, setItem] = useState();
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(true);
  const [inviteApiCalling, setInviteApiCalling] = useState(false);
  const [invitePage, setInvitePage] = useState(1);
  const [inviteData, setInviteData] = useState([]);
  useEffect(() => {
    onRefresh();
  }, []);

  useEffect(() => {
    getInviteJobs();
  }, []);

  async function getInviteJobs() {
    setInviteApiCalling(false);
    let apiData = {
      url: `${invites_job}${1}`,
      method: 'GET',
      token: token,
    };
    try {
      let res = await inviteCall(apiData).unwrap();
      if (res.statusCode == 200) {
        setInviteApiCalling(true);
        setInviteData([...res.Data.data]);
        setInviteLoading(false);
      } else {
        setInviteLoading(false);
        Snackbar.show({
          text: res?.Message,
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    } catch (e) {
      setInviteLoading(false);
    }
  }

  async function fetchNextInviteJob(invitePage) {
    setInviteApiCalling(false);
    let apiData = {
      url: `${invites_job}${invitePage}`,
      method: 'GET',
      token: token,
    };
    try {
      let res = await inviteCall(apiData).unwrap();
      if (res.statusCode == 200) {
        setInviteApiCalling(true);
        setInviteData([...inviteData, ...res.Data.data]);
        setInviteLoading(false);
      } else {
        Snackbar.show({
          text: res?.message,
          duration: Snackbar.LENGTH_SHORT,
        });
        setInviteLoading(false);
      }
    } catch (e) {
      setInviteLoading(false);
    }
  }

  const onRefresh = () => {
    setIsFetching(false);
  };

  const renderEmptyContainer = () => {
    return (
      <View style={styles.activityView}>
        <JobSvg />
        <Text style={styles.emptyMessageStyle}>No job invites available</Text>
      </View>
    );
  };
  const renderPeople = ({item}) => {
    return (
      <PeopleCard
        viewProposals
        name={item?.employee?.name}
        category={item?.job?.category?.name}
        experience={item?.experience}
        img={item?.employee?.image}
        description={item?.job?.description}
        JobInvite
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
          <Text style={styles.headerInitialText}>Job Invites</Text>
        }
      />
      <View style={styles.container}>
        {inviteLoading ? (
          <View style={styles.activityView}>
            <ActivityIndicator size="large" />
          </View>
        ) : (
          <FlatList
            data={inviteData}
            contentContainerStyle={{
              flexGrow: 1,
            }}
            renderItem={renderPeople}
            refreshing={isFetching}
            onRefresh={getInviteJobs}
            keyExtractor={item => item?.name}
            ListEmptyComponent={renderEmptyContainer}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            onEndReachedThreshold={0.8}
            onEndReached={() => {
              if (inviteApiCalling) {
                let tempPage = invitePage + 1;
                setInvitePage(tempPage);
                fetchNextInviteJob(tempPage);
              }
            }}
            ListFooterComponent={() => null}
            ListFooterComponentStyle={styles.footerStyle}
          />
        )}
        {/* <DialogModal
          visible={openModal}
          dialogStyle={styles.dialogStyle}
          children={
            <>
              <View style={styles.cardStyle}>
                <PeopleCard
                  // onPressProposal={() => {
                  //   setOpenModal(true), setItem(item);
                  // }}
                  listStyle={styles.listStyle}
                  name={Item?.name}
                  category={Item?.category}
                  experience={Item?.experience}
                  taskCardStyle={styles?.profileCardStyle}
                  price={Item?.price}
                  img={Item?.image}
                  date={Item?.date}
                  time={Item?.time}
                  description={Item?.descriptions}
                />
                <TouchableOpacity
                  style={{
                    marginTop: hp(3),
                    width: hp(4),
                    height: hp(5),
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onPress={() => setOpenModal(false)}>
                  <CloseSvg onPressClose={() => setOpenModal(false)} />
                </TouchableOpacity>
              </View>
              <Text style={styles.ProposalText}>Proposal</Text>
              <Text style={styles.responseText}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Enim,
                gravida faucibus maecen. Vel pellentesque velit. Suspendisse
                lorem purus. {'\n'}
                {'\n'} Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Enim, gravida faucibus ecenas. Vel pellentesque velit.
              </Text>
              <Button
                style={[styles.inviteButton, styles.inviteText]}
                title1="Send Hire Invite"
                onPress={() => {
                  setOpenModal(false);
                  setOpenSuccessModal(true);
                }}
              />
            </>
          }
        />
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
              <Text style={styles.responseTextt}>
                Hire invite has been sent to the user. we {'\n'}will let you
                know their respnse.
              </Text>
              <Button
                style={[styles.responseButton, styles.responseButtonText]}
                title1="OK"
                onPress={() => {
                  setOpenSuccessModal(false);
                }}
              />
            </>
          }
        /> */}
      </View>
    </View>
  );
}

export default JobInvite;
