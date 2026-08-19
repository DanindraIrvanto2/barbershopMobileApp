// import React from 'react';
// import {
//   StyleSheet,
//   Text,
//   View,
//   TouchableOpacity,
//   SafeAreaView,
//   ScrollView,
//   Alert,
// } from 'react-native';
// import type { InvoicePreviewScreenProps } from '../types/navigation';

// export default function InvoicePreviewScreen({ route, navigation }: InvoicePreviewScreenProps) {
//   const invoiceNumber = route.params?.invoiceNumber ?? 'INV-2026-103';
//   const customerName = route.params?.customerName ?? 'Reza Rahardian';
//   const totalAmount = route.params?.totalAmount ?? 90000;
//   const paymentMethod = route.params?.paymentMethod ?? 'Tunai (Cash)';
//   const amountReceived = route.params?.amountReceived ?? 100000;
//   const changeAmount = route.params?.changeAmount ?? 10000;

//   const now = new Date();
//   const dateStr = now.toLocaleDateString('id-ID', {
//     day: 'numeric',
//     month: 'long',
//     year: 'numeric',
//   });
//   const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(
//     now.getMinutes()
//   ).padStart(2, '0')} WIB`;

//   const handlePrint = () => {
//     Alert.alert('Cetak Struk', 'Perintah cetak Bluetooth Thermal Printer terkirim!');
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView contentContainerStyle={styles.content}>
//         {/* Receipt Paper Card */}
//         <View style={styles.receiptPaper}>
//           {/* Header */}
//           <View style={styles.receiptHeader}>
//             <Text style={styles.shopTitle}>💈 HAIRDEPT BARBERSHOP</Text>
//             <Text style={styles.shopSub}>Jl. Barbershop No. 123, Jakarta</Text>
//             <Text style={styles.shopSub}>Telp: 0812-3456-7890</Text>
//           </View>

//           <View style={styles.dashedLine} />

//           {/* Metadata */}
//           <View style={styles.metaRow}>
//             <Text style={styles.metaLabel}>No. Transaksi:</Text>
//             <Text style={styles.metaValue}>{invoiceNumber}</Text>
//           </View>
//           <View style={styles.metaRow}>
//             <Text style={styles.metaLabel}>Tanggal:</Text>
//             <Text style={styles.metaValue}>{dateStr} {timeStr}</Text>
//           </View>
//           <View style={styles.metaRow}>
//             <Text style={styles.metaLabel}>Pelanggan:</Text>
//             <Text style={styles.metaValue}>{customerName}</Text>
//           </View>
//           <View style={styles.metaRow}>
//             <Text style={styles.metaLabel}>Kasir / Operator:</Text>
//             <Text style={styles.metaValue}>Kasir Hairdept</Text>
//           </View>

//           <View style={styles.dashedLine} />

//           {/* Items */}
//           <View style={styles.itemsHeader}>
//             <Text style={styles.itemsHeaderTitle}>ITEM / LAYANAN</Text>
//             <Text style={styles.itemsHeaderTitle}>TOTAL</Text>
//           </View>

//           <View style={styles.itemRow}>
//             <View style={styles.itemInfo}>
//               <Text style={styles.itemName}>1x Premium Cut & Wash</Text>
//               <Text style={styles.itemKapster}>Kapster: Budi Santoso</Text>
//             </View>
//             <Text style={styles.itemPrice}>
//               Rp {totalAmount.toLocaleString('id-ID')}
//             </Text>
//           </View>

//           <View style={styles.dashedLine} />

//           {/* Payment breakdown */}
//           <View style={styles.breakdownRow}>
//             <Text style={styles.breakdownLabelBold}>TOTAL BIAYA:</Text>
//             <Text style={styles.breakdownValueBold}>
//               Rp {totalAmount.toLocaleString('id-ID')}
//             </Text>
//           </View>
//           <View style={styles.breakdownRow}>
//             <Text style={styles.breakdownLabel}>Metode Pembayaran:</Text>
//             <Text style={styles.breakdownValue}>{paymentMethod}</Text>
//           </View>
//           <View style={styles.breakdownRow}>
//             <Text style={styles.breakdownLabel}>Uang Diterima:</Text>
//             <Text style={styles.breakdownValue}>
//               Rp {amountReceived.toLocaleString('id-ID')}
//             </Text>
//           </View>
//           <View style={styles.breakdownRow}>
//             <Text style={styles.breakdownLabel}>Kembalian:</Text>
//             <Text style={styles.breakdownValue}>
//               Rp {changeAmount.toLocaleString('id-ID')}
//             </Text>
//           </View>

