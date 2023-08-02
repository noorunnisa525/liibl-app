import React, {useRef, useEffect, useState} from 'react';
import {ScrollView, View, TouchableOpacity} from 'react-native';
import Header from '../../components/CustomHeader';
import Text from '../../components/CustomText';
import {useThemeAwareObject} from '../../theme/index';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import createStyles from './styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import PaymentScreenCard from '../../components/PaymentScreenCard';
import SubscriptionCard from '../../components/SubscriptionCard';
import {useRoute} from '@react-navigation/native';
import {wp} from '../../util';

function Checkout({navigation}) {
  const otpRef = useRef();
  const styles = useThemeAwareObject(createStyles);
  const [isSelected, setSelection] = useState(true);
  const [selectedSub, setSelectedSubs] = useState(false);
  const route = useRoute();
  const {subscriptionType} = route.params;
  const {selectedSubscription} = route.params;
  const {selectedSubscriptionType} = route.params;
  const {subDescription} = route.params;

  useEffect(() => {
    otpRef?.current?.focusField(0);
  });
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
        centerComponent={<Text style={styles.headerInitialText}>Payment</Text>}
      />
      <KeyboardAwareScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps="always">
        <SubscriptionCard
          name={subscriptionType}
          isSelected={isSelected}
          description={subDescription}
          // setSelection={() => setSelection(true)}
        />
        <PaymentScreenCard
          navigation={navigation}
          subscriptionType={subscriptionType}
          selectedSubscription={selectedSubscription}
          selectedSubscriptionType={selectedSubscriptionType}
        />
      </KeyboardAwareScrollView>
    </View>
  );
}

export default Checkout;
