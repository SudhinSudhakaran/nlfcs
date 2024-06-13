/**
    * Purpose:* Create Loan Detail tab screen
              * display tab with details
    * Created/Modified By: Monisha Sreejith
    * Created/Modified Date: 5 June 2023

    */
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import React, {useState} from 'react';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import Modal from 'react-native-modal';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ParsedText from 'react-native-parsed-text';

import {components} from '../components';
import {theme} from '../constants';
import {svg} from '../assets/svg';
import Collateral from './Collateral';
import RepaymentsSchedule from './RepaymentsSchedule';
import Repayments from './Repayments';

const loans = [
  {
    id: 1,
    LoanID: '11001',
    Borrower: 'Nithin',
    Currency: 'MYR',
    Status: 'Approved',
    FirstPaymentDate: '2023-05-17',
    ReleaseDate: '2023-05-17',
    AppliedAmount: 'RM2,000.00',
    TotalPayable: 'RM2,040.00',
    TotalPaid: 'RM0.00',
    DueAmount: 'RM2,040.00',
    LatePaymentPenalties: '0.05 %',
    Attachment: 'Download',
    ApprovedDate: '2023-05-17',
    ApprovedBy: 'Admin',
    Description: 'For mother operation',
    Remarks: 'Hospital bill attached',
  },
];

