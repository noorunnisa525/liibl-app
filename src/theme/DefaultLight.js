import {borders, colors, fontsSize, fonts} from '../constants/index';

const DEFAULT_LIGHT_COLOR_THEME = {
  backgroundColor: colors.purple,
  headerBackgroundColor: colors.lightPurple,
  textWhite: colors.white,
  textBlack: colors.black,
  textRed: colors.red,
  avatarColor: colors.darkGray,
  dividerColor: colors.lightGray,
  tabColor: colors.blue,
  textGray: colors.textGray,
};

const FONT_SET = {
  size: {
    xSmall: fontsSize.extraSmall,
    small: fontsSize.small,
    medium: fontsSize.medium,
    large: fontsSize.large,
    xLarge: fontsSize.extraLarge,
  },
};
const FONT_FAMILY = {
  lightFamily: fonts.fontFamilyLight,
  lightItalicFamily: fonts.fontFamilyItalicLight,
  boldFamily: fonts.fontFamilyBold,
  boldItalicFamily: fonts.fontFamilyItalicBold,
  semiBoldFamily: fonts.fontFamilySemiBold,
  semiBoldItalicFamily: fonts.semiBoldItalicFamily,
  mediumItalicFamily: fonts.mediumItalicFamily,
  mediumFamily: fonts.fontFamilyMedium,
};

const BORDER_RADIUS = {
  radius1: borders.buttonBorder,
  radius2: borders.inputRadius,
  radius3: borders.headerRadius,
  radius4: borders.circleRadius,
};

export const DEFAULT_LIGHT_THEME_ID = 'default-light';

export const DEFAULT_LIGHT_THEME = {
  id: DEFAULT_LIGHT_THEME_ID,
  color: DEFAULT_LIGHT_COLOR_THEME,
  size: FONT_SET.size,
  borders: BORDER_RADIUS,
  fontFamily: FONT_FAMILY,
};
