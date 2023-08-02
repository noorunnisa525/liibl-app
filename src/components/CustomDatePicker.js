import React, {useState} from 'react';
import {Platform, StyleSheet, TouchableOpacity, View} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import ReactNativeModal from 'react-native-modal';
import moment from 'moment';
import {useThemeAwareObject} from '../theme/index';
import {hp, wp} from '../util';
import Text from './CustomText';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  calenderSvg as CalenderSvg,
  clockSvg,
  clockSvg as ClockSvg,
} from '../../assets/Icons/Svgs';
const CustomDatePicker = ({
  onChange,
  type,
  value,
  maxDate,
  minDate,
  profile,
  customDateView,
  setCurrentDate,
}) => {
  const createStyles = theme => {
    const themeStyles = StyleSheet.create({
      dateView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: hp(0.1),
        borderColor: 'lightgray',
        height: hp(6),
        // marginBottom: hp(1.5),
      },
      dateTimeColor: {
        marginLeft: wp(0.5),
        fontSize: theme.size.xsmall,
        fontFamily: theme.fontFamily.mediumFamily,
      },
    });
    return themeStyles;
  };
  const styles = useThemeAwareObject(createStyles);
  const [date, setDate] = useState(value);
  const [mode, setMode] = useState('');
  const [show, setShow] = useState(false);

  const _onChange = (event, value) => {
    if (event.type == 'dismissed') {
      setShow(Platform.OS === 'ios');
    } else {
      const currentDate = value;
      // setCurrentDate(currentDate);
      setShow(Platform.OS === 'ios');
      setDate(currentDate);
      if (mode == 'time') {
        onChange(moment(currentDate));
      }
      if (mode == 'date') {
        onChange(moment(currentDate));
      }
    }
  };

  const showMode = currentMode => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          type == 'date' ? showDatepicker() : showTimepicker();
        }}
        style={{paddingBottom: 10}}>
        <View style={[styles.dateView, customDateView]}>
          {/* <Calendar marginLeft={hp(-0.5)} /> */}
          <Text style={styles.dateTimeColor}>
            {profile
              ? date
              : type == 'date'
              ? moment(date).format('LL')
              : moment(date).format('hh:mm a')}
          </Text>
          {type == 'date' ? (
            <CalenderSvg onPressDateTimePicker={() => showDatepicker()} />
          ) : (
            <ClockSvg onPressClockSvg={() => showTimepicker()} />
          )}
        </View>
      </TouchableOpacity>
      {show && Platform.OS != 'ios' && (
        <DateTimePicker
          testID="dateTimePicker"
          value={new Date(value)}
          mode={mode}
          is24Hour={false}
          display="spinner"
          onChange={_onChange}
          maximumDate={maxDate}
          minimumDate={minDate}
          themeVariant={'light'}
        />
      )}
      {show && Platform.OS == 'ios' && (
        <ReactNativeModal
          isVisible={show}
          onBackButtonPress={() => {
            setShow(false);
          }}
          onBackdropPress={() => {
            setShow(false);
          }}
          onRequestClose={() => {
            setShow(false);
          }}
          hasBackdrop
          backdropOpacity={0.5}
          backdropColor="#000">
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 10,
              padding: 10,
              shadowColor: '#000',
              shadowOffset: {width: 0, height: 0},
              shadowOpacity: 0.5,
              paddingBottom: 20,
            }}>
            <DateTimePicker
              testID="dateTimePicker"
              value={new Date(value)}
              mode={mode}
              is24Hour={false}
              display="spinner"
              onChange={_onChange}
              maximumDate={maxDate}
              minimumDate={minDate}
              themeVariant={'light'}
            />
          </View>
        </ReactNativeModal>
      )}
    </>
  );
};

export default CustomDatePicker;
