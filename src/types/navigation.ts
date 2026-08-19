import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Login: undefined;
  Menu: undefined;
};

export type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;
export type MenuScreenProps = NativeStackScreenProps<RootStackParamList, 'Menu'>;

// Fallback compatibility types
export type OrdersScreenProps = any;
export type NewOrderScreenProps = any;
export type NewOrdersScreenProps = any;
export type CustomerSelectionScreenProps = any;
export type KapsterSelectionScreenProps = any;
export type ServiceSelectionScreenProps = any;
export type OrderDetailScreenProps = any;
export type PaymentScreenProps = any;
export type InvoicePreviewScreenProps = any;
