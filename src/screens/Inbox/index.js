import React, {useEffect, useRef, useState} from 'react';
import {ActivityIndicator, Image, TouchableOpacity, View} from 'react-native';
import {Bubble, GiftedChat, InputToolbar, Send} from 'react-native-gifted-chat';
import Snackbar from 'react-native-snackbar';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useSelector} from 'react-redux';
import io from 'socket.io-client';
import moment from 'moment';
import {sendIconSvg as SendIconSvg} from '../../../assets/Icons/Svgs';
import Header from '../../components/CustomHeader';
import Text from '../../components/CustomText';
import {baseUrl} from '../../constants';
import {
  add_message,
  chat_list,
  create_chat,
  find_chat,
} from '../../services/api-confog';
import {usePostApiMutation} from '../../services/service';
import {useThemeAwareObject} from '../../theme/index';
import {hp, wp} from '../../util';
import createStyles from './styles';

function Inbox({navigation, route}) {
  const styles = useThemeAwareObject(createStyles);
  const user = useSelector(state => state.user.currentUserData);
  const token = useSelector(state => state.user.token);

  const [findChatCall, findResponse] = usePostApiMutation();
  const [chatListCall, chatListResponse] = usePostApiMutation();
  const [createMessageCall, createMessageResponse] = usePostApiMutation();
  const [addMessageCall, addMessageResponse] = usePostApiMutation();

  const [convoFound, setConvoFound] = useState(false);
  const [convoId, setConvoId] = useState(null);
  const [page, setPage] = useState(1);
  const [apiCalling, setApiCalling] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState(true);
  const date = moment().format('Do MMMM, YYYY');

  const socket = useRef(null);

  useEffect(() => {
    getChatData();
    return () => {
      socket.current.close();
    };
  }, []);

  useEffect(() => {
    socket.current = io(`${baseUrl.socket}`, {
      transports: ['websocket'],
      jsonp: false,
      forceNew: true,
    });
  }, []);

  useEffect(() => {
    socket.current.on('message_receive', msg => {
      if (msg.message.user._id == user?.id) {
      } else {
        if (msg.message.conversation == convoId) {
          setMessages([msg.message, ...messages]);
        }
      }
    });
  }, [convoId, messages]);

  async function getChatData() {
    setLoadingMessage(true);
    let findData = {
      receiver_id: route.params.id,
    };
    let findApiData = {
      url: find_chat,
      method: 'POST',
      token: token,
      data: findData,
    };
    try {
      let res = await findChatCall(findApiData).unwrap();
      if (res.status == 200) {
        if (res.message != 'No Chat Found') {
          setConvoFound(true);
          setConvoId(res.data[0].chat_id);
          setApiCalling(false);
          let chatData = {
            chat_id: res.data[0].chat_id,
          };
          let chatApiData = {
            url: `${chat_list}${1}`,
            method: 'POST',
            token: token,
            data: chatData,
          };

          try {
            let res = await chatListCall(chatApiData).unwrap();
            setLoadingMessage(false);
            if (res.status == 200) {
              if (res.data.message.data.length == 20) {
                setApiCalling(true);
              }
              let temp = [];
              res.data.message.data.map(item => {
                let chatTemp = {};
                chatTemp['_id'] = item.id;
                chatTemp['text'] = item.message;
                chatTemp['createdAt'] = moment(item.created_at);
                chatTemp['user'] = {
                  _id: item.sender.id,
                  avatar:
                    item.sender.image == null
                      ? `https://ui-avatars.com/api/?background=${
                          item.sender.id == user.id ? 'black' : 'white'
                        }&color=FFF&name=${item.sender.name}`
                      : baseUrl.base + '/' + item.sender.image,
                  name: item.sender.name,
                };
                temp.push(chatTemp);
              });

              let dateSort = temp.sort(function compare(a, b) {
                var dateA = new Date(a.createdAt);
                var dateB = new Date(b.createdAt);
                return dateB - dateA;
              });
              setMessages([...dateSort]);
              setLoading(false);
            } else {
              Snackbar.show({
                text: res?.message,
                duration: Snackbar.LENGTH_SHORT,
              });
              setLoading(false);
            }
          } catch (e) {
            setLoading(false);
          }
        } else {
          setLoading(false);
          setConvoFound(false);
        }
      } else {
        setLoading(false);
        setConvoFound(false);
        Snackbar.show({
          text: res?.message,
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    } catch (e) {
      setLoading(false);
    }
  }

  async function fetchMoreChat(page) {
    setLoadingMessage(true);
    setApiCalling(false);
    let chatData = {
      chat_id: convoId,
    };
    let chatApiData = {
      url: `${chat_list}${page}`,
      method: 'POST',
      token: token,
      data: chatData,
    };

    try {
      let res = await chatListCall(chatApiData).unwrap();
      setLoadingMessage(false);
      if (res.status == 200) {
        if (res.data.message.data.length == 20) {
          setApiCalling(true);
        }
        let temp = [];
        res.data.message.data.map(item => {
          let chatTemp = {};
          chatTemp['_id'] = item.id;
          chatTemp['text'] = item.message;
          chatTemp['createdAt'] = moment(item.created_at);
          chatTemp['user'] = {
            _id: item.sender.id,
            avatar:
              item.sender.image == null
                ? `https://ui-avatars.com/api/?background=${
                    item.sender.id == user.id ? 'black' : 'white'
                  }&color=FFF&name=${item.sender.name}`
                : baseUrl.base + '/' + item.sender.image,
            name: item.sender.name,
          };
          temp.push(chatTemp);
        });

        let dateSort = temp.sort(function compare(a, b) {
          var dateA = new Date(a.createdAt);
          var dateB = new Date(b.createdAt);
          return dateB - dateA;
        });

        setMessages([...messages, ...dateSort]);
        setLoading(false);
      } else {
        Snackbar.show({
          text: res?.message,
          duration: Snackbar.LENGTH_SHORT,
        });
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
    }
  }

  function renderSend(props) {
    return (
      <Send {...props}>
        <View style={styles.messageButton}>
          <SendIconSvg />
        </View>
      </Send>
    );
  }

  function onSend(messages = []) {
    if (messages[0].text != '') {
      if (!convoFound) {
        initializeChat(messages[0].text, null, messages);
        setMessages(previousMessages =>
          GiftedChat.append(previousMessages, messages),
        );
      } else {
        addMessagetoChat(messages[0].text, null, messages);
        setMessages(previousMessages =>
          GiftedChat.append(previousMessages, messages),
        );
      }
    } else {
      Snackbar.show({
        text: 'Enter some text before pressing SEND',
        duration: Snackbar.LENGTH_SHORT,
      });
    }
  }

  async function initializeChat(text, form, message) {
    if (text == null) {
      let createApiData = {
        url: create_chat,
        method: 'POST',
        token: token,
        data: form,
      };
      try {
        let res = await createMessageCall(createApiData).unwrap();
        if (res.status == 200) {
          setConvoFound(true);
          setConvoId(res.data.chat.id);
        } else {
          setConvoFound(false);
        }
      } catch (e) {}
    } else {
      let createData = {
        receiver_id: route.params.id,
        type: 'text',
        message: text,
        sender_id: user?.id,
      };
      let createApiData = {
        url: create_chat,
        method: 'POST',
        token: token,
        data: createData,
      };
      try {
        let res = await createMessageCall(createApiData).unwrap();
        if (res.status == 200) {
          setConvoFound(true);
          setConvoId(res.data.chat.id);
          socket.current.emit('message_send', {
            message: {
              _id: message[0]._id,
              conversation: res.data.chat.id,
              text: message[0].text,
              messageType: 'message',
              createdAt: message[0].createdAt,
              user: {
                _id: user?.id,
                avatar:
                  user.image == null
                    ? `https://ui-avatars.com/api/?background=${'black'}&color=FFF&name=${
                        user.name
                      }`
                    : baseUrl.base + '/' + user.image,
                name: user?.name,
              },
            },
          });
        } else {
          setConvoFound(false);
        }
      } catch (e) {}
    }
  }

  async function addMessagetoChat(text, form, message) {
    if (text == null) {
      let addApiData = {
        url: add_message,
        method: 'POST',
        token: token,
        data: form,
      };
      try {
        let res = await addMessageCall(addApiData).unwrap();
        if (res.status == 200) {
          setConvoFound(true);
          setConvoId(res.data.chat.id);
        } else {
          setConvoFound(false);
        }
      } catch (e) {}
    } else {
      let createData = {
        chat_id: convoId,
        type: 'text',
        message: text,
      };
      let addApiData = {
        url: add_message,
        method: 'POST',
        token: token,
        data: createData,
      };
      try {
        let res = await addMessageCall(addApiData).unwrap();
        if (res.status == 200) {
          setConvoFound(true);
          setConvoId(res.data.chat.id);
          socket.current.emit('message_send', {
            message: {
              _id: message[0]._id,
              conversation: res.data.chat.id,
              text: message[0].text,
              messageType: 'message',
              createdAt: message[0].createdAt,
              user: {
                _id: user?.id,
                avatar:
                  user.image == null
                    ? `https://ui-avatars.com/api/?background=${'black'}&color=FFF&name=${
                        user.name
                      }`
                    : baseUrl.base + '/' + user.image,
                name: user?.name,
              },
            },
          });
        } else {
          setConvoFound(false);
        }
      } catch (e) {}
    }
  }

  function renderInputToolbar(props) {
    return (
      <InputToolbar
        {...props}
        containerStyle={styles.renderInputStyle}
        multiline={false}
      />
    );
  }

  function renderBubble(props) {
    var messageBelongsToCurrentUser = user?.id == props.currentMessage.user._id;
    if (props.currentMessage.type == 'image') {
      let hold = [];
      let multi = false;

      hold = props.currentMessage?.file_path?.split(',');
    } else {
      return (
        <View>
          <Bubble
            {...props}
            textStyle={{
              right: {color: 'white', fontFamily: 'SofiaPro-SemiBold'},
              left: {
                color: 'black',
                fontFamily: 'SofiaPro-SemiBold',
              },
            }}
            wrapperStyle={{
              right: {
                backgroundColor: 'black',
                borderBottomRightRadius: 0,
                borderTopRightRadius: 20,
                borderTopLeftRadius: 20,
                marginBottom: hp(0.5),
              },
              left: {
                backgroundColor: 'white',
                borderBottomRightRadius: 20,
                borderTopRightRadius: 20,
                borderTopLeftRadius: 20,
                borderBottomLeftRadius: 0,
                borderWidth: hp(0.1),
                borderColor: 'black',
                marginBottom: hp(0.5),
              },
            }}
          />
          <Text
            style={
              messageBelongsToCurrentUser
                ? styles.currentUserTime
                : styles.otherUserTime
            }>
            {moment(props.currentMessage.createdAt).format('LT')}
          </Text>
        </View>
      );
    }
  }

  return (
    <View style={styles.mainContainer}>
      <Header
        placement={'center'}
        barStyle={'dark-content'}
        containerStyle={styles.headerContainerStyle}
        backgroundColor={styles.headerColor}
        statusBarProps={styles.headerColor}
        centerComponent={
          <View style={styles.middleContainer}>
            <Image
              source={{uri: baseUrl.base + '/' + route.params.image}}
              style={styles.middleContainerImage}
              resizeMode={'contain'}
            />
            <Text numberOfLines={1} style={styles.headerInitialText}>
              {route.params.name}
            </Text>
          </View>
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
      <View style={{backgroundColor: '#ededed'}}>
        <Text style={styles.dateText}>{date}</Text>
      </View>

      <View style={styles.container}>
        {loading ? (
          <View style={styles.activityView}>
            <ActivityIndicator size="large" color={styles.activityColor} />
          </View>
        ) : (
          <GiftedChat
            alwaysShowSend={true}
            messages={messages}
            onSend={messages => {
              onSend(messages);
            }}
            showUserAvatar
            textInputStyle={styles.messageInputStyle}
            user={{
              _id: user?.id,
              avatar:
                user?.image == null
                  ? `https://ui-avatars.com/api/?background=${'black'}&color=FFF&name=${
                      user?.name
                    }`
                  : baseUrl.base + '/' + user?.image,
              name: user?.name,
            }}
            renderInputToolbar={renderInputToolbar}
            renderSend={renderSend}
            renderBubble={renderBubble}
            renderTime={() => null}
            // inverted
            isTyping
            infiniteScroll
            scrollToBottom
            loadEarlier={apiCalling}
            onLoadEarlier={() => {
              if (apiCalling) {
                let tempPage = page + 1;
                setPage(tempPage);
                fetchMoreChat(tempPage);
              }
            }}
          />
        )}
      </View>
    </View>
  );
}
export default Inbox;
