import React from 'react';
import {useKeyboard} from '@react-native-community/hooks';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {
  homeSvg as HomeSvg,
  homeActiveSvg as HomeActiveSvg,
  workSvg as WorkSvg,
  workActiveSvg as WorkActiveSvg,
  plusSvg as PlusSvg,
  chatActiveSvg as ChatAvtiveSvg,
  chatSvg as ChatSvg,
  accountSvg as AccountSvg,
  accountActiveSvg as AccountActiveSvg,
} from '../../assets/Icons/Svgs';
import Home from '../screens/Home';
import OurJobs from '../screens/OurJobs';
import Chat from '../screens/Chat';
import PostJobs from '../screens/PostJobs';
import Account from '../screens/Account';
import {useThemeAwareObject} from '../theme';
import {hp, wp} from '../util';

import Plus from '../../assets/Icons/plus.svg';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';

const Tab = createBottomTabNavigator();
// const keyboard = useKeyboard();
const TabNavigator = ({route}) => {
  const keyboard = useKeyboard();
  const createStyles = theme => {
    const themeStyles = StyleSheet.create({
      mainContainer: {
        height: wp(15),
        width: wp(15),
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: 'red',
        position: 'absolute',
        bottom: wp(1),
        borderWidth: wp(1),
        borderColor: 'white',
      },

      tabBarContainer: {
        flexDirection: 'row',
        width: wp(100),
        backgroundColor: 'white',
        justifyContent: 'space-around',
        borderTopRightRadius: hp(3),
        borderTopLeftRadius: hp(3),
        borderWidth: 0.4,
        // shadowColor: 'black',
        borderColor: 'white',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,

        elevation: 4,
        position: 'absolute',
        bottom: keyboard.keyboardShown ? -1000 : 0,
      },
      textView: {
        fontSize: wp(2.75),
        position: 'absolute',
        bottom: hp(-2),
      },
      iconView: {
        height: wp(15),
        width: wp(15),
        borderRadius: wp(20),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'black',
        position: 'absolute',
        bottom: hp(0.5),
        borderWidth: wp(0.01),
        borderColor: 'white',
      },
      iconView1: {
        bottom: hp(1.2),
      },
      plusIconStyle: {
        position: 'absolute',
        bottom: hp(1),
        justifyContent: 'center',
        alignItems: 'center',
      },
      textStyle: {
        fontSize: wp(3),
      },
      focusColorStyle: {
        color: 'black',
      },
      nonFocusColorStyle: {
        color: 'black',
      },
      inner: {
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'pink',
      },
      // tabBar: {
      //   position: 'absolute',
      //   bottom: keyboard.keyboardShown ? -1000 : 0,
      // },

      mainTab: {
        height: wp(15),
        width: wp(15),
        borderRadius: 100,
        overflow: 'hidden',
        justifyContent: 'center',
      },
      upperTab: {
        height: wp(14.5),
        width: wp(14.5),
        borderRadius: 100,
        backgroundColor: 'white',
        position: 'absolute',
        alignSelf: 'center',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
      },
      selectedTab: {
        height: wp(12.5),
        width: wp(12.5),
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        alignSelf: 'center',
        backgroundColor: 'white',
        borderRadius: wp(30),
        borderWidth: wp(1),
        borderColor: 'white',
      },
    });
    return themeStyles;
  };
  const styles = useThemeAwareObject(createStyles);
  function MyTabBar({state, descriptors, navigation}) {
    return (
      state.index != 2 && (
        <View style={styles.tabBarContainer}>
          {state.routes.map((route, index) => {
            const {options} = descriptors[route?.key];
            const label =
              options?.tabBarLabel !== undefined
                ? options?.tabBarLabel
                : options?.title !== undefined
                ? options?.title
                : route?.name;
            const isFocused = state?.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route?.key,
                canPreventDefault: true,
              });
              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route?.name);
              }
            };

            const onLongPress = () => {
              navigation.emit({
                type: 'tabLongPress',
                target: route?.key,
              });
            };

            return (
              descriptors[route?.key]?.options?.tabBarHideOnKeyboard && (
                <TouchableOpacity
                  activeOpacity={1}
                  accessibilityRole="button"
                  accessibilityState={isFocused ? {selected: true} : {}}
                  accessibilityLabel={options?.tabBarAccessibilityLabel}
                  testID={options?.tabBarTestID}
                  onPress={onPress}
                  // onLongPress={onLongPress}
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    height: hp(5),
                    justifyContent: 'flex-end',
                    marginBottom: hp(2),
                    // backgroundColor: 'transparent',
                    // borderTopLeftRadius: hp(2),
                    // borderTopRightRadius: hp(2),
                  }}>
                  <TouchableOpacity onPress={onPress} style={styles.inner}>
                    <View style={isFocused ? null : styles.iconView1}></View>
                    <View
                      style={
                        route.name == 'PostJobs'
                          ? styles.iconView
                          : isFocused
                          ? styles.iconView1
                          : styles.iconView1
                      }>
                      {isFocused
                        ? options?.tabBarIconActive
                        : options?.tabBarIconInactive}
                    </View>

                    <Text style={[styles.textView]}>{label}</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              )
            );
          })}
        </View>
      )
    );
  }
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <Tab.Navigator
        tabBar={props => <MyTabBar {...props} />}
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          tabBarHideOnKeyboard: true, // keyboardHidesTabBar: true,
          tabBarStyle: styles.tabBar,
          tabBarAllowFontScaling: false,
          // style: {position: 'absolute'},
          unmountOnBlur: true,
        }}
        backBehavior="initialRoute">
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarLabel: 'Home',
            tabBarIconActive: <HomeActiveSvg />,
            tabBarIconInactive: <HomeSvg />,
          }}
        />
        <Tab.Screen
          name="OurJobs"
          component={OurJobs}
          options={{
            tabBarLabel: 'Our jobs',
            tabBarIconActive: <WorkActiveSvg />,
            tabBarIconInactive: <WorkSvg />,
          }}
        />
        <Tab.Screen
          name="PostJobs"
          component={PostJobs}
          options={{
            tabBarLabel: 'Post a Job',
            tabBarIconActive: <PlusSvg />,
            tabBarIconInactive: <PlusSvg />,
          }}
        />
        <Tab.Screen
          name="Chat"
          component={Chat}
          options={({route}) => ({
            tabBarLabel: 'Chat',
            tabBarIconActive: <ChatAvtiveSvg />,
            tabBarIconInactive: <ChatSvg />,
            tabBarStyle: {
              display:
                getFocusedRouteNameFromRoute(route) == 'PostJobs'
                  ? 'none'
                  : 'flex',
            },
          })}
        />
        <Tab.Screen
          name="Account"
          component={Account}
          options={{
            tabBarLabel: 'Account',
            tabBarIconActive: <AccountActiveSvg />,
            tabBarIconInactive: <AccountSvg />,
          }}
        />
        {/* <Tab.Screen
        name="Shop"
        component={Home}
        options={{
          tabBarLabel: 'Shop',
          tabBarIconActive: <ShopIconF />,
          tabBarIconInactive: <ShopIcon />,
        }}
      />

      <Tab.Screen
        name="Models"
        component={Home}
        options={{
          tabBarLabel: 'Models',
          tabBarIconActive: <ModelIconF />,
          tabBarIconInactive: <ModelIcon />,
        }}
      />
      <Tab.Screen
        name="More"
        component={Home}
        options={{
          tabBarLabel: 'More',
          tabBarIconActive: <MoreIconF />,
          tabBarIconInactive: <MoreIcon />,
        }}

      /> */}
      </Tab.Navigator>
    </View>
  );
};

export default TabNavigator;
