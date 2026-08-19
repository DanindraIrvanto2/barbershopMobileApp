// import React, { useState } from 'react';
// import {
//   StyleSheet,
//   Text,
//   View,
//   TextInput,
//   TouchableOpacity,
//   SafeAreaView,
//   ScrollView,
//   Alert,
// } from 'react-native';
// import type { PaymentScreenProps } from '../types/navigation';

// export default function PaymentScreen({ route, navigation }: PaymentScreenProps) {
//   const orderId = route.params?.orderId ?? 103;
//   const customerName = route.params?.customerName ?? 'Reza Rahardian';
//   const totalAmount = route.params?.totalAmount ?? 90000;

//   const [selectedMethod, setSelectedMethod] = useState<'CASH' | 'QRIS'>('CASH');
//   const [cashInput, setCashInput] = useState('100000');

//   const receivedAmount = selectedMethod === 'CASH' ? parseInt(cashInput) || 0 : totalAmount;
//   const changeAmount = Math.max(0, receivedAmount - totalAmount);
//   const isEnough = receivedAmount >= totalAmount;

//   const handleProcessPayment = () => {
//     if (selectedMethod === 'CASH' && !isEnough) {
//       Alert.alert(
//         'Uang Kurang',
//         `Nominal yang diterima (Rp ${receivedAmount.toLocaleString('id-ID')}) kurang dari total tagihan (Rp ${totalAmount.toLocaleString('id-ID')})`
//       );
//       return;
//     }

//     Alert.alert(
//       'Pembayaran Berhasil! 🎉',
//       `Status order #${orderId} kini PAID (LUNAS).\nMetode: ${selectedMethod}\nKembalian: Rp ${changeAmount.toLocaleString('id-ID')}`,
//       [
//         {
//           text: 'Lihat Struk / Invoice',
//           onPress: () => {
//             navigation.navigate('InvoicePreview', {
//               orderId,
//               invoiceNumber: `INV-2026-${orderId}`,
//               customerName,
//               totalAmount,
//               paymentMethod: selectedMethod === 'CASH' ? 'Tunai (Cash)' : 'QRIS Digital',
//               amountReceived: receivedAmount,
//               changeAmount,
//             });
//           },
//         },
//       ]
//     );
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView contentContainerStyle={styles.content}>
//         {/* Total Tagihan Box */}
//         <View style={styles.billCard}>
//           <Text style={styles.billLabel}>Total Tagihan Order #{orderId}:</Text>
//           <Text style={styles.billAmount}>Rp {totalAmount.toLocaleString('id-ID')}</Text>
//           <Text style={styles.customerSub}>Pelanggan: {customerName}</Text>
//         </View>

//         {/* Payment Method Selector */}
//         <Text style={styles.sectionTitle}>Pilih Metode Pembayaran</Text>
//         <View style={styles.methodGrid}>
//           <TouchableOpacity
//             style={[styles.methodCard, selectedMethod === 'CASH' && styles.methodCardActive]}
//             onPress={() => setSelectedMethod('CASH')}
//             activeOpacity={0.8}
//           >
//             <View
//               style={[
//                 styles.methodBadge,
//                 selectedMethod === 'CASH' && styles.methodBadgeActive,
//               ]}
//             >
//               <Text
//                 style={[
//                   styles.methodBadgeText,
//                   selectedMethod === 'CASH' && styles.methodBadgeTextActive,
//                 ]}
//               >
//                 CASH
//               </Text>
//             </View>
//             <Text
//               style={[
//                 styles.methodTitle,
//                 selectedMethod === 'CASH' && styles.methodTitleActive,
//               ]}
//             >
//               Tunai (Cash)
//             </Text>
//             <Text style={styles.methodSub}>Bayar dengan uang fisik</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={[styles.methodCard, selectedMethod === 'QRIS' && styles.methodCardActive]}
//             onPress={() => setSelectedMethod('QRIS')}
//             activeOpacity={0.8}
//           >
//             <View
//               style={[
//                 styles.methodBadge,
//                 selectedMethod === 'QRIS' && styles.methodBadgeActive,
//               ]}
//             >
//               <Text
//                 style={[
//                   styles.methodBadgeText,
//                   selectedMethod === 'QRIS' && styles.methodBadgeTextActive,
//                 ]}
//               >
//                 QRIS
//               </Text>
//             </View>
//             <Text
//               style={[
//                 styles.methodTitle,
//                 selectedMethod === 'QRIS' && styles.methodTitleActive,
//               ]}
//             >
//               QRIS
//             </Text>
//             <Text style={styles.methodSub}>Scan QR Barcode</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Cash Calculation Form */}
//         {selectedMethod === 'CASH' ? (
//           <View style={styles.formCard}>
//             <Text style={styles.formTitle}>Perhitungan Uang Tunai:</Text>

