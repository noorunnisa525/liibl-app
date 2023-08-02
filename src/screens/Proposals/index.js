import React, {useEffect, useState} from 'react';
import {
  FlatList,
  View,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  BackHandler,
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
import {closeSvg as CloseSvg} from '../../../assets/Icons/Svgs';
import FastImage from 'react-native-fast-image';
import {hp, wp} from '../../util';
import {job_proposal, send_hire_invite} from '../../services/api-confog';
import {useSelector} from 'react-redux';
import {usePostApiMutation} from '../../services/service';
import Snackbar from 'react-native-snackbar';
function Proposals({navigation, route}) {
  const styles = useThemeAwareObject(createStyles);
  const token = useSelector(state => state.user.token);
  const [proposalCall, proposalResponse] = usePostApiMutation();
  const [sendHireCall, sendHireResponse] = usePostApiMutation();
  const [isFetching, setIsFetching] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [Item, setItem] = useState();
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [proposalLoading, setProposalLoading] = useState(true);
  const [proposalApiCalling, setProposalApiCalling] = useState(false);
  const [proposalPage, setProposalPage] = useState(1);
  const [proposalData, setProposalData] = useState([]);

  useEffect(() => {
    onRefresh();
  }, []);
  const onRefresh = () => {
    setIsFetching(false);
  };

  useEffect(() => {
    getProposals();
  }, []);

  async function getProposals() {
    setProposalApiCalling(false);
    let apiData = {
      url: `${job_proposal}${1}&job_id=${route?.params?.id}`,
      method: 'GET',
      token: token,
    };
    try {
      let res = await proposalCall(apiData).unwrap();
      if (res.statusCode == 200) {
        setProposalApiCalling(true);
        setProposalData([...res.Data.data]);
        setProposalLoading(false);
      } else {
        setProposalLoading(false);
        Snackbar.show({
          text: res?.Message,
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    } catch (e) {
      setProposalLoading(false);
    }
  }

  async function fetchNextProposalJob(proposalPage) {
    setProposalApiCalling(false);
    let apiData = {
      url: `${job_proposal}${proposalPage}&job_id=${route?.params?.id}`,
      method: 'GET',
      token: token,
    };
    try {
      let res = await proposalCall(apiData).unwrap();
      if (res.statusCode == 200) {
        setProposalApiCalling(true);
        setProposalData([...proposalData, ...res.Data.data]);
        setProposalLoading(false);
      } else {
        Snackbar.show({
          text: res?.Message,
          duration: Snackbar.LENGTH_SHORT,
        });
        setProposalLoading(false);
      }
    } catch (e) {
      setProposalLoading(false);
    }
  }

  const renderEmptyContainer = () => {
    return (
      <View style={styles.emptyView}>
        <Text style={styles.emptyMessageStyle}>No proposals available</Text>
      </View>
    );
  };
  const renderPeople = ({item}) => {
    return (
      <PeopleCard
        viewProposals
        name={item?.employee?.name}
        category={item?.job?.category?.name}
        img={item?.employee?.image}
        onPressProposal={() => {
          setOpenModal(true);
          setItem(item);
        }}
      />
    );
  };

  useEffect(() => {
    const backAction = () => {
      navigation.navigate('OurJobs', {
        tab: 'Posted',
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
                tab: 'Posted',
              });
            }}>
            <MaterialIcons
              name={'keyboard-arrow-left'}
              size={wp(7)}
              color={'black'}
              onPress={() => {
                navigation.navigate('OurJobs', {
                  tab: 'Posted',
                });
              }}
            />
          </TouchableOpacity>
        }
        centerComponent={
          <Text style={styles.headerInitialText}>Proposals</Text>
        }
      />
      <View style={styles.container}>
        {proposalLoading ? (
          <View style={styles.activityView}>
            <ActivityIndicator size="large" />
          </View>
        ) : (
          <FlatList
            data={proposalData}
            renderItem={renderPeople}
            refreshing={isFetching}
            onRefresh={getProposals}
            contentContainerStyle={{flexGrow: 1}}
            keyExtractor={item => item?.name}
            ListEmptyComponent={renderEmptyContainer}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            onEndReachedThreshold={0.8}
            onEndReached={() => {
              if (proposalApiCalling) {
                let tempPage = proposalPage + 1;
                setProposalPage(tempPage);
                fetchNextProposalJob(tempPage);
              }
            }}
            ListFooterComponent={() => null}
            ListFooterComponentStyle={
              proposalData.length > 0 && styles.footerStyle
            }
          />
        )}
      </View>
      <DialogModal
        visible={openModal}
        children={
          <>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.cardStyle}>
                <PeopleCard
                  mainContainer={styles.proposalModalHeader}
                  listStyle={styles.listHeaderStyle}
                  name={Item?.employee?.name}
                  category={Item?.job?.category?.name}
                  img={Item?.employee?.image}
                />
                <TouchableOpacity onPress={() => setOpenModal(false)}>
                  <CloseSvg onPressClose={() => setOpenModal(false)} />
                </TouchableOpacity>
              </View>
              <Text style={styles.ProposalText}>Proposal</Text>
              <Text style={styles.responseText}>{Item?.description}</Text>
              {Item?.status == 'pending' ? (
                <Button
                  style={[styles.inviteButton, styles.inviteText]}
                  loading={sendHireResponse.isLoading}
                  title1="Send Hire Invite"
                  onPress={async () => {
                    let form = new FormData();
                    form.append('proposal_id', Item.id);
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
                        setOpenModal(false);
                        setOpenSuccessModal(true);
                        getProposals();
                      } else {
                        Snackbar.show({
                          text: res?.message,
                          duration: Snackbar.LENGTH_SHORT,
                        });
                      }
                    } catch (e) {}
                  }}
                />
              ) : Item?.status == 'approved' ? (
                <Text style={styles.statusText}>Invitation Already Sent</Text>
              ) : Item?.status == 'reject' ? (
                <Text style={styles.statusText}>Invitation Rejected</Text>
              ) : null}
            </ScrollView>
          </>
        }
      />
      <DialogModal
        visible={openSuccessModal}
        children={
          <>
            <FastImage
              resizeMode="contain"
              style={styles.thumbStyle}
              source={require('../../../assets/images/thumb.png')}
            />
            <Text style={styles.hireInviteSuccess}>
              Hire invite has been sent to the user. We will let you know their
              response.
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
      />
    </View>
  );
}

export default Proposals;
