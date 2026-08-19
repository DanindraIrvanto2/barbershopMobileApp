import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';

export type MainTabParamList = {
  OrdersTab: undefined;
  NewOrdersTab: undefined;
};

export type RootStackParamList = {
  Login: undefined;
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
  OrderDetail: { orderId?: number; customerName?: string; status?: string } | undefined;
  Payment: { orderId?: number; totalAmount?: number; customerName?: string } | undefined;
  InvoicePreview: {
    orderId?: number;
    invoiceNumber?: string;
    totalAmount?: number;
    customerName?: string;
    paymentMethod?: string;
    changeAmount?: number;
    amountReceived?: number;
  } | undefined;
};

export type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;
export type OrderDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'OrderDetail'>;
export type PaymentScreenProps = NativeStackScreenProps<RootStackParamList, 'Payment'>;
export type InvoicePreviewScreenProps = NativeStackScreenProps<RootStackParamList, 'InvoicePreview'>;

export type OrdersScreenProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'OrdersTab'>,
  NativeStackScreenProps<RootStackParamList>
>;

export type NewOrdersScreenProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'NewOrdersTab'>,
  NativeStackScreenProps<RootStackParamList>
>;