//             <View style={styles.inputGroup}>
//               <Text style={styles.inputLabel}>Uang yang Diterima (Rp)</Text>
//               <TextInput
//                 style={styles.input}
//                 keyboardType="numeric"
//                 value={cashInput}
//                 onChangeText={setCashInput}
//                 placeholder="0"
//                 placeholderTextColor="#64748B"
//               />
//             </View>

//             {/* Quick Amount Buttons */}
//             <View style={styles.quickAmountsRow}>
//               <TouchableOpacity
//                 style={styles.quickBtn}
//                 onPress={() => setCashInput(totalAmount.toString())}
//               >
//                 <Text style={styles.quickBtnText}>Uang Pas</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={styles.quickBtn}
//                 onPress={() => setCashInput('50000')}
//               >
//                 <Text style={styles.quickBtnText}>50.000</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={styles.quickBtn}
//                 onPress={() => setCashInput('100000')}
//               >
//                 <Text style={styles.quickBtnText}>100.000</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={styles.quickBtn}
//                 onPress={() => setCashInput('150000')}
//               >
//                 <Text style={styles.quickBtnText}>150.000</Text>
//               </TouchableOpacity>
//             </View>

//             {/* Change calculation box */}
//             <View style={styles.changeBox}>
//               <Text style={styles.changeLabel}>Kembalian:</Text>
//               <Text
//                 style={[
//                   styles.changeValue,
//                   !isEnough && styles.changeValueShortage,
//                 ]}
//               >
//                 {isEnough
//                   ? `Rp ${changeAmount.toLocaleString('id-ID')}`
//                   : `Kurang Rp ${(totalAmount - receivedAmount).toLocaleString('id-ID')}`}
//               </Text>
//             </View>
//           </View>
//         ) : (
//           <View style={styles.qrisCard}>
//             <Text style={styles.qrisTitle}>📱 Pembayaran QRIS</Text>
//             <View style={styles.qrisBox}>
//               <Text style={styles.qrisCodeText}>[ QRIS CODE AKTIF ]</Text>
//               <Text style={styles.qrisSubtext}>
//                 Tunjukkan QRIS ke pelanggan untuk scan via BCA/GoPay/OVO/DANA.
//               </Text>
//             </View>
//           </View>
//         )}
//       </ScrollView>

