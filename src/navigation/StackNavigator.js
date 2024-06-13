import React from 'react';
import {View, Text} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

import {screens} from '../screens';

import TabNavigator from './TabNavigator';
import StaffTabNavigator from './StaffTabNavigator';
import {components} from '../components';

const StackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='Onboarding'
        component={screens.Onboarding}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='SignUp'
        component={screens.SignUp}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='PasswordResetOtpScreen'
        component={screens.PasswordResetOtpScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='PasswordResetScreen'
        component={screens.PasswordResetScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='VerifyYourPhoneNumber'
        component={screens.VerifyYourPhoneNumber}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='SignIn'
        component={screens.SignIn}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='TabNavigator'
        component={TabNavigator}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='StaffTabNavigator'
        component={StaffTabNavigator}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='StaffDashboard'
        component={screens.StaffDashboard}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='OpenDeposit'
        component={screens.OpenDeposit}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='ScanDocuments'
        component={screens.ScanDocuments}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='SearchMember'
        component={screens.SearchMember}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='Transactions'
        component={screens.Transactions}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='FullImageView'
        component={screens.FullImageView}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='ClosedTicketScreen'
        component={screens.ClosedTicketScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='FDR'
        component={screens.FDR}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='PaymentSchedule'
        component={screens.PaymentSchedule}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='Fdr_Payments'
        component={screens.Fdr_Payments}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='Deposit'
        component={screens.Deposit}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='MemberInfo'
        component={screens.MemberInfo}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='AnnouncementDetails'
        component={screens.AnnouncementDetails}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='BenefitsDetail'
        component={screens.BenefitsDetail}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='Documents'
        component={screens.Documents}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='OpenMoneybox'
        component={screens.OpenMoneybox}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='Profile'
        component={screens.Profile}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='ReplyScreen'
        component={screens.ReplyScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='Announcements'
        component={screens.Announcements}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='DashboardNotification'
        component={screens.DashboardNotification}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='EditPersonalInfo'
        component={screens.EditPersonalInfo}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='OpenNewCard'
        component={screens.OpenNewCard}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='CreateInvoice'
        component={screens.CreateInvoice}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='InvoiceSent'
        component={screens.InvoiceSent}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='Statistics'
        component={screens.Statistics}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='Collateral'
        component={screens.Collateral}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='RepaymentsSchedule'
        component={screens.RepaymentsSchedule}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='Repayments'
        component={screens.Repayments}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='FAQ'
        component={screens.FAQ}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='PrivacyPolicy'
        component={screens.PrivacyPolicy}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='CardMenu'
        component={screens.CardMenu}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='CardDetails'
        component={screens.CardDetails}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='ChangePinCode'
        component={screens.ChangePinCode}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='Payments'
        component={screens.Payments}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='MobilePayment'
        component={screens.MobilePayment}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='FundTransfer'
        component={screens.FundTransfer}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='IBANPayment'
        component={screens.IBANPayment}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='TransactionDetails'
        component={screens.TransactionDetails}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='PaymentSuccess'
        component={screens.PaymentSuccess}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='PaymentFailed'
        component={screens.PaymentFailed}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='SignUpAccountCreated'
        component={screens.SignUpAccountCreated}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='SignInCode'
        component={screens.SignInCode}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='ForgotPassword'
        component={screens.ForgotPassword}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='NewPassword'
        component={screens.NewPassword}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='ForgotPasswordSentEmail'
        component={screens.ForgotPasswordSentEmail}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='ConfirmationCode'
        component={screens.ConfirmationCode}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='ExchangeRates'
        component={screens.ExchangeRates}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='OpenNewLoan'
        component={screens.OpenNewLoan}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='LoanList'
        component={screens.LoanList}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='LoanDetails'
        component={screens.LoanDetails}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='SupportTickets'
        component={screens.SupportTickets}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='NewTicket'
        component={screens.NewTicket}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='Benefits'
        component={screens.Benefits}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='TopUpPayment'
        component={screens.TopUpPayment}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='OtpScreen'
        component={screens.OtpScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default StackNavigator;
