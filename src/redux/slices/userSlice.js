import {createSlice} from '@reduxjs/toolkit';

const userSlicer = createSlice({
  name: 'user',
  initialState: {
    welcome: true,
    userData: null,
    user: null,
    business: null,
    tempToken: null,
    token: null,
    type: null,
    user_profile_pic: {},
    user_profile_pic_size: {},
    user_profile_pic_name: '',
    first_name: '',
    last_name: '',
    isLogin: false,
    editModeFlag: false,
    forgetPasswordFlag: false,
    currentUserData: {},
    getEmployees: [],
    getFilteredEmployees: [],
  },

  reducers: {
    setGetEmployees: (state, action) => {
      state.getEmployees = action.payload;
    },
    setGetFilteredEmployees: (state, action) => {
      state.getFilteredEmployees = action.payload;
    },
    setEditModeFlag: (state, action) => {
      state.editModeFlag = action.payload;
    },
    setUser: (state, action) => {
      state.userData = action.payload;
    },
    setUserByEmail: (state, action) => {
      state.user = action.payload;
    },
    setUserFirstName: (state, action) => {
      state.first_name = action.payload;
    },
    setUserLastName: (state, action) => {
      state.last_name = action.payload;
    },

    setToken: (state, action) => {
      state.token = action.payload;
    },

    setTempToken: (state, action) => {
      state.tempToken = action.payload;
    },
    // logOut: (state, action) => {
    //   state.initialState = action.payload;
    // },
    setProfilePic: (state, action) => {
      state.user_profile_pic = action.payload;
    },
    setProfilePicSiza: (state, action) => {
      state.user_profile_pic_size = action.payload;
    },
    setProfilePicName: (state, action) => {
      state.user_profile_pic_name = action.payload;
    },
    logOut: (state, action) => {
      state.isLogin = action.payload;
    },
    onLogin: (state, action) => {
      state.isLogin = action.payload;
    },
    setForgetPasswordFlag: (state, action) => {
      state.forgetPasswordFlag = action.payload;
    },
    setCurrentUserData: (state, action) => {
      state.currentUserData = action.payload;
    },
    setWelcome: (state, action) => {
      state.welcome = action.payload;
    },
  },
});

export const {
  setUser,
  setToken,
  setTempToken,
  logOut,
  setProfilePic,
  setProfilePicSiza,
  setProfilePicName,
  setUserFirstName,
  setUserLastName,
  setUserByEmail,
  onLogin,
  setEditModeFlag,
  setForgetPasswordFlag,
  setCurrentUserData,
  setGetEmployees,
  setGetFilteredEmployees,
  setWelcome,
} = userSlicer.actions;

export default userSlicer.reducer;
