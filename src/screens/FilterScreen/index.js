import React, {useRef, useEffect, useState, useCallback} from 'react';
import {ScrollView, View, TouchableOpacity} from 'react-native';
import Button from '../../components/CustomButton';
import Header from '../../components/CustomHeader';
import Text from '../../components/CustomText';
import {useThemeAwareObject} from '../../theme/index';
import createStyles from './styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useDispatch} from 'react-redux';
import CustomDropDown from '../../components/CustomDropdown';
import Slider from '../../components/RangeSlider';
import {get_categories, get_sub_categories} from '../../services/api-confog';
import Snackbar from 'react-native-snackbar';
import {useParamApiMutation, usePostApiMutation} from '../../services/service';
import {useSelector} from 'react-redux';
import {hp, wp} from '../../util';
import {colors} from '../../constants';

function FilterScreen({navigation}) {
  const otpRef = useRef();
  const styles = useThemeAwareObject(createStyles);
  const [open, setOpen] = useState(false);
  const [openSub, setOpenSub] = useState(false);
  const [categoryValue, setCategoryValue] = useState(null);
  const [subValue, setSubValue] = useState([]);
  const [subCategoryValues, setSubCategoryValues] = useState();
  const [subCategories, setSubCategories] = useState([]);
  const [categoriesCall, getCategoriesResponse] = usePostApiMutation();
  const [subCategoriesCall, subCategoriesResponse] = useParamApiMutation();
  const accessToken = useSelector(state => state.user.token);
  const [category, setCategory] = useState([]);
  const [rating, setRating] = useState(null);
  const [distance, setDistance] = useState(null);
  useEffect(() => {
    otpRef?.current?.focusField(0);
  });
  useEffect(() => {
    getCategoriesApi();
  }, []);

  useEffect(() => {
    if (subValue?.length > 0) {
      let values = [];
      subValue.forEach(item => {
        let found = subCategories.find(el => el.value == item);
        values.push(found);
        setSubCategoryValues(values);
      });
    }
  }, [subValue]);

  const getCategoriesApi = async () => {
    let apiData = {
      url: get_categories,
      method: 'GET',
    };
    try {
      let getCategoryList = await categoriesCall(apiData).unwrap();
      if (getCategoryList.statusCode == 200) {
        let tempCategory = getCategoryList?.Data?.map(item => ({
          label: item.name,
          value: item.id,
        }));
        setCategory(tempCategory);
      } else {
        Snackbar.show({
          text: getCategoryList?.message,
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    } catch (e) {
      Snackbar.show({
        text: 'Network Error',
        duration: Snackbar.LENGTH_SHORT,
      });
    }
  };
  const getSubCategoriesApi = async id => {
    setSubCategories([]);
    setSubValue([]);
    setSubCategoryValues([]);
    let apiData = {
      url: get_sub_categories,
      params: `category_id=${id}`,
      method: 'GET',
      token: accessToken,
    };
    try {
      let getSubCategoryList = await subCategoriesCall(apiData).unwrap();
      if (getSubCategoryList.statusCode == 200) {
        let tempSubCategories = getSubCategoryList?.Data?.map(item => ({
          label: item.name,
          value: item.id,
        }));
        setSubCategories(tempSubCategories);
      } else {
        Snackbar.show({
          text: getSubCategoryList?.message,
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    } catch (e) {
      Snackbar.show({
        text: 'Network Error',
        duration: Snackbar.LENGTH_SHORT,
      });
    }
  };

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
            />
          </TouchableOpacity>
        }
        rightComponent={
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => navigation.navigate('Home', {filter: false})}>
            <MaterialIcons name={'refresh'} size={wp(6)} color={'black'} />
          </TouchableOpacity>
        }
        centerComponent={<Text style={styles.headerInitialText}>Filter</Text>}
      />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps="always">
        <View style={styles.optContainer}>
          <View>
            <Text style={styles.textFieldTitle}>Job Category</Text>
            <CustomDropDown
              value={categoryValue}
              disable={getCategoriesResponse.isLoading}
              setValue={setCategoryValue}
              onChangeValue={id => {
                getSubCategoriesApi(id);
              }}
              open={open}
              setOpen={setOpen}
              items={category}
              zIndex={10}
              setItems={setCategory}
              placeholder={'Select Job Category'}
            />
            <Text style={styles.textFieldTitle}>Job Sub-Category</Text>
            <CustomDropDown
              value={subValue}
              disabled={subCategoriesResponse.isLoading}
              setValue={setSubValue}
              open={openSub}
              zIndex={5}
              setOpen={setOpenSub}
              items={subCategories}
              multiple={true}
              setItems={setSubCategories}
              placeholder={'Select Job Sub-Category'}
            />
            <Text style={styles.textFieldTitle}>Rating</Text>
            <View
              style={{
                marginTop: hp(1),
                paddingLeft: wp(2.5),
                paddingRight: wp(2.5),
              }}>
              <Slider
                minimum={0}
                maximum={5}
                value={rating ?? 0}
                slideComplete={value => setRating(parseFloat(value.toFixed(2)))}
              />
              <Text style={styles.ratingText}>{rating}</Text>
            </View>
            <Text style={styles.textFieldTitle}>Distance</Text>
            <View
              style={{
                marginTop: hp(1),
                paddingLeft: wp(2.5),
                paddingRight: wp(2.5),
              }}>
              <Slider
                minimum={0}
                maximum={50}
                value={distance ?? 0}
                slideComplete={value =>
                  setDistance(parseFloat(value.toFixed(1)))
                }
              />
              <Text style={styles.ratingText}>
                {distance ?? 0}{' '}
                {distance ? (distance == 0 ? 'mile' : 'miles') : 'mile'}{' '}
              </Text>
            </View>
          </View>
        </View>
        <Button
          style={[styles.filterButton, styles.filterButtonText]}
          title1="Apply Filter"
          disabled={
            subValue?.length == 0 && !categoryValue && !rating && !distance
          }
          onPress={() =>
            navigation.navigate('Home', {
              subValue: subCategoryValues,
              categoryValue,
              rating,
              distance,
              filter: true,
            })
          }
        />
      </ScrollView>
    </View>
  );
}

export default FilterScreen;
