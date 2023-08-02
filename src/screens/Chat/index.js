import React, {useEffect, useState} from 'react';
import {
  FlatList,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Header from '../../components/CustomHeader';
import Text from '../../components/CustomText';
import {useThemeAwareObject} from '../../theme/index';
import createStyles from './styles';
import {profileData} from '../../data/newMemory';
import ChatCard from '../../components/ChatCard';
import {useKeyboard} from '@react-native-community/hooks';
import {
  notificationSvg as NotificationSvg,
  noChatSvg as ChatSvg,
} from '../../../assets/Icons/Svgs';
import SearchBar from '../../components/SearchBar';
import {hp, wp} from '../../util';
import {useSelector} from 'react-redux';
import {usePostApiMutation} from '../../services/service';
import {get_chat} from '../../services/api-confog';
import Snackbar from 'react-native-snackbar';
import {useIsFocused} from '@react-navigation/native';
import moment from 'moment';

function Chat({navigation}) {
  const styles = useThemeAwareObject(createStyles);
  const token = useSelector(state => state.user.token);
  const user = useSelector(state => state.user.currentUserData);

  const focused = useIsFocused();

  const [messagesCall, messagesResponse] = usePostApiMutation();
  const [messageList, setMessageList] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [apiCalling, setApiCalling] = useState(1);
  const [filteredMessages, setFilteredMessages] = useState(messageList);
  const [isFetching, setIsFetching] = useState(true);
  const [searching, setSearching] = useState('');

  useEffect(() => {
    onRefresh();
  }, []);
  const onRefresh = () => {
    setIsFetching(false);
  };

  useEffect(() => {
    focused && getMessages();
  }, [focused]);

  async function getMessages() {
    let apiData = {
      url: `${get_chat}${1}`,
      method: 'GET',
      token: token,
    };
    setApiCalling(false);
    try {
      let res = await messagesCall(apiData).unwrap();
      if (res.status == 200) {
        setMessageList(res.data.data);
        setFilteredMessages(res.data.data);
        setLoading(false);
        setApiCalling(true);
      } else {
        setLoading(false);
        Snackbar.show({
          text: res?.message,
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    } catch (e) {
      setLoading(false);
    }
  }

  async function fetchMoreMessage(page) {
    let apiData = {
      url: `${get_chat}${page}`,
      method: 'GET',
      token: token,
    };
    setApiCalling(false);
    try {
      let res = await messagesCall(apiData).unwrap();
      if (res.status == 200) {
        setMessageList([...messageList, ...res.data.data]);
        setFilteredMessages([...filteredMessages, ...res.data.data]);
        setLoading(false);
        setApiCalling(false);
      } else {
        setLoading(false);
        Snackbar.show({
          text: res?.message,
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    } catch (e) {
      setLoading(false);
    }
  }

  const renderEmptyContainer = () => {
    return (
      <View style={styles.activityView}>
        <ChatSvg />
        <Text style={styles.emptyMessageStyle}>No chat available</Text>
      </View>
    );
  };

  const renderChat = ({item}) => {
    return (
      <ChatCard
        name={
          user.id == item?.sender?.id
            ? item?.receiver?.name
            : item?.sender?.name
        }
        message={
          item?.last_message?.file_path ? 'Image' : item?.last_message?.message
        }
        img={
          user?.id == item.sender.id ? item.receiver.image : item.sender.image
        }
        time={moment(item?.last_message?.created_at).fromNow()}
        onPress={() => {
          navigation.navigate('Inbox', {
            name:
              user.id == item?.sender?.id
                ? item?.receiver?.name
                : item?.sender?.name,
            id:
              user.id == item?.sender?.id
                ? item?.receiver?.id
                : item?.sender?.id,
            image:
              user?.id == item.sender.id
                ? item.receiver.image
                : item.sender.image,
          });
        }}
      />
    );
  };

  const onChangeText = text => {
    if (text) {
      const temp = messageList.filter(function (item) {
        const itemData =
          user.id == item.sender.id
            ? item.receiver.name.toLowerCase()
            : item.sender.name.toLowerCase();
        const textData = text.toLowerCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredMessages(temp);
      setSearching(text);
    } else {
      setFilteredMessages(messageList);
      setSearching(text);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <Header
        placement={'center'}
        barStyle={'dark-content'}
        containerStyle={styles.headerContainerStyle}
        backgroundColor={styles.headerColor}
        statusBarProps={styles.headerColor}
        centerComponent={<Text style={styles.headerInitialText}>Chats</Text>}
        // rightComponent={<NotificationSvg />}
      />
      {loading ? (
        <View style={styles.activityView}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <>
          <SearchBar
            placeholder="Search for Chat"
            value={searching}
            onChangeText={txt => onChangeText(txt)}
            container={{alignSelf: 'center', width: wp(92)}}
          />
          <View style={styles.container}>
            <FlatList
              data={filteredMessages}
              contentContainerStyle={{
                flexGrow: 1,
              }}
              renderItem={renderChat}
              refreshing={isFetching}
              onRefresh={getMessages}
              keyExtractor={item => item?.id}
              ListEmptyComponent={renderEmptyContainer}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              onEndReachedThreshold={0.8}
              onEndReached={() => {
                if (apiCalling) {
                  let tempPage = page + 1;
                  setPage(tempPage);
                  fetchMoreMessage(tempPage);
                }
              }}
              ListFooterComponent={() => null}
              ListFooterComponentStyle={styles.footerStyle}
            />
          </View>
        </>
      )}
    </View>
  );
}
export default Chat;
