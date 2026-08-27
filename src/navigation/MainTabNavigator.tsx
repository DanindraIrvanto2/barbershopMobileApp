import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import OrderScreen from '../screens/OrderScreen';
import CustomerScreen from '../screens/CustomerScreen';
import type { MainTabParamList } from '../types/navigation';

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false, // Custom rendered inside tab item
        tabBarStyle: styles.tabBar,
      }}
    >
      {/* HOME TAB */}
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabItem}>
              <Ionicons
                name={focused ? 'home' : 'home-outline'}
                size={22}
                color={focused ? '#000000' : '#8E8E93'}
              />
              <Text
                style={[
                  styles.tabLabel,
                  { color: focused ? '#000000' : '#8E8E93' },
                ]}
              >
                HOME
              </Text>
              <View
                style={[
                  styles.activeDot,
                  { backgroundColor: focused ? '#000000' : 'transparent' },
                ]}
              />
            </View>
          ),
        }}
      />

      {/* ORDERS TAB */}
      <Tab.Screen
        name="Order"
        component={OrderScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabItem}>
              <Ionicons
                name={focused ? 'cut' : 'cut-outline'}
                size={22}
                color={focused ? '#000000' : '#8E8E93'}
              />
              <Text
                style={[
                  styles.tabLabel,
                  { color: focused ? '#000000' : '#8E8E93' },
                ]}
              >
                ORDERS
              </Text>
              <View
                style={[
                  styles.activeDot,
                  { backgroundColor: focused ? '#000000' : 'transparent' },
                ]}
              />
            </View>
          ),
        }}
      />

      {/* CUSTOMERS TAB */}
      <Tab.Screen
        name="Customer"
        component={CustomerScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabItem}>
              <Ionicons
                name={focused ? 'people' : 'people-outline'}
                size={22}
                color={focused ? '#000000' : '#8E8E93'}
              />
              <Text
                style={[
                  styles.tabLabel,
                  { color: focused ? '#000000' : '#8E8E93' },
                ]}
              >
                CUSTOMERS
              </Text>
              <View
                style={[
                  styles.activeDot,
                  { backgroundColor: focused ? '#000000' : 'transparent' },
                ]}
              />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EAEAEA',
    height: Platform.OS === 'ios' ? 78 : 64,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 18 : 6,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginTop: 4,
    textAlign: 'center',
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 3,
  },
});