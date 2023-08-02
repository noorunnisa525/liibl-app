import {wp, hp} from '../util/index';

export const colors = {
  purple: '#d06ffe',
  mediumPurple: '#d06ffe',
  lightPurple: '#efdefa',
  darkGray: '#888',
  lightGray: '#ccc',
  white: '#fff',
  black: '#000',
  red: '#ff0f0f',
  blue: '#1f247a',
  textGray: '#748B9B',
};

export const fontsSize = {
  extraSmall: hp(1.5),
  small: hp(2),
  medium: hp(2.2),
  large: hp(4),
  extraLarge: hp(5),
};

export const borders = {
  buttonBorder: 10,
  inputRadius: 15,
  circleRadius: 90,
  headerRadius: 40,
};

export const fonts = {
  fontFamilyBold: 'SofiaPro-Bold',
  fontFamilyItalicBold: 'SofiaPro-BoldItalic',
  fontFamilyExtraLight: 'SofiaPro-ExtraLight',
  fontFamilyItalicLight: 'SofiaPro-ExtraLightItalic',
  fontFamilyLight: 'SofiaPro-Light',
  fontFamilyItalic: 'SofiaPro-Italic',
  fontFamilyMedium: 'SofiaPro-Medium',
  fontFamilyItalicMedium: 'SofiaPro-MediumItalic',
  fontFamilySemiBold: 'SofiaPro-SemiBold',
  fontFamilyItalicSemiBold: 'SofiaPro-SemiBoldItalic',
};

export const baseUrl = {
  apiUrl: 'http://192.46.229.46/api',
  base: 'http://192.46.229.46/',
  socket: 'http://163.172.62.21:5200/',
};

export const mapStyle = [
  {
    elementType: 'geometry',
    stylers: [
      {
        color: '#f5f5f5',
      },
    ],
  },
  {
    elementType: 'labels.icon',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#737373',
      },
    ],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#f5f5f5',
      },
    ],
  },
  {
    featureType: 'administrative.land_parcel',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#bdbdbd',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [
      {
        color: '#eeeeee',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#737373',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [
      {
        color: '#e5e5e5',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9e9e9e',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [
      {
        color: '#ffffff',
      },
    ],
  },
  {
    featureType: 'road.arterial',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#757575',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [
      {
        color: '#dadada',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#616161',
      },
    ],
  },
  {
    featureType: 'road.local',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9e9e9e',
      },
    ],
  },
  {
    featureType: 'transit.line',
    elementType: 'geometry',
    stylers: [
      {
        color: '#e5e5e5',
      },
    ],
  },
  {
    featureType: 'transit.station',
    elementType: 'geometry',
    stylers: [
      {
        color: '#eeeeee',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [
      {
        color: '#c9c9c9',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9e9e9e',
      },
    ],
  },
];
