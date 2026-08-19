// import React, { useState } from 'react';
// import {
//   StyleSheet,
//   Text,
//   View,
//   TouchableOpacity,
//   SafeAreaView,
//   ScrollView,
//   Alert,
// } from 'react-native';
// import type { OrderDetailScreenProps } from '../types/navigation';

// export default function OrderDetailScreen({ route, navigation }: OrderDetailScreenProps) {
//   const orderId = route.params?.orderId ?? 103;
//   const customerName = route.params?.customerName ?? 'Reza Rahardian';
//   const initialStatus = route.params?.status ?? 'COMPLETED';

//   const [currentStatus, setCurrentStatus] = useState(initialStatus);

//   const totalBill = 90000;

//   const handleUpdateStatus = (newStatus: string) => {
//     setCurrentStatus(newStatus);
//     Alert.alert('Status Diperbarui', `Status antrean #${orderId} kini menjadi ${newStatus}`);
//   };

//   const getStatusBadgeStyle = (status: string) => {
//     switch (status) {
//       case 'WAITING':
//         return { bg: '#FEF3C7', text: '#92400E', label: 'Waiting' };
//       case 'IN_SERVICE':
//         return { bg: '#DBEAFE', text: '#1E40AF', label: 'In Service' };
//       case 'COMPLETED':
//         return { bg: '#D1FAE5', text: '#065F46', label: 'Completed (Unpaid)' };
//       default:
//         return { bg: '#334155', text: '#CBD5E1', label: status };
//     }
//   };

//   const badge = getStatusBadgeStyle(currentStatus);

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView contentContainerStyle={styles.content}>
//         {/* Header Summary Card */}
//         <View style={styles.detailCard}>
//           <View style={styles.cardHeaderRow}>
//             <Text style={styles.orderCode}>#ORD-{orderId}</Text>
//             <View style={[styles.badgeContainer, { backgroundColor: badge.bg }]}>
//               <Text style={[styles.badgeText, { color: badge.text }]}>{badge.label}</Text>
//             </View>
//           </View>

//           <View style={styles.infoRow}>
//             <Text style={styles.infoLabel}>Nama Pelanggan:</Text>
//             <Text style={styles.infoValue}>{customerName}</Text>
//           </View>

//           <View style={styles.infoRow}>
//             <Text style={styles.infoLabel}>Kapster yang Bertugas:</Text>
//             <Text style={styles.infoValue}>Budi Santoso (Senior Barber)</Text>
//           </View>

//           <View style={styles.infoRow}>
//             <Text style={styles.infoLabel}>Waktu Check-in:</Text>
//             <Text style={styles.infoValue}>10:15 WIB</Text>
//           </View>
//         </View>

//         {/* Status Pengerjaan Selector */}
//         <View style={styles.detailCard}>
//           <Text style={styles.cardSectionTitle}>Update Status Pengerjaan:</Text>
//           <View style={styles.statusButtonsRow}>
//             <TouchableOpacity
//               style={[
//                 styles.statusBtn,
//                 currentStatus === 'WAITING' && styles.statusBtnWaitingActive,
//               ]}
//               onPress={() => handleUpdateStatus('WAITING')}
//             >
//               <Text
//                 style={[
//                   styles.statusBtnText,
//                   currentStatus === 'WAITING' && styles.statusBtnTextActive,
//                 ]}
//               >
//                 Waiting
//               </Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={[
//                 styles.statusBtn,
//                 currentStatus === 'IN_SERVICE' && styles.statusBtnServiceActive,
//               ]}
//               onPress={() => handleUpdateStatus('IN_SERVICE')}
//             >
//               <Text
//                 style={[
//                   styles.statusBtnText,
//                   currentStatus === 'IN_SERVICE' && styles.statusBtnTextActive,
//                 ]}
//               >
//                 In Service
//               </Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={[
//                 styles.statusBtn,
//                 currentStatus === 'COMPLETED' && styles.statusBtnCompletedActive,
//               ]}
//               onPress={() => handleUpdateStatus('COMPLETED')}
//             >
//               <Text
//                 style={[
//                   styles.statusBtnText,
//                   currentStatus === 'COMPLETED' && styles.statusBtnTextActive,
//                 ]}
//               >
//                 Completed
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Services List */}
//         <View style={styles.detailCard}>
//           <Text style={styles.cardSectionTitle}>Rincian Layanan:</Text>

