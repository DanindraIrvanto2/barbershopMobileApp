import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';

import LoginScreen from '../screens/LoginScreen';
import BottomTabNavigator from './BottomTabNavigator';
// import OrderDetailScreen from '../screens/OrderDetailScreen';
// import PaymentScreen from '../screens/PaymentScreen';
// import InvoicePreviewScreen from '../screens/InvoicePreviewScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#0F172A',
          },
          headerTintColor: '#F8FAFC',
          headerTitleStyle: {
            fontWeight: '700',
            fontSize: 18,
          },
          headerShadowVisible: false,
          headerBackTitle: '',
          contentStyle: {
            backgroundColor: '#0F172A',
          },
        }}
      >
        {/* Auth Gateway */}
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            headerShown: false,
          }}
        />

        {/* 2 Main Tabs: Antrean (Orders) & Check-in (NewOrders) */}
        <Stack.Screen
          name="MainTabs"
          component={BottomTabNavigator}
          options={{
            headerShown: false,
          }}
        />

        {/* Cashier Order Management & Payment Flow */}
        {/* <Stack.Screen
          name="OrderDetail"
          component={OrderDetailScreen}
          options={{
            title: 'Detail Order',
            headerShown: true,
          }}
        // /> */}
        // <Stack.Screen
        //   name="Payment"
        //   component={PaymentScreen}
        //   options={{
        //     title: 'Kasir Pembayaran',
        //     headerShown: true,
        //   }}
        // />
        {/* <Stack.Screen
          name="InvoicePreview"
          // component={InvoicePreviewScreen}
          options={{
            title: 'Pratinjau Struk',
        //     headerShown: true, */}
        {/* //   }}
        // /> */}
  //     </Stack.Navigator>
  //   </NavigationContainer>
  // );
}