//       {/* Bottom Process Button */}
//       <View style={styles.bottomBar}>
//         <TouchableOpacity
//           style={[styles.payCompleteButton, !isEnough && styles.payCompleteButtonDisabled]}
//           onPress={handleProcessPayment}
//           activeOpacity={0.85}
//           disabled={!isEnough}
//         >
//           <Text style={styles.payCompleteButtonText}>
//             Konfirmasi Bayar & Terbitkan Struk →
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#0F172A',
//   },
//   content: {
//     padding: 16,
//     gap: 16,
//     paddingBottom: 90,
//   },
//   billCard: {
//     backgroundColor: '#1E293B',
//     borderRadius: 14,
//     padding: 20,
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#334155',
//   },
//   billLabel: {
//     color: '#94A3B8',
//     fontSize: 13,
//     marginBottom: 4,
//   },
//   billAmount: {
//     color: '#10B981',
//     fontSize: 30,
//     fontWeight: '800',
//   },
//   customerSub: {
//     color: '#38BDF8',
//     fontSize: 13,
//     fontWeight: '600',
//     marginTop: 6,
//   },
//   sectionTitle: {
//     color: '#94A3B8',
//     fontSize: 13,
//     fontWeight: '700',
//     textTransform: 'uppercase',
//   },
//   methodGrid: {
//     flexDirection: 'row',
//     gap: 12,
//   },
//   methodCard: {
//     flex: 1,
//     backgroundColor: '#1E293B',
//     borderRadius: 12,
//     padding: 16,
//     alignItems: 'center',
//     borderWidth: 2,
//     borderColor: '#334155',
//   },
//   methodCardActive: {
//     borderColor: '#2563EB',
//     backgroundColor: '#1E3A5F',
//   },
//   methodBadge: {
//     paddingHorizontal: 12,
//     paddingVertical: 4,
//     borderRadius: 6,
//     backgroundColor: '#334155',
//     marginBottom: 8,
//   },
//   methodBadgeActive: {
//     backgroundColor: '#2563EB',
//   },
//   methodBadgeText: {
//     color: '#94A3B8',
//     fontSize: 11,
//     fontWeight: '800',
//   },
//   methodBadgeTextActive: {
//     color: '#FFFFFF',
//   },
//   methodTitle: {
//     color: '#94A3B8',
//     fontSize: 14,
//     fontWeight: '700',
//   },
//   methodTitleActive: {
//     color: '#FFFFFF',
//   },
//   methodSub: {
//     color: '#64748B',
//     fontSize: 11,
//     marginTop: 2,
//   },
//   formCard: {
//     backgroundColor: '#1E293B',
//     borderRadius: 12,
//     padding: 16,
//     borderWidth: 1,
//     borderColor: '#334155',
//     gap: 12,
//   },
//   formTitle: {
//     color: '#F8FAFC',
//     fontSize: 14,
//     fontWeight: '700',
//   },
//   inputGroup: {
//     gap: 6,
//   },
//   inputLabel: {
//     color: '#94A3B8',
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   input: {
//     backgroundColor: '#0F172A',
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#334155',
//     paddingHorizontal: 14,
//     paddingVertical: 12,
//     color: '#F8FAFC',
//     fontSize: 18,
//     fontWeight: '700',
//   },
//   quickAmountsRow: {
//     flexDirection: 'row',
//     gap: 8,
//   },
//   quickBtn: {
//     flex: 1,
//     backgroundColor: '#0F172A',
//     paddingVertical: 8,
//     borderRadius: 6,
//     borderWidth: 1,
//     borderColor: '#334155',
//     alignItems: 'center',
//   },
//   quickBtnText: {
//     color: '#38BDF8',
//     fontSize: 11,
//     fontWeight: '700',
//   },
//   changeBox: {
//     backgroundColor: '#0F172A',
//     padding: 14,
//     borderRadius: 10,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginTop: 4,
//   },
//   changeLabel: {
//     color: '#94A3B8',
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   changeValue: {
//     color: '#10B981',
//     fontSize: 18,
//     fontWeight: '800',
//   },
//   changeValueShortage: {
//     color: '#EF4444',
//   },
//   qrisCard: {
//     backgroundColor: '#1E293B',
//     borderRadius: 12,
//     padding: 20,
//     borderWidth: 1,
//     borderColor: '#334155',
//     alignItems: 'center',
//     gap: 10,
//   },
//   qrisTitle: {
//     color: '#F8FAFC',
//     fontSize: 16,
//     fontWeight: '700',
//   },
//   qrisBox: {
//     backgroundColor: '#0F172A',
//     padding: 20,
//     borderRadius: 12,
//     alignItems: 'center',
//     width: '100%',
//     borderWidth: 1,
//     borderColor: '#334155',
//   },
//   qrisCodeText: {
//     color: '#38BDF8',
//     fontSize: 16,
//     fontWeight: '800',
//     letterSpacing: 2,
//     marginBottom: 6,
//   },
//   qrisSubtext: {
//     color: '#64748B',
//     fontSize: 12,
//     textAlign: 'center',
//   },
//   bottomBar: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     padding: 16,
//     backgroundColor: '#0F172A',
//     borderTopWidth: 1,
//     borderTopColor: '#1E293B',
//   },
//   payCompleteButton: {
//     backgroundColor: '#10B981',
//     paddingVertical: 14,
//     borderRadius: 10,
//     alignItems: 'center',
//   },
//   payCompleteButtonDisabled: {
//     opacity: 0.5,
//   },
//   payCompleteButtonText: {
//     color: '#FFFFFF',
//     fontSize: 15,
//     fontWeight: '700',
//   },
// });