//           <View style={styles.dashedLine} />

//           {/* Paid Badge & Footer */}
//           <View style={styles.paidBadgeBox}>
//             <Text style={styles.paidBadgeText}>✓ LUNAS (PAID)</Text>
//           </View>

//           <Text style={styles.footerNote}>
//             Terima kasih atas kepercayaan Anda!{'\n'}Silakan berkunjung kembali.
//           </Text>
//         </View>

//         {/* Print Option */}
//         <TouchableOpacity style={styles.printBtn} onPress={handlePrint} activeOpacity={0.8}>
//           <Text style={styles.printBtnText}>🖨 Cetak Struk Thermal</Text>
//         </TouchableOpacity>
//       </ScrollView>

//       {/* Done Button */}
//       <View style={styles.bottomBar}>
//         <TouchableOpacity
//           style={styles.doneButton}
//           onPress={() => navigation.navigate('MainTabs')}
//           activeOpacity={0.85}
//         >
//           <Text style={styles.doneButtonText}>Selesai & Kembali ke Antrean</Text>
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
//     gap: 14,
//     paddingBottom: 90,
//   },
//   receiptPaper: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 12,
//     padding: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.15,
//     shadowRadius: 10,
//     elevation: 4,
//   },
//   receiptHeader: {
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   shopTitle: {
//     color: '#0F172A',
//     fontSize: 17,
//     fontWeight: '800',
//     letterSpacing: 0.5,
//   },
//   shopSub: {
//     color: '#64748B',
//     fontSize: 12,
//     marginTop: 2,
//   },
//   dashedLine: {
//     height: 1,
//     backgroundColor: '#E2E8F0',
//     marginVertical: 10,
//   },
//   metaRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingVertical: 2,
//   },
//   metaLabel: {
//     color: '#64748B',
//     fontSize: 12,
//   },
//   metaValue: {
//     color: '#0F172A',
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   itemsHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingBottom: 4,
//   },
//   itemsHeaderTitle: {
//     color: '#94A3B8',
//     fontSize: 11,
//     fontWeight: '700',
//   },
//   itemRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingVertical: 4,
//   },
//   itemInfo: {
//     flex: 1,
//   },
//   itemName: {
//     color: '#0F172A',
//     fontSize: 13,
//     fontWeight: '600',
//   },
//   itemKapster: {
//     color: '#64748B',
//     fontSize: 11,
//     marginTop: 1,
//   },
//   itemPrice: {
//     color: '#0F172A',
//     fontSize: 13,
//     fontWeight: '700',
//   },
//   breakdownRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingVertical: 3,
//   },
//   breakdownLabel: {
//     color: '#64748B',
//     fontSize: 13,
//   },
//   breakdownValue: {
//     color: '#0F172A',
//     fontSize: 13,
//     fontWeight: '600',
//   },
//   breakdownLabelBold: {
//     color: '#0F172A',
//     fontSize: 14,
//     fontWeight: '800',
//   },
//   breakdownValueBold: {
//     color: '#0F172A',
//     fontSize: 15,
//     fontWeight: '800',
//   },
//   paidBadgeBox: {
//     backgroundColor: '#D1FAE5',
//     paddingVertical: 8,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginVertical: 4,
//   },
//   paidBadgeText: {
//     color: '#065F46',
//     fontWeight: '800',
//     fontSize: 13,
//     letterSpacing: 0.5,
//   },
//   footerNote: {
//     color: '#94A3B8',
//     fontSize: 11,
//     textAlign: 'center',
//     lineHeight: 16,
//     marginTop: 8,
//   },
//   printBtn: {
//     backgroundColor: '#1E293B',
//     borderWidth: 1,
//     borderColor: '#334155',
//     paddingVertical: 12,
//     borderRadius: 10,
//     alignItems: 'center',
//   },
//   printBtnText: {
//     color: '#38BDF8',
//     fontWeight: '700',
//     fontSize: 14,
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
//   doneButton: {
//     backgroundColor: '#2563EB',
//     paddingVertical: 14,
//     borderRadius: 10,
//     alignItems: 'center',
//   },
//   doneButtonText: {
//     color: '#FFFFFF',
//     fontSize: 15,
//     fontWeight: '700',
//   },
// });