const LoanDetails = ({navigation}) => {
  const [type, setType] = useState('Loan Details');

  const renderHeader = () => {
    return (
      <View style={{padding: 20, flexDirection: 'row'}}>
        <components.Header
          goBack={true}
          title={type}
          backstyle={{bottom: responsiveHeight(2.7), right: 20}}
          titleStyle={{
            position: 'absolute',
            left: 30,
            bottom: responsiveHeight(2.2),
          }}
        />
      </View>
    );
  };

  const renderType = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 10,
          bottom: 10,
          marginBottom: theme.sizes.marginBottom_30,
          marginHorizontal: 10,
        }}
      >
        <TouchableOpacity
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            paddingRight: 8,
            borderBottomWidth: 1,
            borderBottomColor:
              type === 'Loan Details' ? theme.colors.mainDark : 'transparent',
          }}
          onPress={() => setType('Loan Details')}
        >
          <Text
            style={{
              color: theme.colors.mainDark,
              ...theme.fonts.SourceSansPro_Regular_14,
              lineHeight: theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
              textTransform: 'capitalize',
              fontSize: theme.fonts.SourceSansPro_Regular_14.fontSize * 1,
            }}
          >
            Loan Details
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            right: 4,
            borderBottomWidth: 1,
            borderBottomColor:
              type === 'Collateral' ? theme.colors.mainDark : 'transparent',
          }}
          onPress={() => setType('Collateral')}
        >
          <Text
            style={{
              color: theme.colors.mainDark,
              ...theme.fonts.SourceSansPro_Regular_14,
              lineHeight: theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
              textTransform: 'capitalize',
              fontSize: theme.fonts.SourceSansPro_Regular_14.fontSize * 1,
            }}
          >
            Collateral
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            right: 4,
            justifyContent: 'center',
            alignItems: 'center',
            borderBottomWidth: 1,
            borderBottomColor:
              type === 'Schedules' ? theme.colors.mainDark : 'transparent',
          }}
          onPress={() => setType('Schedules')}
        >
          <Text
            style={{
              color: theme.colors.mainDark,
              ...theme.fonts.SourceSansPro_Regular_14,
              lineHeight: theme.fonts.SourceSansPro_Regular_14.fontSize * 1.3,
              textTransform: 'capitalize',
              fontSize: theme.fonts.SourceSansPro_Regular_14.fontSize * 1,
            }}
            numberOfLines={2}
          >
            Schedules
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            right: 4,
            justifyContent: 'center',
            alignItems: 'center',
            borderBottomWidth: 1,
            borderBottomColor:
              type === 'Repayments' ? theme.colors.mainDark : 'transparent',
          }}
          onPress={() => setType('Repayments')}
        >
          <Text
            style={{
              color: theme.colors.mainDark,
              ...theme.fonts.SourceSansPro_Regular_14,
              lineHeight: theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
              textTransform: 'capitalize',
              fontSize: theme.fonts.SourceSansPro_Regular_14.fontSize * 1,
            }}
          >
            Repayments
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderContent = () => {
    return (
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
        }}
      >
        {type === 'Loan Details' ? (
          loans.map((loan, index) => {
            return (
              <View key={index}>
                <View
                  style={{
                    paddingHorizontal: 20,
                    backgroundColor: '#f5f5ef',
                    borderRadius: 10,
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      top: 5,
                      marginBottom: theme.sizes.marginBottom_14,
                    }}
                  >
                    <Text
                      style={{
                        ...theme.fonts.SourceSansPro_Regular_14,
                        lineHeight:
                          theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
                        textTransform: 'capitalize',
                        color: theme.colors.bodyTextColor,
                      }}
                    >
                      Loan ID
                    </Text>
                    <Text
                      style={{
                        ...theme.fonts.SourceSansPro_Regular_14,
                        lineHeight:
                          theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
                        color: theme.colors.mainDark,
                      }}
                    >
                      {loan.LoanID}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: theme.sizes.marginBottom_14,
                    }}
                  >
                    <Text
                      style={{
                        ...theme.fonts.SourceSansPro_Regular_14,
                        lineHeight:
                          theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
                        textTransform: 'capitalize',
                        color: theme.colors.bodyTextColor,
                      }}
                    >
                      Borrower
                    </Text>
                    <Text
                      style={{
                        ...theme.fonts.SourceSansPro_Regular_14,
                        lineHeight:
                          theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
                        color: theme.colors.mainDark,
                      }}
                    >
                      {loan.Borrower}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: theme.sizes.marginBottom_14,
                    }}
                  >
                    <Text
                      style={{
                        ...theme.fonts.SourceSansPro_Regular_14,
                        lineHeight:
                          theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
                        textTransform: 'capitalize',
                        color: theme.colors.bodyTextColor,
                      }}
                    >
                      Currency
                    </Text>
                    <Text
                      style={{
                        ...theme.fonts.SourceSansPro_Regular_14,
                        lineHeight:
                          theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
                        color: theme.colors.mainDark,
                      }}
                    >
                      {loan.Currency}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: theme.sizes.marginBottom_14,
                    }}
                  >
                    <Text
                      style={{
                        ...theme.fonts.SourceSansPro_Regular_14,
                        lineHeight:
                          theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
                        textTransform: 'capitalize',
                        color: theme.colors.bodyTextColor,
                      }}
                    >
                      Status
                    </Text>
                    <Text
                      style={{
                        ...theme.fonts.SourceSansPro_Regular_14,
                        lineHeight:
                          theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
                        color: theme.colors.mainDark,
                      }}
                    >
                      {loan.Status}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: theme.sizes.marginBottom_14,
                    }}
                  >
                    <Text
                      style={{
                        ...theme.fonts.SourceSansPro_Regular_14,
                        lineHeight:
                          theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
                        textTransform: 'capitalize',
                        color: theme.colors.bodyTextColor,
                      }}
                    >
                      First Payment Date
                    </Text>
                    <Text
                      style={{
                        ...theme.fonts.SourceSansPro_Regular_14,
                        lineHeight:
                          theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
                        color: theme.colors.mainDark,
                      }}
                    >
                      {loan.FirstPaymentDate}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: theme.sizes.marginBottom_14,
                    }}
                  >
                    <Text
                      style={{
                        ...theme.fonts.SourceSansPro_Regular_14,
                        lineHeight:
                          theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
                        textTransform: 'capitalize',
                        color: theme.colors.bodyTextColor,
                      }}
                    >
                      Release Date
                    </Text>
                    <Text
                      style={{
                        ...theme.fonts.SourceSansPro_Regular_14,
                        lineHeight:
                          theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
                        color: theme.colors.mainDark,
                      }}
                    >
                      {loan.ReleaseDate}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: theme.sizes.marginBottom_14,
                    }}
                  >
                    <Text
                      style={{
                        ...theme.fonts.SourceSansPro_Regular_14,
                        lineHeight:
                          theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
                        textTransform: 'capitalize',
                        color: theme.colors.bodyTextColor,
                      }}
                    >
                      Applied Amount
                    </Text>
                    <Text
                      style={{
                        ...theme.fonts.SourceSansPro_Regular_14,
                        lineHeight:
                          theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
                        color: theme.colors.mainDark,
                      }}
                    >
                      {loan.AppliedAmount}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: theme.sizes.marginBottom_14,
                    }}
                  >
                    <Text
                      style={{
                        ...theme.fonts.SourceSansPro_Regular_14,
                        lineHeight:
                          theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
                        textTransform: 'capitalize',
                        color: theme.colors.bodyTextColor,
                      }}
                    >
                      Total Payable
                    </Text>
                    <Text
                      style={{
                        ...theme.fonts.SourceSansPro_Regular_14,
                        lineHeight:
                          theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
                        color: theme.colors.mainDark,
                      }}
                    >
                      {loan.TotalPayable}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: theme.sizes.marginBottom_14,
                    }}
                  >
                    <Text
                      style={{
                        ...theme.fonts.SourceSansPro_Regular_14,
                        lineHeight:
                          theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
                        textTransform: 'capitalize',
                        color: theme.colors.bodyTextColor,
                      }}
                    >
                      Total Paid
                    </Text>
                    <Text
                      style={{
                        ...theme.fonts.SourceSansPro_Regular_14,
                        lineHeight:
                          theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
                        color: theme.colors.mainDark,
                      }}
                    >
                      {loan.TotalPaid}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: theme.sizes.marginBottom_14,
                    }}
                  >
                    <Text
                      style={{
                        ...theme.fonts.SourceSansPro_Regular_14,
                        lineHeight:
                          theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
                        textTransform: 'capitalize',
                        color: theme.colors.bodyTextColor,
                      }}
                    >
                      Due Amount
                    </Text>
                    <Text
                      style={{
                        ...theme.fonts.SourceSansPro_Regular_14,
                        lineHeight:
                          theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
                        color: theme.colors.mainDark,
                      }}
                    >
                      {loan.DueAmount}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: theme.sizes.marginBottom_14,
                    }}
                  >
                    <Text
                      style={{
                        ...theme.fonts.SourceSansPro_Regular_14,
                        lineHeight:
                          theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
                        textTransform: 'capitalize',
                        color: theme.colors.bodyTextColor,
                      }}
                    >
                      Late Payment Penalties
                    </Text>
                    <Text
                      style={{
                        ...theme.fonts.SourceSansPro_Regular_14,
                        lineHeight:
                          theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
                        color: theme.colors.mainDark,
                      }}
                    >
                      {loan.LatePaymentPenalties}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: theme.sizes.marginBottom_14,
                    }}
                  >
                    <Text
                      style={{
                        ...theme.fonts.SourceSansPro_Regular_14,
                        lineHeight:
                          theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
                        textTransform: 'capitalize',
                        color: theme.colors.bodyTextColor,
                      }}
                    >
                      Attachment
                    </Text>
                    <Text
                      style={{
                        ...theme.fonts.SourceSansPro_Regular_14,
                        lineHeight:
                          theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
                        color: theme.colors.mainDark,
                      }}
                    >
                      {loan.Attachment}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: theme.sizes.marginBottom_14,
                    }}
                  >
                    <Text
                      style={{
                        ...theme.fonts.SourceSansPro_Regular_14,
                        lineHeight:
                          theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
                        textTransform: 'capitalize',
                        color: theme.colors.bodyTextColor,
                      }}
                    >
                      Approved Date
                    </Text>
                    <Text
                      style={{
                        ...theme.fonts.SourceSansPro_Regular_14,
                        lineHeight:
                          theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
                        color: theme.colors.mainDark,
                      }}
                    >
                      {loan.ApprovedDate}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: theme.sizes.marginBottom_14,
                    }}
                  >
                    <Text
                      style={{
                        ...theme.fonts.SourceSansPro_Regular_14,
                        lineHeight:
                          theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
                        textTransform: 'capitalize',
                        color: theme.colors.bodyTextColor,
                      }}
                    >
                      Approved By
                    </Text>
                    <Text
                      style={{
                        ...theme.fonts.SourceSansPro_Regular_14,
                        lineHeight:
                          theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
                        color: theme.colors.mainDark,
                      }}
                    >
                      {loan.ApprovedBy}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: theme.sizes.marginBottom_14,
                    }}
                  >
                    <Text
                      style={{
                        ...theme.fonts.SourceSansPro_Regular_14,
                        lineHeight:
                          theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
                        textTransform: 'capitalize',
                        color: theme.colors.bodyTextColor,
                      }}
                    >
                      Description
                    </Text>
                    <Text
                      style={{
                        ...theme.fonts.SourceSansPro_Regular_14,
                        lineHeight:
                          theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
                        color: theme.colors.mainDark,
                      }}
                    >
                      {loan.Description}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: theme.sizes.marginBottom_14,
                    }}
                  >
                    <Text
                      style={{
                        ...theme.fonts.SourceSansPro_Regular_14,
                        lineHeight:
                          theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
                        textTransform: 'capitalize',
                        color: theme.colors.bodyTextColor,
                      }}
                    >
                      Remarks
                    </Text>
                    <Text
                      style={{
                        ...theme.fonts.SourceSansPro_Regular_14,
                        lineHeight:
                          theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
                        color: theme.colors.mainDark,
                      }}
                    >
                      {loan.Remarks}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })
        ) : type === 'Collateral' ? (
          <Collateral />
        ) : type === 'Schedules' ? (
          <RepaymentsSchedule />
        ) : type === 'Repayments' ? (
          <Repayments />
        ) : (
          <LoanDetails />
        )}
      </ScrollView>
    );
  };

  return (
    <components.SafeAreaView>
      {renderHeader()}
      {renderType()}
      {renderContent()}
    </components.SafeAreaView>
  );
};

export default LoanDetails;
