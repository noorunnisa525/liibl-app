import React, {useRef, useEffect, useState} from 'react';
import {
  ScrollView,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import Button from '../../components/CustomButton';
import Header from '../../components/CustomHeader';
import Text from '../../components/CustomText';
import {useThemeAwareObject} from '../../theme/index';
import createStyles from './styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ManageCard from '../../components/ManageCards';
import Snackbar from 'react-native-snackbar';
import {useSelector} from 'react-redux';
import DialogModal from '../../components/DialogModal';
import FastImage from 'react-native-fast-image';
import {useIsFocused} from '@react-navigation/native';
import {get_user_cards} from '../../services/api-confog';
import {usePostApiMutation} from '../../services/service';
import {wp} from '../../util';
function ManageCards({navigation}) {
  const styles = useThemeAwareObject(createStyles);
  const isFocused = useIsFocused();
  const [cardCall, cardResponse] = usePostApiMutation();
  const [cards, setCards] = useState([]);
  const token = useSelector(state => state.user.token);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    if (isFocused) {
      getCards();
    }
  }, [isFocused]);

  useEffect(() => {
    onRefresh();
  }, []);

  const onRefresh = () => {
    setIsFetching(false);
  };

  async function getCards() {
    let apiData = {
      url: get_user_cards,
      method: 'GET',
      token,
    };
    try {
      let res = await cardCall(apiData).unwrap();
      if (res.status == 200) {
        setCards(res.data);
      } else {
        Snackbar.show({
          text: res?.Message,
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    } catch (e) {}
  }

  function renderCards({item}) {
    return (
      <ManageCard
        id={item.id}
        name={item.name}
        cardNumber={item.last_four}
        expiry={`${item.exp_month}/${item.exp_year}`}
        svg={item.brand}
        default={item.is_default == 1 ? true : false}
        getCard={() => getCards()}
      />
    );
  }

  const renderEmptyContainer = () => {
    return (
      <View style={styles.activityView}>
        <Text style={styles.emptyMessageStyle}>No cards available</Text>
      </View>
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
          <Text style={styles.headerInitialText}>Manage Cards</Text>
        }
      />
      {cardResponse.isLoading ? (
        <View style={styles.activityView}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <>
          <FlatList
            contentContainerStyle={styles.container}
            data={cards}
            renderItem={renderCards}
            keyExtractor={item => item.id}
            ListEmptyComponent={renderEmptyContainer}
            showsVerticalScrollIndicator={false}
            refreshing={isFetching}
            onRefresh={getCards}
          />

          <Button
            style={[styles.subscriptionButton, styles.subsText]}
            title1="Add New Card"
            onPress={() => navigation.navigate('AddNewCard')}
          />
        </>
      )}
    </View>
  );
}

export default ManageCards;