//           <View style={styles.serviceItem}>
//             <View>
//               <Text style={styles.serviceItemName}>Premium Cut & Wash</Text>
//               <Text style={styles.serviceItemSub}>Durasi: 45 Menit</Text>
//             </View>
//             <Text style={styles.serviceItemPrice}>Rp 90.000</Text>
//           </View>

//           <View style={styles.divider} />

//           <View style={styles.totalRow}>
//             <Text style={styles.totalLabel}>Total Tagihan</Text>
//             <Text style={styles.totalAmount}>Rp {totalBill.toLocaleString('id-ID')}</Text>
//           </View>
//         </View>
//       </ScrollView>

//       {/* Bottom Action */}
//       <View style={styles.bottomBar}>
//         <TouchableOpacity
//           style={styles.payButton}
//           onPress={() =>
//             navigation.navigate('Payment', {
//               orderId,
//               customerName,
//               totalAmount: totalBill,
//             })
//           }
//           activeOpacity={0.85}
//         >
//           <Text style={styles.payButtonText}>
//             Bayar Sekarang (Rp {totalBill.toLocaleString('id-ID')}) →
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
//   detailCard: {
//     backgroundColor: '#1E293B',
//     borderRadius: 12,
//     padding: 16,
//     borderWidth: 1,
//     borderColor: '#334155',
//     gap: 10,
//   },
//   cardHeaderRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 4,
//   },
//   orderCode: {
//     color: '#38BDF8',
//     fontSize: 18,
//     fontWeight: '800',
//   },
//   cardSectionTitle: {
//     color: '#F8FAFC',
//     fontSize: 15,
//     fontWeight: '700',
//   },
//   badgeContainer: {
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 9999,
//   },
//   badgeText: {
//     fontSize: 11,
//     fontWeight: '700',
//   },
//   infoRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingVertical: 4,
//   },
//   infoLabel: {
//     color: '#94A3B8',
//     fontSize: 13,
//   },
//   infoValue: {
//     color: '#F8FAFC',
//     fontSize: 13,
//     fontWeight: '600',
//   },
//   statusButtonsRow: {
//     flexDirection: 'row',
//     gap: 8,
//     marginTop: 6,
//   },
//   statusBtn: {
//     flex: 1,
//     paddingVertical: 10,
//     borderRadius: 8,
//     backgroundColor: '#0F172A',
//     borderWidth: 1,
//     borderColor: '#334155',
//     alignItems: 'center',
//   },
//   statusBtnWaitingActive: {
//     backgroundColor: '#92400E',
//     borderColor: '#F59E0B',
//   },
//   statusBtnServiceActive: {
//     backgroundColor: '#1E40AF',
//     borderColor: '#3B82F6',
//   },
//   statusBtnCompletedActive: {
//     backgroundColor: '#065F46',
//     borderColor: '#10B981',
//   },
//   statusBtnText: {
//     color: '#94A3B8',
//     fontSize: 12,
//     fontWeight: '700',
//   },
//   statusBtnTextActive: {
//     color: '#FFFFFF',
//   },
//   serviceItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 6,
//   },
//   serviceItemName: {
//     color: '#F8FAFC',
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   serviceItemSub: {
//     color: '#64748B',
//     fontSize: 12,
//     marginTop: 2,
//   },
//   serviceItemPrice: {
//     color: '#10B981',
//     fontSize: 14,
//     fontWeight: '700',
//   },
//   divider: {
//     height: 1,
//     backgroundColor: '#334155',
//     marginVertical: 4,
//   },
//   totalRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingTop: 4,
//   },
//   totalLabel: {
//     color: '#F8FAFC',
//     fontSize: 15,
//     fontWeight: '700',
//   },
//   totalAmount: {
//     color: '#10B981',
//     fontSize: 20,
//     fontWeight: '800',
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
//   payButton: {
//     backgroundColor: '#10B981',
//     paddingVertical: 14,
//     borderRadius: 10,
//     alignItems: 'center',
//   },
//   payButtonText: {
//     color: '#FFFFFF',
//     fontSize: 15,
//     fontWeight: '700',
//   },
// });
