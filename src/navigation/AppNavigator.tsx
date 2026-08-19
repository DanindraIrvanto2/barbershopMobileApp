import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';

import LoginScreen from '../screens/LoginScreen';
import OrdersScreen from '../screens/OrdersScreen';
import NewOrderScreen from '../screens/NewOrderScreen';
import CustomerSelectionScreen from '../screens/CustomerSelectionScreen';
import KapsterSelectionScreen from '../screens/KapsterSelectionScreen';
import ServiceSelectionScreen from '../screens/ServiceSelectionScreen';
import OrderDetailScreen from '../screens/OrderDetailScreen';
import PaymentScreen from '../screens/PaymentScreen';
import InvoicePreviewScreen from '../screens/InvoicePreviewScreen';

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
        {/* Auth / Login Screen */}
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            headerShown: false,
          }}
        />

        {/* Main Cashier Orders Screen */}
        <Stack.Screen
          name="Orders"
          component={OrdersScreen}
          options={{
            headerShown: false, // Handled custom in screen
          }}
        />

        {/* New Order Flow */}
        <Stack.Screen
          name="CustomerSelection"
          component={CustomerSelectionScreen}
          options={{
            title: '1. Pilih Customer',
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="KapsterSelection"
          component={KapsterSelectionScreen}
          options={{
            title: '2. Pilih Kapster',
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="ServiceSelection"
          component={ServiceSelectionScreen}
          options={{
            title: '3. Pilih Layanan',
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="NewOrder"
          component={NewOrderScreen}
          options={{
            title: 'Konfirmasi Order',
            headerShown: true,
          }}
        />

        {/* Order Detail & Payment Flow */}
        <Stack.Screen
          name="OrderDetail"
          component={OrderDetailScreen}
          options={{
            title: 'Detail Order',
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="Payment"
          component={PaymentScreen}
          options={{
            title: 'Kasir Pembayaran',
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="InvoicePreview"
          component={InvoicePreviewScreen}
          options={{
            title: 'Pratinjau Invoice',
            headerShown: true,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
