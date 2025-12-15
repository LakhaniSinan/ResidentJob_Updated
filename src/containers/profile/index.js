import AsyncStorage from '@react-native-async-storage/async-storage';
import Entypo from '@react-native-vector-icons/entypo';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Image,
  Linking,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import { width } from 'react-native-dimension';
import { launchImageLibrary } from 'react-native-image-picker'; // Import the right package
import { useDispatch, useSelector } from 'react-redux';
import { appIcons, fontFamily } from '../../assets';
import AppHeader from '../../components/appHeader';
import Button from '../../components/button';
import CommonAlert from '../../components/commanAlert';
import CustomCheckBox from '../../components/customcheckBox';
import CustomPicker from '../../components/customPicker';
import Loader from '../../components/loader';
import PhoneInputComponent from '../../components/phoneInput';
import InputField from '../../components/textInput';
import { appColors } from '../../constants';
import { helper } from '../../helper';
import { setUserData } from '../../redux/slices/Login';
import { GetCategory, GetJobTitle } from '../../services/authentication';
import { updateDetails } from '../../services/profile';
import { styles } from './style';


const genders = [{ name: 'Male' }, { name: 'Female' }, { name: 'Others' }];
const national = [
  { name: 'Not Applicable' },
  { name: 'Awaiting Enlistment' },
  { name: 'Others' },
  { name: 'Serving' },
  { name: 'Completed' },
  { name: 'Exempted' },
];
const employmentStatus = [{ name: 'Employed' }, { name: 'Unemployed' }];
const educationLevel = [
  { name: 'DIPLOMA' },
  { name: 'MAPAQ' },
  { name: 'CERTIFICATE' },
  { name: 'HASP' },
];
const ProfileScreen = () => {
  const dispatch = useDispatch();
  const constants = useRef(null);
  const jobPickerRef = useRef();
  const genderRef = useRef();
  const { user } = useSelector(state => state.LoginSlice);
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [categories, setCategories] = useState([]);
  const nationalRef = useRef();
  const employmentStatusRef = useRef();
  const educationLevelRef = useRef();
  const [selectedJob, setSelectedJob] = useState('');
  const [jobTitle, setJobTitle] = useState([]);
  const educationRef = useRef();
  const [openEndDate, setOpenEndDate] = useState('');
  const [openDate, setOpenDate] = useState(false);
  const [showEducationForm, setShowEducationForm] = useState(false);
  const [openStartDate, setOpenStartDate] = useState(false);
  const [showExperiencesForm, setShowExperiencesForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [educationData, setEducationData] = useState([]);
  const [experiencesData, setExperiencesData] = useState([]);
  const [selectedEducationIndex, setSelectedEducationIndex] =
    useState(undefined);
  const [selectedExpIndex, setSelectedExpIndex] = useState(undefined);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);

  const [formData, setFormData] = useState({
    // section#01
    image: '',
    firstname: '',
    lastname: '',
    email: '',
    contact: '',
    countryCode: '',
    aboutMe: '',
    workPass: false,
    lookingJob: false,
    category: '',
    hourlyRate: 0,

    // section#02
    dateOfBirth: null,
    gender: '',
    nationalService: '',
    employmentStatus: '',
    educationalLevel: '',
    expectedYear: '',

    // section#03
    volunteering: '',
    training: '',

    // section#04
    education: '',
    degreeName: '',
    school: '',
    startDate: '',
    endDate: '',
    currentlyStudying: false,

    // section#05
    jobTitle: '',
    company: '',
    responsibilities: '',
    currentlyWorking: false,
    startDate: null,
    endDate: null,
    document: '',

    //section#06
    resumeImage: '',
    supportingDoc: '',
  });

  const onEdit = (item, index) => {
    setSelectedEducationIndex(index);
    setShowEducationForm(true);
    setFormData({
      ...formData,
      education: item?.educationLevel,
      degreeName: item?.degreeName,
      school: item?.school,
      endDate: moment(item.endDate).format('YYYY'),
      startDate: moment(item.startDate).format('YYYY'),
      currentlyStudying: item?.isCurrent,
      document: item?.document || '', // Add document field
    });
  };

  useEffect(() => {
    if (!user) return;

    const u = user.userDetails || {};
    const j = user.jobSeekerDetails || {};

    setSelectedCuisines(j.expertCuisine);
    const firstEdu =
      Array.isArray(j.education) && j.education.length > 0
        ? j.education[0]
        : {};
    const firstExp =
      Array.isArray(j.experience) && j.experience.length > 0
        ? j.experience[0]
        : {};

    const JobName = jobTitle?.find(item => {
      return j?.jobTitle == item?._id;
    });
    console.log(JobName, 'JobNameJobNameJobName');

    setSelectedJob(JobName?.name || '');

    setEducationData(j.education || []);
    setExperiencesData(j.experience || []);

    setFormData(prev => ({
      ...prev,

      // section #01
      image: j.image || '',
      firstname: u.firstname || '',
      lastname: u.lastname || '',
      email: u.email || '',
      contact: u.contact || '',
      countryCode: u.countryCode || '',
      aboutMe: j.about || '',
      workPass: j.isPassRequire || false,
      lookingJob: j.isNeedHelp || false,
      category: j.jobTitle || '',
      hourlyRate: j.hourlyRate || 0,

      // section #02
      dateOfBirth: j.dob || null,
      gender: j.gender || '',
      nationalService: j.nationalServices || '',
      employmentStatus: j.employmentStatus || '',
      educationalLevel: j.educationLevel || '',
      expectedYear: j.graduationYear || '',

      // section #03
      volunteering: j.isVolunteering || false,
      training: j.isTraining || false,

      // section #04 (first education entry)
      education: firstEdu.educationName || '',
      degreeName: firstEdu.degreeName || '',
      school: firstEdu.school || '',
      startDate: firstEdu.startDate || null,
      endDate: firstEdu.endDate || null,
      currentlyStudying: firstEdu.currentlyStudying || false,

      // section #05 (first work-experience entry)
      jobTitle: firstExp.jobTitle || '',
      company: firstExp.company || '',
      responsibilities: firstExp.responsibilities || '',
      currentlyWorking: firstExp.currentlyWorking || false,
      startDateWork: firstExp.startDate || null,
      endDateWork: firstExp.endDate || null,

      // section #06
      resumeImage: j.resumeUrl || '',
      supportingDoc: j.supportDocUrl || '',
    }));
  }, [user, jobTitle]);

  useEffect(() => {
    fetchCategories();
    fetchJobTitle();
  }, []);

  const fetchJobTitle = async () => {
    setIsLoading(true);
    GetJobTitle()
      .then(response => {
        if (response.status == 200) {
          setJobTitle(response.data.data);
        }
      })
      .catch(error => {
        console.log(error, 'errorerrorerrorerror43123124');
      })
      .finally(_ => {
        setIsLoading(false);
      });
  };

  const fetchCategories = async () => {
    GetCategory()
      .then(response => {
        if (response.status == 200) {
          setCategories(response.data.data);
        }
      })
      .catch(error => { })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleAddEducation = () => {
    const {
      education,
      degreeName,
      school,
      startDate,
      endDate,
      currentlyStudying,
      document,
    } = formData;

    let params = {
      educationLevel: education,
      degreeName: degreeName,
      school: school,
      startDate: startDate,
      endDate: endDate,
      isCurrent: currentlyStudying,
      document: document,
    };

    setEducationData(prevEducationData => {
      let tempArray = [...prevEducationData];

      if (selectedEducationIndex !== undefined) {
        tempArray[selectedEducationIndex] = params;
      } else {
        tempArray.push(params);
      }
      return tempArray;
    });

    onAddNewData('education', selectedEducationIndex);
  };

  const handleAddExperiences = () => {
    const {
      jobTitle,
      company,
      responsibilities,
      startDate,
      currentlyWorking,
      endDate,
    } = formData;

    let params = {
      jobTitle: jobTitle,
      companyName: company,
      responsibilities: responsibilities,
      startDate: startDate,
      endDate: endDate,
      isCurrent: currentlyWorking,
    };

    setExperiencesData(prevEducationData => {
      let tempArray = [...prevEducationData];

      if (selectedExpIndex !== undefined) {
        tempArray[selectedExpIndex] = params;
      } else {
        tempArray.push(params);
      }
      return tempArray;
    });
    onAddNewData('experiences', selectedExpIndex);
  };

  const handleChange = (name, value) => {
    setFormData(prev => {
      const next = { ...prev };

      if (name === 'workPass') {
        next.workPass = value;
        next.lookingJob = false;
      } else if (name === 'lookingJob') {
        next.lookingJob = value;
        next.workPass = false;
      } else if (name === 'volunteering') {
        next.volunteering = value;
        next.training = false;
      } else if (name === 'training') {
        next.training = value;
        next.volunteering = false;
      } else {
        next[name] = value;
      }

      return next;
    });
  };

  const handleImagePick = async (type) => {
    try {
      setIsLoading(true)
      const options = { mediaType: 'photo', quality: 0.8 };
      const response = await launchImageLibrary(options);

      if (response.didCancel) {
        console.log('User cancelled image picker');
        return;
      }

      if (response.assets && response.assets.length > 0) {
        const image = response.assets[0];
        const responce = await helper.uploadImageToCloudinary(image);
        if (responce) {
          if (type == 'proImage') {
            setFormData(prevData => ({
              ...prevData,
              image: responce,
            }));
          } else if (type === 'resume') {
            setFormData(prevData => ({
              ...prevData,
              resumeImage: responce,
            }));
          } else if (type === 'supportingDoc') {
            setFormData(prevData => ({
              ...prevData,
              supportingDoc: responce,
            }));
          } else if (type === 'educationDocument') {
            setFormData(prevData => ({
              ...prevData,
              document: responce,
            }));
          }

          constants.current.isVisible({
            status: 'ok',
            message: 'Image uploaded successfully!',
          });
        } else {
          console.log('No response received from upload service');
          Alert.alert('Error', 'Failed to upload image. No response received.');
        }
      }
    } catch (error) {
      console.log('Image picker error:', error);
    } finally {
      setIsLoading(false)
    }
  };

  const onAddNewData = type => {
    setSelectedEducationIndex(undefined);
    setSelectedExpIndex(undefined);
    if (type !== 'experiences') {
      console.log('if chala>>>>>>>');

      setShowEducationForm(!showEducationForm);
      setFormData({
        ...formData,
        education: '',
        school: '',
        degreeName: '',
        startDate: '',
        endDate: '',
        currentlyStudying: false,
        document: '', // Reset document field
      });
    } else {
      console.log('else chala>>>>>>>');
      setShowExperiencesForm(!showExperiencesForm);
      setFormData({
        ...formData,
        jobTitle: '',
        company: '',
        responsibilities: '',
        startDate: '',
        endDate: '',
        currentlyWorking: false,
      });
    }
  };

  const onDelete = index => {
    const updatedData = educationData.filter((_, i) => i !== index);
    setEducationData(updatedData);
  };

  const onExpDelete = index => {
    const updatedData = experiencesData.filter((_, i) => i !== index);
    setExperiencesData(updatedData);
  };

  const handleLogout = () => {
    dispatch(setUserData(null));
    AsyncStorage.removeItem('userData');
  };

  const handleDeleteAccount = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDeleteAccount = () => {
    setShowDeleteConfirm(false);
    setIsLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      setIsLoading(false);
      setShowDeleteSuccess(true);
    }, 2000);
  };

  const cancelDeleteAccount = () => {
    setShowDeleteConfirm(false);
  };

  const onDeleteSuccess = () => {
    setShowDeleteSuccess(false);
    dispatch(setUserData(null));
    AsyncStorage.removeItem('userData');
  };

  const handleCallMe = () => {
    const phoneNumber = formData?.contact || user?.userDetails?.contact;
    if (phoneNumber) {
      const formattedNumber = phoneNumber.startsWith('+')
        ? phoneNumber
        : `+${phoneNumber}`;
      Linking.openURL(`tel:${formattedNumber}`).catch(err => {
        Alert.alert('Error', 'Could not open phone dialer');
      });
    } else {
      Alert.alert('Error', 'No phone number available');
    }
  };

  const onDone = async () => {
    // if (
    //   !formData?.image ||
    //   !formData?.firstname ||
    //   !formData?.lastname ||
    //   !formData?.email ||
    //   !formData?.contact ||
    //   !formData?.countryCode ||
    //   !formData?.aboutMe ||
    //   !formData?.dateOfBirth ||
    //   !formData?.gender ||
    //   !formData?.employmentStatus ||
    //   !formData?.educationalLevel ||
    //   !formData?.expectedYear ||
    //   !formData?.resumeImage ||
    //   !formData?.supportingDoc
    // ) {
    //   Alert.alert('Error', 'All Fields Are Required');
    //   return;
    // } else if (!formData?.workPass || !formData?.lookingJob) {
    //   Alert.alert('Error', 'Please Choose One Of Them');
    //   return;
    // } else if (!formData?.volunteering || !formData?.training) {
    //   Alert.alert('Error', 'Please Choose One Of Them');
    //   return;
    // } else if (educationData?.length == 0) {
    //   Alert.alert('Error', 'At least one education entry is required');
    //   return;
    // } else if (experiencesData?.length == 0) {
    //   Alert.alert('Error', 'At least one experience entry is required');
    //   return;
    // } else {
    console.log(formData?.dateOfBirth, 'ormData?.dateOfBirth');

    if (!formData.image) {
      Alert.alert('Error', 'Please upload profile image');
      return;
    }
    if (!formData.firstname) {
      Alert.alert('Error', 'Please enter first name');
      return;
    }
    if (!formData.lastname) {
      Alert.alert('Error', 'Please enter last name');
      return;
    }
    if (!formData.email) {
      Alert.alert('Error', 'Please enter email');
      return;
    }
    if (!formData.contact) {
      Alert.alert('Error', 'Please enter contact number');
      return;
    }
    if (!formData?.aboutMe) {
      Alert.alert('Error', 'Please enter about details');
      return;
    }
    if (!formData?.gender) {
      Alert.alert('Error', 'Please select gender');
      return;
    }
    if (!formData?.employmentStatus) {
      // Alert.alert('Error', 'Please select gender');
      Alert.alert('Error', 'Please select employment status');
      return;
    }
    if (!formData?.educationalLevel) {
      // Alert.alert('Error', 'Please select gender');
      Alert.alert('Error', 'Please select education level');
      return;
    }
    if (!formData?.dateOfBirth) {
      // Alert.alert('Error', 'Please select gender');
      Alert.alert('Error', 'Please select date of birth');
      return;
    }
    if (!formData?.dateOfBirth) {
      // Alert.alert('Error', 'Please select gender');
      Alert.alert('Error', 'Please select date of birth');
      return;
    }
    if (!formData.category) {
      // Alert.alert('Error', 'Please select gender');
      Alert.alert('Error', 'Please select date of birth');
      return;
    }
    try {
      let params = {
        jobSeekerId: user?.userDetails?._id,
        image: formData?.image,
        firstname: formData?.firstname,
        lastname: formData?.lastname,
        email: formData?.email,
        jobTitle: formData.category,
        expertCuisine: selectedCuisines,
        isPassRequire: formData?.workPass,
        isNeedHelp: formData?.lookingJob,
        contact: formData?.contact,
        countryCode: formData?.countryCode,
        about: formData?.aboutMe,
        dob: formData?.dateOfBirth,
        gender: formData?.gender,
        nationalServices: formData?.nationalService,
        employmentStatus: formData?.employmentStatus,
        educationLevel: formData?.educationalLevel,
        graduationYear: formData?.expectedYear,
        isVolunteering: formData?.volunteering,
        isTraining: formData?.training,
        resumeUrl: formData?.resumeImage,
        startDate: formData?.startDate,
        endDate: formData?.endDate,
        supportDocUrl: formData?.supportingDoc,
        education: educationData,
        experience: experiencesData,
      };

      setIsLoading(true);
      const responce = await updateDetails(params);

      setIsLoading(false);
      if (responce.status == 200 || responce.status == 201) {
        constants.current.isVisible({
          status: 'ok',
          message: responce.data.message,
          handlePressOk: () => {
            let data = {
              ...user,
              jobSeekerDetails: responce?.data?.data,
            };
            dispatch(setUserData(data));
            AsyncStorage.setItem('userData', JSON.stringify(data));
          },
        });
      } else {
        console.log(responce.data, 'responce.data');

        constants.current.isVisible({
          status: 'error',
          message: responce.data.message,
        });
      }
    } catch (error) {
      setIsLoading(false);
      console.log('🚀 ~ onDone ~ error:', error);
    }
  };

  const handleJobSelect = (name, id) => {
    setFormData({ ...formData, category: id });
    setSelectedJob(name);
  };

  const onExpEdit = (item, index) => {
    setSelectedExpIndex(index);
    setShowExperiencesForm(true);
    setFormData({
      ...formData,
      jobTitle: item?.jobTitle,
      company: item?.companyName,
      responsibilities: item?.responsibilities,
      deiscription: '',
      currentlyWorking: item?.isCurrent,
      startDate: item?.startDate,
      endDate: item?.endDate,
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: appColors.white }}>
      <Loader isLoading={isLoading} />
      <AppHeader
        height={width(20)}
        heading={'Profile Screen'}
        headingColor={appColors.white}
        leftIconStyle={{ height: 27, width: 27 }}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        {/* Section No#01 */}
        <View style={styles.containerStyles}>
          <Text style={styles.containerHeading}>Personal info</Text>
          <View
            style={{
              height: width(30),
              width: width(30),
              borderRadius: width(100),
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={
                formData?.image ? { uri: formData?.image } : appIcons.accountIcon
              }
              resizeMode="cover"
              style={{
                height: formData?.image ? '100%' : '50%',
                width: formData?.image ? '100%' : '50%',
                borderRadius: width(100),
              }}
            />
            <TouchableOpacity
              style={{
                position: 'absolute',
                bottom: 5,
                right: 5,
                backgroundColor: appColors.white,
                borderRadius: 20,
                padding: 5,
                elevation: 5,
              }}
              onPress={() => handleImagePick('proImage')}>
              <Entypo name="camera" size={22} color={appColors.black} />
            </TouchableOpacity>
          </View>

          <View style={{ marginTop: width(4) }}>
            <InputField
              value={formData.firstname}
              placeholder="First Name"
              placeholderTextColor={appColors.gray}
              onChangeText={value => handleChange('firstname', value)}
            />
          </View>

          <View style={{ marginTop: width(2) }}>
            <InputField
              value={formData.lastname}
              placeholder="Last Name"
              placeholderTextColor={appColors.gray}
              onChangeText={value => handleChange('lastname', value)}
            />
          </View>

          <View style={{ marginTop: width(2) }}>
            <InputField
              placeholder="Email"
              value={formData.email}
              placeholderTextColor={appColors.gray}
              onChangeText={value => handleChange('email', value)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <PhoneInputComponent
            value={formData?.contact}
            onChangeText={value => handleChange('contact', value)}
            onChangeCountryCode={
              value => {
                console.log(
                  value.callingCode.toString(),
                  'value.callingCode.toString()',
                );
              }
            }
          />

          <View style={{ marginTop: width(3) }}>
            <TouchableOpacity
              onPress={handleCallMe}
              style={{
                backgroundColor: appColors.green,
                paddingVertical: width(3),
                borderRadius: width(100),
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
              }}>
              <Entypo
                name="phone"
                size={20}
                color={appColors.white}
                style={{ marginRight: width(2) }}
              />
              <Text
                style={{
                  color: appColors.white,
                  fontFamily: fontFamily.poppinsSemiBold,
                  fontSize: 14,
                }}>
                Call Me
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ marginTop: width(2) }}>
            <InputField
              placeholder="About me"
              multiline={true}
              borderRadius={width(6)}
              value={formData.aboutMe}
              placeholderTextColor={appColors.gray}
              onChangeText={value => handleChange('aboutMe', value)}
            />
          </View>

          <View style={{ marginTop: width(3) }}>
            <CustomCheckBox
              checked={formData.workPass}
              type="checkout"
              containerStyles={{
                borderWidth: 1,
                borderColor: appColors.blue,
              }}
              label="I require work pass"
              onChange={() => handleChange('workPass', !formData.workPass)}
            />
            <CustomCheckBox
              checked={formData.lookingJob}
              type="checkout"
              containerStyles={{
                borderWidth: 1,
                borderColor: appColors.blue,
              }}
              label="I need help looking for jobs"
              onChange={() => handleChange('lookingJob', !formData.lookingJob)}
            />
          </View>
        </View>
        {/* Section No#02 */}

        <View style={styles.containerStyles}>
          <Text style={styles.containerHeading}>Job Type</Text>

          <View style={{ marginTop: width(1) }}>
            <CustomPicker
              ref={jobPickerRef}
              marginVertical={width(4)}
              labelll="Job Title"
              value={selectedJob}
              listData={jobTitle}
              handleSelectValue={(name, value) =>
                handleJobSelect(value?.name, value?._id)
              }
            />
          </View>
        </View>

        {/* Section No#03 */}
        <View style={styles.containerStyles}>
          <Text style={styles.containerHeading}>Basic info</Text>
          <Text
            style={{
              fontFamily: fontFamily.poppinsBold,
              color: appColors.black,
              fontSize: 12,
              marginTop: width(2),
              color: appColors.gray,
            }}>
            Date of birth
          </Text>
          <TouchableOpacity
            style={{
              height: width(13),
              backgroundColor: appColors.white,
              justifyContent: 'center',
              paddingHorizontal: width(5),
              borderRadius: width(100),
              borderWidth: 1,
              borderColor: appColors.gray,
            }}
            onPress={() => setOpenDate(true)}>
            <Text
              style={{
                fontFamily: fontFamily.poppinsSemiBold,
                color: appColors.black,
                fontSize: 12,
              }}>
              {formData.dateOfBirth !== null
                ? moment(formData.dateOfBirth).format('MM/DD/YYYY')
                : 'Date of birth (mm/dd/yyyy)'}
            </Text>
          </TouchableOpacity>
          <Text
            style={{
              fontFamily: fontFamily.poppinsBold,
              color: appColors.black,
              fontSize: 12,
              marginTop: width(2),
              color: appColors.gray,
            }}>
            Graduation Year (expected)
          </Text>
          <View style={{ marginTop: width(3) }}>
            <InputField
              placeholder="Graduation Year (expected)"
              value={formData.expectedYear}
              placeholderTextColor={appColors.gray}
              keyboardType="numeric"
              onChangeText={value => handleChange('expectedYear', value)}
            />
          </View>
          <View style={{ marginTop: width(1) }}>
            <CustomPicker
              ref={genderRef}
              marginVertical={width(4)}
              labelll="Select Gender"
              value={formData.gender}
              listData={genders}
              handleSelectValue={(name, value) =>
                handleChange('gender', value.name)
              }
            />
          </View>

          <View style={{ marginTop: -width(3) }}>
            <CustomPicker
              ref={employmentStatusRef}
              marginVertical={width(4)}
              labelll="Employment Status"
              value={formData.employmentStatus}
              listData={employmentStatus}
              handleSelectValue={(name, value) =>
                handleChange('employmentStatus', value.name)
              }
            />
          </View>
          <View style={{ marginTop: -width(3) }}>
            <CustomPicker
              ref={educationLevelRef}
              marginVertical={width(4)}
              labelll="Education Level"
              value={formData.educationalLevel}
              listData={educationLevel}
              handleSelectValue={(name, value) =>
                handleChange('educationalLevel', value.name)
              }
            />
          </View>
        </View>

        {/* Section No#04 */}
        <View style={styles.containerStyles}>
          <Text style={styles.containerHeading}>Interested</Text>
          <CustomCheckBox
            checked={formData.volunteering}
            type="checkout"
            containerStyles={{ borderWidth: 1, borderColor: appColors.blue }}
            label="I am interested in volunteering"
            onChange={() =>
              handleChange('volunteering', !formData.volunteering)
            }
          />
          <CustomCheckBox
            checked={formData.training}
            type="checkout"
            containerStyles={{ borderWidth: 1, borderColor: appColors.blue }}
            label="I am interested in training"
            onChange={() => handleChange('training', !formData.training)}
          />
        </View>

        {/* Section No#05 */}
        <View style={styles.containerStyles}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text style={styles.containerHeading}>Educations</Text>
            <TouchableOpacity
              onPress={() => onAddNewData('education')}
              style={{
                height: width(10),
                width: width(10),
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: appColors.lightMehroon,
                borderRadius: 100,
              }}>
              <Entypo
                name={!showEducationForm ? 'plus' : 'cross'}
                color={appColors.white}
                size={25}
              />
            </TouchableOpacity>
          </View>
          {showEducationForm && (
            <>
              <View style={{ marginTop: width(1) }}>
                <CustomPicker
                  ref={educationRef}
                  marginVertical={width(4)}
                  labelll="Education Level"
                  value={formData.education}
                  listData={educationLevel}
                  handleSelectValue={(name, value) =>
                    handleChange('education', value?.name)
                  }
                />
              </View>
              <View style={{ marginTop: width(2) }}>
                <InputField
                  placeholder="Diploma/Certificate/Degree Name"
                  value={formData.degreeName}
                  placeholderTextColor={appColors.gray}
                  onChangeText={value => handleChange('degreeName', value)}
                />
              </View>
              <View style={{ marginTop: width(2) }}>
                <InputField
                  placeholder="School / Institute"
                  value={formData.school}
                  placeholderTextColor={appColors.gray}
                  onChangeText={value => handleChange('school', value)}
                />
              </View>
              <Text style={[styles.containerHeading, { marginTop: width(3) }]}>
                Period from - to (year)
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <View style={{ marginTop: width(2), width: width(40) }}>
                  <InputField
                    placeholder="2022"
                    keyboardType="numeric"
                    value={formData.startDate}
                    placeholderTextColor={appColors.gray}
                    onChangeText={value => handleChange('startDate', value)}
                  />
                </View>
                <View style={{ marginTop: width(2), width: width(40) }}>
                  <InputField
                    placeholder="2025"
                    keyboardType="numeric"
                    value={formData.endDate}
                    placeholderTextColor={appColors.gray}
                    onChangeText={value => handleChange('endDate', value)}
                  />
                </View>
              </View>

              {/* Add Document Upload Section */}
              <View style={{ marginTop: width(2) }}>
                <Text style={styles.containerHeading}>Education Documents</Text>
                <Text
                  style={{
                    color: appColors.black,
                    fontSize: 12,
                    marginVertical: width(2),
                  }}>
                  Upload Education Certificate/Document (pdf/jpg/png/docx | 5MB
                  max)
                </Text>
                <View
                  style={{
                    height: width(14),
                    width: width(80),
                    borderRadius: width(100),
                    borderWidth: 1,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingHorizontal: width(4),
                  }}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: appColors.lightSky,
                      borderRadius: 2,
                      width: width(30),
                      height: width(10),
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onPress={() => handleImagePick('educationDocument')}>
                    <Text style={{ color: appColors.black }}>Choose File</Text>
                  </TouchableOpacity>
                  <Text
                    numberOfLines={1}
                    style={{
                      color: appColors.black,
                      width: width(40),
                      marginLeft: width(2),
                    }}>
                    {formData.document}
                  </Text>
                </View>
              </View>

              <Button
                btnTitle="Add"
                btnTextStyle={styles.btnTextStyle}
                buttonContainer={styles.updateBtn}
                handlePressBtn={handleAddEducation}
              />
            </>
          )}

          {educationData?.length > 0 && (
            <>
              {educationData?.map((item, index) => {
                return (
                  <View
                    key={index}
                    style={{
                      padding: width(4),
                      elevation: 3,
                      backgroundColor: appColors.white,
                      borderRadius: 10,
                      marginTop: width(3),
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <View
                        style={{
                          paddingHorizontal: width(3),
                          borderRadius: 10,
                          paddingVertical: width(2),
                          backgroundColor: appColors.lightMehroon,
                        }}>
                        <Text
                          style={{
                            color: appColors.white,
                            fontFamily: fontFamily.poppinsBold,
                          }}>
                          {item?.educationLevel}
                        </Text>
                      </View>

                      <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity
                          onPress={() => onEdit(item, index)}
                          style={{
                            height: width(10),
                            width: width(10),
                            borderRadius: width(100),
                            backgroundColor: 'white',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: width(2),
                          }}>

                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => onDelete(index)}
                          style={{
                            height: width(10),
                            width: width(10),
                            borderRadius: width(100),
                            backgroundColor: 'white',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>

                        </TouchableOpacity>
                      </View>
                    </View>
                    <Text
                      style={{
                        fontFamily: fontFamily.poppinsBold,
                        color: appColors.black,
                        marginTop: width(2),
                      }}>
                      {item?.degreeName}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontFamily: fontFamily.poppinsBold,
                          color: appColors.black,
                          width: width(40),
                        }}>
                        {item?.school}
                      </Text>
                      <Text
                        style={{
                          fontFamily: fontFamily.poppinsLight,
                          color: appColors.gray,
                          marginLeft: width(2),
                          fontSize: 10,
                        }}>
                        (
                        {`${moment(item?.startDate).format('YYYY')} - ${moment(
                          item?.endDate,
                        ).format('YYYY')}`}
                        )
                      </Text>
                    </View>

                    {/* Show document if available */}
                    {item?.document && (
                      <View style={{ marginTop: width(2) }}>
                        <Text
                          style={{
                            fontFamily: fontFamily.poppinsBold,
                            color: appColors.black,
                            fontSize: 12,
                          }}>
                          Document: {item.document}
                        </Text>
                      </View>
                    )}
                  </View>
                );
              })}
            </>
          )}
        </View>

        {/* Section No#06 */}
        <View style={styles.containerStyles}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text style={styles.containerHeading}>Experiences</Text>
            <TouchableOpacity
              onPress={() => onAddNewData('experiences')}
              style={{
                height: width(10),
                width: width(10),
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: appColors.lightMehroon,
                borderRadius: 100,
              }}>
              <Entypo
                name={!showExperiencesForm ? 'plus' : 'cross'}
                color={appColors.white}
                size={25}
              />
            </TouchableOpacity>
          </View>
          {showExperiencesForm && (
            <>
              <View style={{ marginTop: width(2) }}>
                <InputField
                  placeholder="Job Title"
                  value={formData.jobTitle}
                  placeholderTextColor={appColors.gray}
                  onChangeText={value => handleChange('jobTitle', value)}
                />
              </View>
              <View style={{ marginTop: width(2) }}>
                <InputField
                  placeholder="Company Name"
                  value={formData.company}
                  placeholderTextColor={appColors.gray}
                  onChangeText={value => handleChange('company', value)}
                />
              </View>

              <View style={{ marginTop: width(2) }}>
                <InputField
                  placeholder="Job key responsibilities (point-form)"
                  value={formData.responsibilities}
                  multiline={true}
                  borderRadius={width(6)}
                  placeholderTextColor={appColors.gray}
                  onChangeText={value =>
                    handleChange('responsibilities', value)
                  }
                />
              </View>
              <Text style={[styles.containerHeading, { marginTop: width(3) }]}>
                Work period from - to
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <TouchableOpacity
                  style={{
                    width: width(40),
                    height: width(13),
                    backgroundColor: appColors.white,
                    marginTop: width(3),
                    justifyContent: 'center',
                    paddingHorizontal: width(5),
                    borderRadius: width(100),
                    borderWidth: 1,
                    borderColor: appColors.gray,
                  }}
                  onPress={() => setOpenStartDate(true)}>
                  <Text
                    style={{
                      fontFamily: fontFamily.poppinsSemiBold,
                      color: appColors.gray,
                      fontSize: 12,
                    }}>
                    {formData.startDate !== null
                      ? moment(formData.startDate).format('MM/DD/YYYY')
                      : 'Start Date (mm/dd/yyyy)'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    width: width(40),
                    height: width(13),
                    backgroundColor: appColors.white,
                    marginTop: width(3),
                    justifyContent: 'center',
                    paddingHorizontal: width(5),
                    borderRadius: width(100),
                    borderWidth: 1,
                    borderColor: appColors.gray,
                  }}
                  onPress={() => setOpenEndDate(true)}>
                  <Text
                    style={{
                      fontFamily: fontFamily.poppinsSemiBold,
                      color: appColors.gray,
                      fontSize: 12,
                    }}>
                    {formData.endDate !== null
                      ? moment(formData.endDate).format('MM/DD/YYYY')
                      : 'End Date (mm/dd/yyyy)'}
                  </Text>
                </TouchableOpacity>
              </View>
              <CustomCheckBox
                checked={formData.currentlyWorking}
                type="checkout"
                containerStyles={{
                  borderWidth: 1,
                  borderColor: appColors.blue,
                }}
                label="I am currently working here"
                onChange={() =>
                  handleChange('currentlyWorking', !formData.currentlyWorking)
                }
              />
              <Button
                btnTitle="Add"
                btnTextStyle={styles.btnTextStyle}
                buttonContainer={styles.updateBtn}
                handlePressBtn={handleAddExperiences}
              />
            </>
          )}
          {experiencesData?.length > 0 && (
            <>
              {experiencesData?.map((item, index) => {
                return (
                  <View
                    key={index}
                    style={{
                      padding: width(4),
                      elevation: 3,
                      backgroundColor: appColors.white,
                      borderRadius: 10,
                      marginTop: width(3),
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <View
                        style={{
                          paddingHorizontal: width(3),
                          borderRadius: 10,
                          paddingVertical: width(2),
                          backgroundColor: appColors.lightMehroon,
                        }}>
                        <Text
                          style={{
                            color: appColors.white,
                            fontFamily: fontFamily.poppinsBold,
                          }}>
                          {item?.jobTitle}
                        </Text>
                      </View>

                      <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity
                          onPress={() => onExpEdit(item, index)}
                          style={{
                            height: width(10),
                            width: width(10),
                            borderRadius: width(100),
                            backgroundColor: 'white',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: width(2),
                          }}>

                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => onExpDelete(index)}
                          style={{
                            height: width(10),
                            width: width(10),
                            borderRadius: width(100),
                            backgroundColor: 'white',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>

                        </TouchableOpacity>
                      </View>
                    </View>
                    <Text
                      style={{
                        fontFamily: fontFamily.poppinsBold,
                        color: appColors.black,
                        marginTop: width(2),
                      }}>
                      {item?.companyName}
                    </Text>

                    <Text
                      style={{
                        fontFamily: fontFamily.poppinsBold,
                        color: appColors.black,
                      }}>
                      {item?.responsibilities}
                    </Text>
                    <Text
                      style={{
                        fontFamily: fontFamily.poppinsLight,
                        color: appColors.gray,
                      }}>
                      (
                      {`${moment(item?.startDate).format(
                        'MM/DD/YYYY',
                      )} - ${moment(item?.endDate).format('MM/DD/YYYY')}`}
                      )
                    </Text>
                  </View>
                );
              })}
            </>
          )}
        </View>

        {/* Section No#07 */}
        <View style={styles.containerStyles}>
          <Text style={styles.containerHeading}>Resumes & Documents</Text>
          <View style={{}}>
            <Text
              style={{
                color: appColors.black,
                fontSize: 12,
                marginVertical: width(2),
              }}>
              Upload Resume File (pdf/jpg/png/docx | 5MB max)
            </Text>
            <View
              style={{
                height: width(14),
                width: width(80),
                borderRadius: width(100),
                borderWidth: 1,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: width(4),
              }}>
              <TouchableOpacity
                style={{
                  backgroundColor: appColors.lightSky,
                  borderRadius: 2,
                  width: width(30),
                  height: width(10),
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => handleImagePick('resume')}>
                <Text style={{ color: appColors.black }}>Choose File</Text>
              </TouchableOpacity>
              <Text
                numberOfLines={1}
                style={{
                  color: appColors.black,
                  width: width(40),
                  marginLeft: width(2),
                }}>
                {formData.resumeImage}
              </Text>
            </View>
          </View>


          <View style={{}}>
            <Text
              style={{
                color: appColors.black,
                fontSize: 12,
                marginVertical: width(2),
              }}>
              Upload Supporting Documents (pdf/jpg/png | 5MB max)
            </Text>
            <View
              style={{
                height: width(14),
                borderRadius: width(100),
                borderWidth: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: width(4),
              }}>
              <TouchableOpacity
                style={{
                  backgroundColor: appColors.lightSky,
                  borderRadius: 2,
                  width: width(30),
                  height: width(10),
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => handleImagePick('supportingDoc')}>
                <Text style={{ color: appColors.black }}>Choose File</Text>
              </TouchableOpacity>
              <Text
                numberOfLines={1}
                style={{
                  color: appColors.black,
                  width: width(40),
                  marginLeft: width(2),
                }}>
                {formData.supportingDoc}
              </Text>
            </View>
          </View>
        </View>

        {/* Section No#08 */}
        <View style={styles.containerStyles}>
          <Button
            btnTitle="Done"
            btnTextStyle={styles.btnTextStyle}
            buttonContainer={styles.updateBtn}
            handlePressBtn={onDone}
          />
          <Button
            btnTitle="Logout"
            btnTextStyle={styles.btnTextStyle}
            buttonContainer={styles.updateBtn}
            handlePressBtn={handleLogout}
          />
          <Button
            btnTitle="Delete Account"
            btnTextStyle={{
              color: appColors.white,
              fontFamily: fontFamily.poppinsSemiBold,
            }}
            buttonContainer={{
              backgroundColor: appColors.red,
              paddingVertical: width(3),
              marginTop: width(2),
              borderRadius: width(100),
            }}
            handlePressBtn={handleDeleteAccount}
          />
        </View>

        <DatePicker
          modal
          mode="date"
          open={openDate}
          date={new Date()}
          onConfirm={date => {
            console.log('RAW:', date);
            console.log('TYPE:', typeof date);
            console.log('STRING:', String(date));
            console.log('ISO:', date?.toISOString?.());
            setOpenDate(false);
            handleChange('dateOfBirth', date.toISOString());
          }}
          onCancel={() => {
            setOpenDate(false);
          }}
        />
        <DatePicker
          modal
          mode="date"
          open={openStartDate}
          date={new Date()}
          onConfirm={date => {
            setOpenStartDate(false);
            handleChange('startDate', date);
          }}
          onCancel={() => {
            setOpenStartDate(false);
          }}
        />
        <DatePicker
          modal
          mode="date"
          open={openEndDate}
          date={new Date()}
          onConfirm={date => {
            setOpenEndDate(false);
            handleChange('endDate', date);
          }}
          onCancel={() => {
            setOpenEndDate(false);
          }}
        />
      </ScrollView>

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 999,
          }}>
          <View
            style={{
              backgroundColor: appColors.white,
              borderRadius: width(4),
              padding: width(6),
              marginHorizontal: width(4),
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontFamily: fontFamily.poppinsBold,
                fontSize: 18,
                color: appColors.black,
                textAlign: 'center',
                marginBottom: width(4),
              }}>
              Are you sure you want to delete your account?
            </Text>
            <Text
              style={{
                fontFamily: fontFamily.poppinsRegular,
                fontSize: 14,
                color: appColors.gray,
                textAlign: 'center',
                marginBottom: width(6),
              }}>
              Once deleted, this action cannot be reverted.
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
              }}>
              <TouchableOpacity
                onPress={cancelDeleteAccount}
                style={{
                  flex: 1,
                  backgroundColor: appColors.gray,
                  paddingVertical: width(3),
                  borderRadius: width(100),
                  marginRight: width(2),
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: appColors.white,
                    fontFamily: fontFamily.poppinsSemiBold,
                  }}>
                  No
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={confirmDeleteAccount}
                style={{
                  flex: 1,
                  backgroundColor: appColors.red,
                  paddingVertical: width(3),
                  borderRadius: width(100),
                  marginLeft: width(2),
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: appColors.white,
                    fontFamily: fontFamily.poppinsSemiBold,
                  }}>
                  Yes
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Delete Account Success Modal */}
      {showDeleteSuccess && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 999,
          }}>
          <View
            style={{
              backgroundColor: appColors.white,
              borderRadius: width(4),
              padding: width(6),
              marginHorizontal: width(4),
              alignItems: 'center',
            }}>
            <View
              style={{
                width: width(15),
                height: width(15),
                borderRadius: width(100),
                backgroundColor: appColors.green,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: width(4),
              }}>
              <Entypo name="check" size={30} color={appColors.white} />
            </View>
            <Text
              style={{
                fontFamily: fontFamily.poppinsBold,
                fontSize: 18,
                color: appColors.black,
                textAlign: 'center',
                marginBottom: width(2),
              }}>
              Account Deleted Successfully!
            </Text>
            <Text
              style={{
                fontFamily: fontFamily.poppinsRegular,
                fontSize: 14,
                color: appColors.gray,
                textAlign: 'center',
                marginBottom: width(6),
              }}>
              Your account has been permanently deleted.
            </Text>
            <TouchableOpacity
              onPress={onDeleteSuccess}
              style={{
                backgroundColor: appColors.primaryColor,
                paddingVertical: width(3),
                paddingHorizontal: width(8),
                borderRadius: width(100),
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: appColors.white,
                  fontFamily: fontFamily.poppinsSemiBold,
                }}>
                OK
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <CommonAlert ref={constants} />
    </SafeAreaView>
  );
};

export default ProfileScreen;
