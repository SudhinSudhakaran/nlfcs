/**
    * Purpose:* Create Benefits Details screen
              * display selected Benefits with description
              * add button for enquiry
    * Created/Modified By: Monisha Sreejith
    * Created/Modified Date: 5 June 2023

    */
import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';

import {Globals, theme} from '../constants';
import {svg} from '../assets/svg';
import {components} from '../components';
import {
  responsiveHeight,
  responsiveScreenHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import ContentLoader, {Rect, Circle, Path} from 'react-content-loader/native';
import {setBenefitLoading} from '../store/benefitSlice';
import {Alert} from 'react-native';
import {setIsAuthorized} from '../redux/slice/authenticationSlice';
import StorageManager from '../helpers/storageManager/StorageManager';
import {Keyboard} from 'react-native';
import {setSecretKey} from '../store/googleAuthenticatorSlice';
import {setUserDetails} from '../store/userSlice';
import {useDispatch, useSelector} from 'react-redux';
import HTMLView from 'react-native-htmlview';

//demo array
const loans = [
  {
    id: 1,
    loanAmount: `You can always re-apply for a home loan if your first loan application was rejected by the lender. However, there are a few aspects you must consider before doing so.

    Credit score: Since housing loans are generally long-term retail loans, lenders look into the applicant’s repayment capacity before approving or rejecting a loan application. Your credit score plays a major role in deciding your repayment capacity against a loan.
    
    If you have a poor score on your credit report, chances of your loan application being rejected are high. The unsatisfactory credit score gauges your creditworthiness which banks and financial institutions consider before processing your loan application. Hence, it is advised to go through your credit score and credit report before you apply for a loan.
    
    In case you have a poor credit score, consider improving your score by making your debt repayments on time before you reapply for a housing loan again. If you do not know what your current score is, you can get your credit score along with the credit report on BankBazaar.
    
    Loan Amount: Since purchasing/constructing a home is a one-time investment, we often tend to overlook the financial costs involved in it. Banks and financial institutions fix the maximum loan amount you are eligible for by taking your present monthly income. There is a high chance your application was rejected because of the loan amount you have applied for.
    
    If the loan amount applied for exceeds your eligible loan amount, the lender can decide to reject your application. In such cases, you can consider increasing the down payment on your home loan to bring down the loan amount.
    
    Other Ongoing Loans: Banks can also choose to reject your home loan application if you have too many other ongoing loans. Since home loan lenders see to it that not more than 50% of your monthly income is being contributed to your loan repayments, any other ongoing long-term loans can result in your application being rejected.
    
    Having too many ongoing loans will not only impact your personal finances but also your repayment capacity. Hence, it is advised to clear the ongoing loans, if any, before you apply for a housing loan.
    
    Co-applicant: There can be instances where applications are rejected due to low income. In such cases, you can consider adding a co-applicant such as a member of your immediate family. This will increase the maximum amount you are eligible for as the income and creditworthiness of the co-applicant will also be taken into account while deciding your eligibility.
    
    Employment: In some cases, the employment of the applicant can act as the deciding factor on whether the loan application is being approved or rejected by the lender. Your application can be rejected if the lender learns that you have been switching between jobs frequently.
    
    Unstable employment can sometimes prove to have a negative impact on your loan application. On the other hand, stable employment with a recognised institution on your application can have a positive impact.
    
    In case your housing loan application was rejected, and you have only been working with the current employer for a short period of time. You can consider giving it some more time before re-applying for another one.
    
    Documentation: Housing loans include a lot of documentation such as identity proof, residential proof, bank account statements, income tax returns, income proofs, property papers, documents approved by concerned authorities, etc. Your loan lender can reject your loan application even if one of the required documents are not submitted.
    
    You can always consult the banks’ customer relationship executives to assist you with proper loan documentation.`,
  },
  {
    id: 2,
    minusBalance: '- 10 532.00',
    loanName: 'Education Loan',
    rate: '10 %',
    loanAmount: `The eligibility criteria may differ from one lender to the other, but these are the common criteria that you have to meet to be approved for an education loan
    Indian national
    Age: Up to 35 years for non-employed individuals and up to 45 years for employed individuals
    Proof of admission into the educational institution
    Valid educational certificates showing a good academic record (of more than 50% marks)
    Guarantor's income proof or credit history
    Passport/i20 form/visa in case of studies abroad`,
    period: '48 months',
    monthlyPayment: '10000.00',
    totalPaid: '4468.00',
    currency: 'USD',
  },
  {
    id: 3,
    loanAmount: `NLFCS Bank  is a banking company considered one of the best banks for a car loan. The Bank provides banking and financial services, including retail banking, corporate banking, and treasury operations. Its segments include Treasury, Corporate/Wholesale Banking, and Retail Banking.

    Its Treasury segment operations include trading and investments in government securities and corporate debt instruments, equity and mutual funds, derivatives, and foreign exchange operations on the proprietary account and for customers.
    
    Its Corporate/ Wholesale Banking segment consists of lending funds, accepting deposits, and other banking services to corporates, trusts, partnership firms, and statutory bodies. Its Retail banking segment constitutes lending of funds, acceptance of deposits, and other banking services to any legal person, including small business customers. `,
  },
];
const BenefitsDetail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  //Redux states
  const benefitDetails = useSelector(
    (state) => state.benefitDetails.benefitDetails,
  );
  const benefitLoading = useSelector(
    (state) => state.benefitDetails.benefitLoading,
  );
  useEffect(() => {
    dispatch(setBenefitLoading(true));
    if (benefitDetails !== null || benefitDetails !== undefined) {
      setTimeout(() => {
        dispatch(setBenefitLoading(false));
      }, 1000);
    } else {
      /** If token expired displayed alert
       * When click Yes button go to the performSessionExpired functon
       */
      Alert.alert(
        'Please Login',
        'Session expired',
        [{text: 'Yes', onPress: () => performSessionExpired()}],
        {cancelable: false},
      );
    }
  }, []);
  /** Purpose:  session expired action
   * Created/Modified By: Monisha Sreejith
   * Created/Modified Date: 16-06-2023
   * Steps:
   *1. Cleared User details,autherization,email,token from storage
   *2. Navigate to SignIn
   */
  const performSessionExpired = () => {
    dispatch(setIsAuthorized(false));
    dispatch(setSecretKey(''));
    dispatch(setUserDetails(''));
    StorageManager.clearUserRelatedData();
    Keyboard.dismiss();
    //Navigate to SignIn
    navigation.reset({
      index: 0,
      routes: [{name: 'SignIn'}],
    });
  };
  //shimmer for benefit Description
  const BenefitLoader = () => (
    <ContentLoader
      speed={1.5}
      width={'200%'}
      height={1000}
      marginTop={responsiveHeight(1)}
      backgroundColor={'#F6FFF8'}
      foregroundColor={'#D9D9D9'}
      animate={true}
    >
      <Rect x='2%' y='10' rx='5' ry='5' width='45%' height='800' />
    </ContentLoader>
  );
  const renderNode = (node, index, siblings, parent, defaultRenderer) => {
    if (node.name === 'p') {
      return <Text key={index}>{defaultRenderer(node.children, parent)}</Text>;
    }
  };
  //Displayed back button and title
  const renderHeader = () => {
    return (
      <components.Header
        goBack
        title={route.params.name}
        backstyle={{
          marginRight: responsiveHeight(3),
          left: responsiveWidth(0),
          marginTop: 46,
        }}
        titleStyle={{
          marginRight: responsiveHeight(14),
          marginTop: 18,
        }}
      />
    );
  };
  /** Purpose: Curresponding benefit details displayed
   * Created/Modified By: Monisha Sreejith
   * Created/Modified Date: 16-06-2023
   * Steps:
   *1. checked with condition
   *if benefitLoading === true displayed benefit loader else displyed benefit list
   *2. benefitdetail perform as redux state
   * maped function declared=> benefitdetails array to return object
   *id get from mapping stored a variable.then
   *checked with parameter passed from Benefit screen
   *if true curresponding benefit detail descption displayed
   */
  const renderContent = () => {
    return (
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          marginTop: responsiveHeight(2),
        }}
      >
        {benefitLoading === true ? (
          <BenefitLoader />
        ) : (
          <>
            {benefitDetails.map((item, index) => {
              var id = item.id;
              return (
                <View key={index}>
                  {route?.params?.item !== id ? null : (
                    <>
                      <View
                        style={{
                          paddingHorizontal: 20,
                          backgroundColor: '#f5f5ef',
                          borderRadius: 10,
                          marginTop: responsiveHeight(0),
                        }}
                      >
                        <HTMLView
                            // scrollEnabled
                            value={item?.scheme?.description || ''}
                            renderNode={renderNode}
                          />
                        {/* <Text
                          style={{
                            marginTop: responsiveHeight(2),
                            marginBottom: responsiveHeight(3),
                            ...theme.fonts.SourceSansPro_Regular_14,
                            lineHeight:
                              theme.fonts.SourceSansPro_Regular_14.fontSize *
                              1.6,
                            color: theme.colors.mainDark,
                          }}
                        >
                          {item?.scheme?.description || ''}
                        </Text> */}
                      </View>
                    </>
                  )}
                </View>
              );
            })}
          </>
        )}
      </ScrollView>
    );
  };
/** Purpose: Enquiry button UI
   * Created/Modified By: Monisha Sreejith
   * Created/Modified Date: 16-06-2023
   * Steps:
   *1.Button press Action=>navigate to New Ticket
   *also passed parameter =>>>>>
      1.Benefits indicates the navigation action from benefits
      2.parametr indicates the parametr from Benefit screen for displaying  curresponding title
   */
  const renderFooter = () => {
    return (
      <View style={{padding: 20}}>
        <TouchableOpacity
          style={{
            height: 40,
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.colors.mainDark,
            borderRadius: 10,
          }}
          onPress={() =>
            navigation.navigate('NewTicket', {
              Benefits: 'isFromBenefits',
              parameter: route.params.name,
            })
          }
        >
          <Text
            style={{
              ...theme.fonts.SourceSansPro_SemiBold_16,
              color: theme.colors.white,
            }}
          >
            Make an Enquiry
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <components.SafeAreaView>
      {renderHeader()}
      {renderContent()}
      {renderFooter()}
    </components.SafeAreaView>
  );
};

export default BenefitsDetail;
