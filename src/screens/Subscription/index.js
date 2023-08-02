import React, {useRef, useEffect, useState} from 'react';
import {
  ScrollView,
  View,
  TouchableOpacity,
  FlatList,
  BackHandler,
} from 'react-native';
import Button from '../../components/CustomButton';
import Header from '../../components/CustomHeader';
import Text from '../../components/CustomText';
import {useThemeAwareObject} from '../../theme/index';
import createStyles from './styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SubscriptionCard from '../../components/SubscriptionCard';
import {get_subscription} from '../../services/api-confog';
import {usePostApiMutation} from '../../services/service';
import {useSelector} from 'react-redux';
import {useRoute} from '@react-navigation/native';
import Snackbar from 'react-native-snackbar';
import {wp} from '../../util';

function Subscription({navigation}) {
  const route = useRoute();

  const styles = useThemeAwareObject(createStyles);
  const [isSelected, setSelection] = useState(true);

  const [getSubscriptionCall, subscriptionResponse] = usePostApiMutation();
  const token = useSelector(state => state.user.tempToken);
  const [subscriptionList, setSubscriptionList] = useState();

  const [subscriptionType, setSubscriptionType] = useState();
  const [subDescription, setSubDescription] = useState();
  const [selectedSubscriptionType, setSelectedSubscriptionType] = useState();
  const [isFetching, setIsFetching] = useState(true);
  const [selectedSubscription, setSelectedSubs] = useState(0);
  useEffect(() => {
    onRefresh();
  }, []);
  const onRefresh = () => {
    setIsFetching(false);
  };

  useEffect(() => {
    const backAction = () => {
      navigation.reset({
        index: 0,
        routes: [{name: 'Login'}],
      });
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  //api getCategories
  const getSubscriptionApi = async () => {
    let apiData = {
      url: get_subscription,
      method: 'GET',
      token: token,
    };
    try {
      let getCategoryList = await getSubscriptionCall(apiData).unwrap();
      if (getCategoryList.statusCode == 200) {
        setIsFetching(false);
        setSubscriptionList(getCategoryList.Data);
      } else {
        Snackbar.show({
          text: getCategoryList?.message,
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    } catch (e) {}
  };
  const renderEmptyContainer = () => {
    return (
      <View style={styles.emptyListStyle}>
        {!isFetching && (
          <Text style={styles.emptyMessageStyle}>
            No subscription available
          </Text>
        )}
      </View>
    );
  };
  const renderSubscription = ({item}) => {
    return (
      <SubscriptionCard
        onPressCard={() => {
          setSelectedSubs(item.id);
          setSelectedSubscriptionType(item.type);
          setSubscriptionType(
            item.amount != 0
              ? '$' + item.amount + '/' + item?.title
              : item.title,
          );
          setSubDescription(item.description);
        }}
        subscriptionCard={
          selectedSubscription !== item.id
            ? styles.subscriptionCard
            : styles.listItem
        }
        titleStyle={selectedSubscription !== item.id && styles.title}
        name={
          item.amount != 0 ? '$' + item.amount + '/' + item?.title : item.title
        }
        description={item.description}
        isSelected={selectedSubscription == item.id && isSelected}
        setSelection={() => setSelection(true)}
        conditionText={selectedSubscription !== item.id && styles.checkBoxText}
        icon={selectedSubscription !== item.id ? false : true}
      />
    );
  };
  useEffect(() => {
    setIsFetching(true);
    getSubscriptionApi();
  }, []);

  return (
    <View style={styles.mainContainer}>
      <Header
        placement={'center'}
        barStyle={'dark-content'}
        containerStyle={styles.headerContainerStyle}
        backgroundColor={styles.headerColor}
        statusBarProps={styles.headerColor}
        centerComponent={
          <Text style={styles.headerInitialText}>Subscription</Text>
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
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps="always">
        <View style={styles.optContainer}>
          <FlatList
            data={subscriptionList}
            renderItem={renderSubscription}
            // refreshing={isFetching}
            // onRefresh={onRefresh}
            keyExtractor={item => item?.name}
            ListEmptyComponent={renderEmptyContainer}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          />
        </View>
        <Button
          style={[styles.subscriptionButton, styles.subsText]}
          title1="Continue with selected plan"
          onPress={() => {
            if (selectedSubscription != 0) {
              navigation.navigate('Checkout', {
                subscriptionType,
                selectedSubscription,
                selectedSubscriptionType,
                subDescription,
              });
            } else {
              Snackbar.show({
                text: 'Please select a subscription package',
                duration: Snackbar.LENGTH_SHORT,
              });
            }
          }}
        />
      </ScrollView>
    </View>
  );
}

export default Subscription;
