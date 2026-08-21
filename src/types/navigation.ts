import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

export type RootStackParamList = {
  Login: undefined;
  MainTabs: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Order: undefined;
};

export type LoginScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Login'
>;

export type HomeScreenProps = BottomTabScreenProps<
  MainTabParamList,
  'Home'
>;

export type OrdersScreenProps = BottomTabScreenProps<
  MainTabParamList,
  'Order'
>;

// Fallback compatibility types
export type MenuScreenProps = any;
export type NewOrderScreenProps = any;
export type NewOrdersScreenProps = any;
export type CustomerSelectionScreenProps = any;
export type KapsterSelectionScreenProps = any;
export type ServiceSelectionScreenProps = any;
export type OrderDetailScreenProps = any;
export type PaymentScreenProps = any;
export type InvoicePreviewScreenProps = any;