import React, {useEffect, useState} from 'react';
import {ScrollView, View, Image} from 'react-native';
import Button from '../../components/CustomButton';
import Header from '../../components/CustomHeader';
import Text from '../../components/CustomText';
import {useThemeAwareObject} from '../../theme/index';
import createStyles from './styles';
import {usePostApiMutation} from '../../services/service';
import {useDispatch} from 'react-redux';
import {setWelcome} from '../../redux/slices/userSlice';

function Welcome({navigation}) {
  const styles = useThemeAwareObject(createStyles);
  const [getUserCall, userResponse] = usePostApiMutation();
  const dispatch = useDispatch();

  return (
    <View style={styles.mainContainer}>
      <Header
        placement={'center'}
        barStyle={'light-content'}
        containerStyle={styles.headerContainerStyle}
        backgroundColor={styles.headerColor}
      />
      <Image
        source={require('../../../assets/images/lybleIcon.png')}
        style={styles.headerImage}
        resizeMode={'contain'}
      />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps="always">
        <View>
          <Text style={styles.loginText}>Welcome!</Text>
          <Text style={styles.subText}>
            Lorem ipsum dolor sit amet,consectetur {'\n'} adipiscing elit.
            Consectetur et consequat,{'\n'}facilisi elementum pharetra. Commodo
            turpis{'\n'} mi aenean elementum nec urna.{'\n'} {'\n'}Fermentum
            molestie nec nunc,etiam turpis {'\n'}viverra arcu at quis. Eleifend
            amet lectus {'\n'} tortor id nec mi. Dui tincidunt lectus dolor, dui
            {'\n'}
            vitae enim rhoncus lorem. Sed volutpat{'\n'} consectetur nulla ipsum
            viverra turpis. {'\n'}
          </Text>
        </View>
        <Button
          style={[styles.getStartedButton, styles.getStartedText]}
          title1="Get Started"
          onPress={() => {
            navigation.navigate('Login');
            dispatch(setWelcome(false));
          }}
        />
      </ScrollView>
    </View>
  );
}

export default Welcome;
