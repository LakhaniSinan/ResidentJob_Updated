import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import React, {useRef, useState} from 'react';
import {
  Alert,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {width} from 'react-native-dimension';
import RNFS from 'react-native-fs';
import {generatePDF} from 'react-native-html-to-pdf';
import {useSelector} from 'react-redux';
import {appIcons, fontFamily} from '../../../assets';
import AppHeader from '../../../components/appHeader';
import Button from '../../../components/button';
import CommonAlert from '../../../components/commanAlert';
import CustomCheckBox from '../../../components/customcheckBox';
import Loader from '../../../components/loader';
import RenderReviewCard from '../../../components/reviewCard/reviewCard';
import {appColors} from '../../../constants';
import {cancelJob} from '../../../services/createJob';
import {updateJobByAdmin} from '../../../services/wallet';

export const calculateJobCostDetails = item => {
  let jobSubTotal = 0;

  const jobDetails =
    item?.job?.map(job => {
      const days = moment(job.endDate).diff(moment(job.startDate), 'days') + 1;
      const subTotal =
        days *
        parseFloat(job.totalHours || 0) *
        parseFloat(job.requiredPeoples || 0) *
        parseFloat(job.hourlyRate || 0);
      jobSubTotal += subTotal;

      return {
        ...job,
        days,
        subTotal,
      };
    }) || [];

  const extraCostTotal = item?.extraCost?.reduce((acc, cost) => {
    return acc + (parseFloat(cost?.number) || 0);
  }, 0);

  const taxableAmount = jobSubTotal + extraCostTotal;

  const qstPercentage = parseFloat(item?.qst || 0);
  const gstPercentage = parseFloat(item?.gst || 0);

  const qstAmount = (taxableAmount * qstPercentage) / 100;
  const gstAmount = (taxableAmount * gstPercentage) / 100;

  const grandTotal = taxableAmount + qstAmount + gstAmount;

  return {
    jobDetails,
    jobSubTotal,
    extraCostTotal,
    taxableAmount,
    qstAmount,
    gstAmount,
    grandTotal,
  };
};

const OnGoingGroupDetail = ({route}) => {
  let item = route.params;
  console.log(item, 'itemitemitemitemitemitem123123123213123');

  const [isAgree, setIsAgree] = useState(false);
  const navigation = useNavigation();
  const {user} = useSelector(state => state.LoginSlice);
  const modalRef = useRef();
  const [isLoading, setIsLoading] = useState(false);

  const [loading, setLoading] = useState(null);

  const costDetails = calculateJobCostDetails(item);

  const requestWritePermission = async () => {
    if (Platform.OS === 'android' && Platform.Version < 29) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission Required',
          message: 'This app needs access to your storage to save the PDF.',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const handleGeneratePDF = async () => {
    try {
      const hasPermission = await requestWritePermission();
      if (!hasPermission) {
        Alert.alert(
          'Permission Denied',
          'Storage permission is required to save the PDF.',
        );
        return;
      }

      const {qstAmount, gstAmount, grandTotal} = costDetails;

      const additionalChargesHTML = `
      <div class="section">
        <p class="title" style="text-align: center; margin-top: 10px;">Additional Charges</p>
        ${
          item?.extraCost?.length > 0
            ? item.extraCost
                .map(cost => {
                  const amount = parseFloat(cost?.number || 0).toFixed(2);
                  return `
                    <div class="detail" style="font-weight: bold;">
                      <span>${cost?.text}</span>
                      <span>$${amount}</span>
                    </div>
                  `;
                })
                .join('')
            : `
              <p style="text-align: center; margin-top: 10px; font-size: 14px; color: gray;">
                No Additional Charges Included.
              </p>
            `
        }
        <div class="detail" style="font-weight: bold;">
          <span>QST</span>
          <span>$${qstAmount?.toFixed(3)}</span>
        </div>
        <div class="detail" style="font-weight: bold;">
          <span>GST</span>
          <span>$${gstAmount?.toFixed(2)}</span>
        </div>
        <div class="detail" style="font-weight: bold; font-size: 16px;">
          <span>Grand Total</span>
          <span>$${grandTotal?.toFixed(2)}</span>
        </div>
      </div>
    `;

      const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 10px; margin: 0; }
            .container { max-width: 600px; margin: auto; padding: 10px; border: 1px solid #ccc; }
            .logo-container { width: 120px; height: 120px; margin-left: auto; }
            .logo { width: 100%; height: 100%; object-fit: contain; }
            .section { margin-bottom: 10px; page-break-inside: avoid; }
            .main-container { display: flex; align-items: center; justify-content: space-between; }
            .title { font-size: 16px; font-weight: bold; }
            .detail { display: flex; justify-content: space-between; border-bottom: 1px solid #ccc; padding: 4px 0; }
            .addressDetail { display: flex; justify-content: space-between; padding: 4px 0; }
            .span { width: 300px }
            .job-container { border: 1px solid #ccc; padding: 6px; margin-bottom: 6px; background-color: #f9f9f9; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="main-container">
              <div>
                <h1>JOB DETAIL</h1>
                <div class="section">
                  <p class="title">Status: ${item.jobStatus}</p>
                </div>
              </div>
              <div class="logo-container">
                <img src="https://res.cloudinary.com/dofa5sctg/image/upload/v1741346233/logo_hxv1fy.jpg" class="logo"/>
              </div>
            </div>
            
            <div class="section">
              ${costDetails?.jobDetails
                ?.map(
                  job => `
                  <div class="job-container">
                    <div class="detail"><span>Job Title:</span> <span>${job.name}</span></div>
                    <div class="detail"><span>Number Of People Required:</span> <span>${job.requiredPeoples}</span></div>
                    <div class="detail"><span>Days:</span> <span>${job.days}</span></div>
                    <div class="detail"><span>Per Hour:</span> <span>$${job.hourlyRate}</span></div>
                    <div class="detail"><span>Hours Per Day:</span> <span>${job.totalHours}</span></div>
                    <div class="detail"><span>Sub Total:</span> <span>$${job.subTotal}</span></div>
                  </div>
                `,
                )
                .join('')}
            </div>

            ${additionalChargesHTML}

            <div class="section">
              <p class="title">Recipient Details</p>
              <div class="detail">
                <span>Name:</span> <span>${item.createdBy.firstname} ${
        item.createdBy.lastname
      }</span>
              </div>
              <div class="detail">
                <span>Email:</span> <span>${item.createdBy.email}</span>
              </div>
              <div class="addressDetail">
                <span>Address:</span> <span class="span">${item.address}</span>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

      setIsLoading(true);

      const pdfOptions = {
        html: htmlContent,
        fileName: 'Jobs_details_invoice',
        directory: 'Documents',
      };

      const pdf = await generatePDF(pdfOptions);
      console.log('Generated PDF:', pdf);

      if (!pdf.filePath)
        throw new Error('PDF generation failed: filePath is undefined.');

      let destinationPath = '';
      const timeStamp = new Date().getTime();

      const folderPath = RNFS.DownloadDirectoryPath;
      if (Platform.OS === 'android') {
        const fileName = `Jobs_details_invoice_${timeStamp}.pdf`;
        destinationPath = `${folderPath}/${fileName}`;

        if (!(await RNFS.exists(folderPath))) {
          await RNFS.mkdir(folderPath);
        }

        await RNFS.copyFile(pdf.filePath, destinationPath);
        console.log('Saved to Android Downloads:', destinationPath);
      } else {
        destinationPath = `${RNFS.DocumentDirectoryPath}/Jobs_details_invoice_${timeStamp}.pdf`;
        await RNFS.moveFile(pdf.filePath, destinationPath);

        await Share.share({
          url: `file://${destinationPath}`,
          type: 'application/pdf',
          title: 'Share your Invoice PDF',
        });
      }

      // 🔹 Step 5: Done
      setIsLoading(false);
      modalRef.current?.isVisible?.({
        status: 'ok',
        message: `Your PDF has been successfully generated. to ${folderPath} `,
        path: destinationPath || pdf.filePath,
      });
    } catch (error) {
      setIsLoading(false);
      console.error('Error generating PDF:', error);
      Alert.alert('Error', 'Failed to generate PDF.');
    }
  };

  const renderData = (heading, value, bold) => {
    return (
      <View
        style={{
          marginTop: 15,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text
          style={{
            color: appColors.black,
            fontWeight: 'bold',
            fontSize: 17,
          }}>
          {heading}
        </Text>
        <Text
          style={{
            color: appColors.black,
            fontSize: 14,
            fontWeight: bold,
          }}>
          {value}
        </Text>
      </View>
    );
  };

  const handleCompleteAppointment = async () => {
    modalRef.current.isVisible({
      status: 'confirm',
      message: 'Are you sure you want to complete this job?',
      handlePressOk: async () => {
        modalRef.current.backdropPress();
        setIsLoading(true);
        try {
          const response = await updateJobByAdmin(item?.jobId, {
            jobStatus: 'Completed',
          });
          setIsLoading(false);
          if (response.status === 200) {
            modalRef.current.isVisible({
              status: 'ok',
              message: 'Job has been completed successfully.',
              handlePressOk: () => {
                modalRef.current.backdropPress();
                // navigation.navigate('RateUsScreen', item);
                // navigation.navigate('RateUsScreen', item);
                navigation.reset({
                  index: 0,
                  routes: [{name: 'OnGoingHistoryStack'}],
                });
              },
            });
          } else {
            modalRef.current.isVisible({
              status: 'error',
              message: response.data.message,
            });
          }
        } catch (error) {
          setIsLoading(false);
          console.log(error, 'errorerrorerrorerrorhandleCompleteAppointment');
        }
      },
    });
  };

  const handleCancelJob = async () => {
    modalRef.current.isVisible({
      status: 'confirm',
      message: 'Are you sure you want to cancel this job?',
      handlePressOk: async () => {
        modalRef.current.backdropPress();
        try {
          setIsLoading(true);
          const response = await cancelJob(item?.jobId, {
            jobStatus: 'Cancelled',
          });
          setIsLoading(false);
          if (response.status == 200 || response.status == 201) {
            modalRef.current.isVisible({
              status: 'ok',
              message: response.data.message,
              handlePressOk: () => {
                modalRef.current.backdropPress();
                navigation.goBack();
              },
            });
          } else {
            modalRef.current.isVisible({
              status: 'error',
              message: response.data.message,
            });
          }
          console.log(response, 'responseresponseresponseresponse');
        } catch (error) {
          setIsLoading(false);
          console.log(error, 'errorerrorerrorerror234536');
        }
      },
    });
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <Loader isLoading={isLoading} />
        <CommonAlert ref={modalRef} />
        <AppHeader
          height={width(20)}
          heading={'Jobs Details'}
          headingColor={appColors.white}
          leftIconStyle={{height: 27, width: 27}}
          leftIcon={appIcons.goBackIcon}
        />
        <View
          style={{
            marginTop: 10,
            paddingHorizontal: 5,
            borderRadius: 5,
            marginHorizontal: 10,
          }}>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                color: 'black',
                fontWeight: 'bold',
                width: '30%',
                fontSize: 16,
              }}>
              Job Status:
            </Text>
            <Text style={{marginLeft: 10, color: 'black'}}>
              {item.jobStatus}
            </Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                color: 'black',
                fontWeight: 'bold',
                width: '30%',
                fontSize: 16,
              }}>
              Job Id:
            </Text>
            <Text style={{marginLeft: 10, color: 'black'}}>{item.jobId}</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                color: 'black',
                fontWeight: 'bold',
                width: '30%',
                fontSize: 16,
              }}>
              Job Address:
            </Text>
            <Text style={{marginLeft: 10, color: 'black', width: '65%'}}>
              {item.address}
            </Text>
          </View>

          <View>
            <Text
              style={{
                marginTop: 10,
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: 18,
                color: appColors.black,
              }}>
              Job Details
            </Text>
          </View>
          {costDetails?.jobDetails?.map(data => {
            let sum = 0;
            const momentDate1 = moment(data.endDate);
            const momentDate2 = moment(data.startDate);
            let differenceInDays = momentDate1.diff(momentDate2, 'days') + 1;

            // Subtotal calculation
            sum =
              data.hourlyRate *
              data.totalHours *
              differenceInDays *
              data.requiredPeoples;

            return (
              <View
                style={{
                  borderBottomWidth: item?.job.length > 1 ? 0.5 : 0,
                  marginTop: 10,
                }}>
                {renderData('Job Title', data.name)}
                {renderData('People Required', data.requiredPeoples)}
                {renderData(
                  'Job Start Date',
                  moment(data.startDate).format('DD-MMM-YYYY'),
                )}
                {renderData(
                  'Job End Date',
                  moment(data.endDate).format('DD-MMM-YYYY'),
                )}
                {renderData('Hourly Rate', `$${data?.hourlyRate}`)}
                {renderData('Total Hours', data.totalHours)}
                {renderData('Total Days', differenceInDays)}
                {renderData('Sub Total', `$${sum.toFixed(2)}`, 'bold')}
                <Text
                  style={{
                    color: appColors.black,
                    fontWeight: 'bold',
                    fontSize: 17,
                    textAlign: 'center',
                  }}>
                  Assigned Workers
                </Text>
                {data?.assignedWorkers?.length > 0 ? (
                  <>
                    {data?.assignedWorkers?.map(item => {
                      return <RenderReviewCard item={item} height={true} />;
                    })}
                  </>
                ) : (
                  <Text
                    style={{
                      color: appColors.gray,
                      fontWeight: '400',
                      fontSize: 14,
                      textAlign: 'center',
                      marginVertical: width(3),
                    }}>
                    No worker is assinged yet,
                  </Text>
                )}
              </View>
            );
          })}
          <Text
            style={{
              marginTop: 10,
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: 18,
              color: appColors.black,
            }}>
            Additional Charges
          </Text>

          {item?.extraCost?.length > 0 ? (
            <View>
              {item?.extraCost?.map(cost => {
                return renderData(
                  cost?.text,
                  `$${parseFloat(cost?.number).toFixed(2)}`,
                  'bold',
                );
              })}
            </View>
          ) : (
            <Text
              style={{
                marginTop: 10,
                textAlign: 'center',
                fontFamily: fontFamily.poppinsRegular,
                fontSize: 14,
                color: appColors.gray,
              }}>
              No Additional Charges Included.
            </Text>
          )}
          {renderData('QST', `$${costDetails?.qstAmount.toFixed(3)}`, 'bold')}
          {renderData('GST', `$${costDetails?.gstAmount.toFixed(2)}`, 'bold')}
          {renderData(
            'Grand Total',
            `$${costDetails?.grandTotal?.toFixed(2)}`,
            'bold',
          )}
        </View>

        <View
          style={{
            marginBottom: 20,
            marginHorizontal: 10,
            justifyContent: 'space-between',
          }}>
          {item?.jobStatus == 'Pending' && (
            <>
              <Text
                style={{
                  fontFamily: fontFamily.poppinsBold,
                  color: appColors.gray,
                  textAlign: 'center',
                  marginVertical: width(3),
                  width: '100%',
                }}>
                Please wait. You’ll be able to make a payment once the worker
                has been assigned to you.
              </Text>
              <Button
                btnFontSize={12}
                handlePressBtn={handleCancelJob}
                btnTitle={'Cancel Job'}
                btnTextStyle={{
                  color: appColors.white,
                }}
                buttonContainer={{
                  backgroundColor: appColors.primaryColor,
                  borderColor: appColors.primaryColor,
                  borderWidth: 1,
                  borderRadius: 12,
                  paddingVertical: width(3),
                }}
              />
            </>
          )}

          {item?.jobStatus == 'Accepted' &&
            item?.paymentStatus == 'Pending' && (
              <>
                <View style={styles.checkboxContainer}>
                  <CustomCheckBox
                    checked={isAgree}
                    onChange={setIsAgree}
                    label={'By proceeding with the payment, you agree to our'}
                    screenTypeLabel={'Terms & Conditions'}
                    lastText={''}
                    handleNavigateToLabelType={() => {
                      navigation.navigate('TermsAndCondition');
                    }}
                  />
                </View>

                <Button
                  btnFontSize={12}
                  handlePressBtn={() => {
                    if (!isAgree) {
                      return modalRef.current.isVisible({
                        status: 'error',
                        message:
                          'Kindly accept the Terms & Conditions before continuing.',
                      });
                    }
                    navigation.navigate('PaymentMethod', {
                      ...item,
                      grandTotal: costDetails?.grandTotal?.toFixed(2),
                    });
                  }}
                  btnTitle={'Pay Now'}
                  btnTextStyle={{
                    color: appColors.white,
                  }}
                  buttonContainer={{
                    backgroundColor: appColors.primaryColor,
                    borderColor: appColors.primaryColor,
                    borderWidth: 1,
                    borderRadius: 12,
                    paddingVertical: width(3),
                  }}
                />
              </>
            )}

          {item?.paymentStatus == 'Paid' && (
            <Button
              handlePressBtn={handleGeneratePDF}
              btnFontSize={12}
              btnTitle={'Download Invoice'}
              btnTextStyle={{
                color: appColors.white,
              }}
              buttonContainer={{
                backgroundColor: appColors.primaryColor,
                borderColor: appColors.primaryColor,
                borderWidth: 1,
                borderRadius: 12,
                marginTop: width(4),
                paddingVertical: width(3),
              }}
            />
          )}
          {item?.paymentStatus == 'Paid' && item.jobStatus !== 'Completed' && (
            <Button
              handlePressBtn={handleCompleteAppointment}
              btnFontSize={12}
              btnTitle={'Complete Job'}
              btnTextStyle={{
                color: appColors.white,
              }}
              buttonContainer={{
                backgroundColor: appColors.primaryColor,
                borderColor: appColors.primaryColor,
                borderWidth: 1,
                borderRadius: 12,
                paddingVertical: width(3),
                marginVertical: width(3),
              }}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OnGoingGroupDetail;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: width(3),
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: width(3),
  },
});
