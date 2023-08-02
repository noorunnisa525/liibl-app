import React, {useRef, useEffect, useState} from 'react';
import {ScrollView, View, TouchableOpacity} from 'react-native';
import Button from '../../components/CustomButton';
import Header from '../../components/CustomHeader';
import Text from '../../components/CustomText';
import {useThemeAwareObject} from '../../theme/index';
import createStyles from './styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import PaymentScreenCard from '../../components/PaymentScreenCard';
import {useDispatch} from 'react-redux';
import DialogModal from '../../components/DialogModal';
import FastImage from 'react-native-fast-image';
import {wp} from '../../util';

function AddNewCard({navigation}) {
  const otpRef = useRef();
  const styles = useThemeAwareObject(createStyles);
  const [submit, setSubmit] = useState(false);

  const dispatch = useDispatch();

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
        centerComponent={
          <Text style={styles.headerInitialText}>Add New Card</Text>
        }
      />
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps="always">
        <View style={styles.optContainer}>
          <PaymentScreenCard
            navigation={navigation}
            addNewCard
            setSubmit={setSubmit}
            submit={submit}
          />
        </View>
        <DialogModal
          visible={submit}
          dialogStyle={styles.dialogStyle}
          children={
            <>
              <FastImage
                resizeMode="contain"
                style={styles.thumbStyle}
                source={require('../../../assets/images/thumb.png')}
              />
              <Text style={styles.responseText}>
                Your card is added successfully!
              </Text>
              <Button
                style={[styles.responseButton, styles.completedJobButtonText]}
                title1="OK"
                onPress={() => {
                  setSubmit(false);
                  navigation.pop();
                }}
              />
            </>
          }
        />
      </ScrollView>
    </View>
  );
}

export default AddNewCard;
