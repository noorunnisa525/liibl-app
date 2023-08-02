import React from 'react';
import {ScrollView, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Text from '../../components/CustomText';
import Header from '../../components/LoggedInHeader';
import PaymentScreen from '../../components/PaymentScreenCard';
import {useThemeAwareObject} from '../../theme/index';
import createStyles from './styles';

function Payment({navigation}) {
  const styles = useThemeAwareObject(createStyles);

  return (
    <View style={styles.mainContainer}>
      <Header
        placement={'center'}
        barStyle={'light-content'}
        containerStyle={styles.headerContainerStyle}
        backgroundColor={styles.headerColor}
      />
      <View style={styles.subContainer}>
        <MaterialCommunityIcons
          name={'keyboard-backspace'}
          size={30}
          color={'black'}
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Text style={styles.headerInitialText}>Payment</Text>
        <View style={{width: '10%'}}></View>
      </View>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps="always">
        <View style={styles.memoryContainer}>
          <PaymentScreen navigation={navigation} />
        </View>
      </ScrollView>
    </View>
  );
}

export default Payment;
