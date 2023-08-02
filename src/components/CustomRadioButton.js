import React from 'react';
import {View} from 'react-native';

import RadioForm from 'react-native-simple-radio-button';
import {hp, wp} from '../util';

export default function ReactSimpleButton(props) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: hp(2),
        marginBottom: hp(2),
        paddingLeft: hp(1.5),
      }}>
      <RadioForm
        formHorizontal={true}
        labelHorizontal={true}
        buttonColor={'black'}
        selectedButtonColor={'black'}
        animation={true}
        buttonSize={hp(1)}
        buttonOuterSize={hp(2.4)}
        radio_props={props.options}
        style={{
          width: wp(50),
          justifyContent: 'space-between',
        }}
        initial={0} //initial value of this group
        onPress={props.setChosenOption} //if the user changes options, set the new value
      />
    </View>
  );
}
