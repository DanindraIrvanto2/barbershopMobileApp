import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Login: undefined;
  Orders: undefined;
  NewOrder: undefined;
  CustomerSelection: undefined;
  KapsterSelection: undefined;
  ServiceSelection: undefined;
  OrderDetail: { orderId?: number; customerName?: string; status?: string } | undefined;
  Payment: { orderId?: number; totalAmount?: number } | undefined;
  InvoicePreview: { orderId?: number; invoiceNumber?: string } | undefined;
};

export type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;
export type OrdersScreenProps = NativeStackScreenProps<RootStackParamList, 'Orders'>;
export type NewOrderScreenProps = NativeStackScreenProps<RootStackParamList, 'NewOrder'>;
export type CustomerSelectionScreenProps = NativeStackScreenProps<RootStackParamList, 'CustomerSelection'>;
export type KapsterSelectionScreenProps = NativeStackScreenProps<RootStackParamList, 'KapsterSelection'>;
export type ServiceSelectionScreenProps = NativeStackScreenProps<RootStackParamList, 'ServiceSelection'>;
export type OrderDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'OrderDetail'>;
export type PaymentScreenProps = NativeStackScreenProps<RootStackParamList, 'Payment'>;
export type InvoicePreviewScreenProps = NativeStackScreenProps<RootStackParamList, 'InvoicePreview'>;
