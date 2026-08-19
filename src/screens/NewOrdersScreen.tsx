// import React, { useState } from 'react';
// import {
//   StyleSheet,
//   Text,
//   View,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   SafeAreaView,
//   StatusBar,
//   Modal,
//   Alert,
// } from 'react-native';
// import type { NewOrdersScreenProps } from '../types/navigation';

// interface CustomerItem {
//   id: number;
//   name: string;
//   phone: string;
// }

// interface KapsterItem {
//   id: number;
//   name: string;
//   role: string;
//   available: boolean;
// }

// interface ServiceItem {
//   id: number;
//   name: string;
//   duration: number;
//   price: number;
// }

// export default function NewOrdersScreen({ navigation }: NewOrdersScreenProps) {
//   // State for Customer
//   const [customers, setCustomers] = useState<CustomerItem[]>([
//     { id: 1, name: 'Ahmad Faiz', phone: '08123456789' },
//     { id: 2, name: 'Dimas Pratama', phone: '08219876543' },
//     { id: 3, name: 'Reza Rahardian', phone: '085711223344' },
//     { id: 4, name: 'Bambang Pamungkas', phone: '081399887766' },
//   ]);
//   const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(1);
//   const [customerSearch, setCustomerSearch] = useState('');

//   // State for Quick Add Customer Modal
//   const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
//   const [newCustName, setNewCustName] = useState('');
//   const [newCustPhone, setNewCustPhone] = useState('');

//   // State for Kapster
//   const kapsters: KapsterItem[] = [
//     { id: 1, name: 'Budi Santoso', role: 'Senior Barber', available: true },
//     { id: 2, name: 'Rian Pratama', role: 'Barber Specialist', available: true },
//     { id: 3, name: 'Doni Saputra', role: 'Junior Barber', available: false },
//   ];
//   const [selectedKapsterId, setSelectedKapsterId] = useState<number>(1);

//   // State for Services (Multi-select)
//   const services: ServiceItem[] = [
//     { id: 1, name: 'Haircut Regular', duration: 30, price: 45000 },
//     { id: 2, name: 'Haircut + Styling / Pomade', duration: 40, price: 55000 },
//     { id: 3, name: 'Gentleman Shaving', duration: 20, price: 30000 },
//     { id: 4, name: 'Complete Package (Cut + Shave + Wash)', duration: 60, price: 85000 },
//     { id: 5, name: 'Hair Wash & Scalp Massage', duration: 15, price: 25000 },
//   ];
//   const [selectedServiceIds, setSelectedServiceIds] = useState<number[]>([1]);

//   // Notes & Time
//   const getCurrentTime = () => {
//     const now = new Date();
//     const h = String(now.getHours()).padStart(2, '0');
//     const m = String(now.getMinutes()).padStart(2, '0');
//     return `${h}:${m}`;
//   };
//   const [checkInTime, setCheckInTime] = useState(getCurrentTime());
//   const [notes, setNotes] = useState('');

//   // Toggle multi-select service
//   const toggleService = (id: number) => {
//     if (selectedServiceIds.includes(id)) {
//       if (selectedServiceIds.length === 1) {
//         Alert.alert('Perhatian', 'Minimal pilih 1 layanan cukur');
//         return;
//       }
//       setSelectedServiceIds(selectedServiceIds.filter((sId) => sId !== id));
//     } else {
//       setSelectedServiceIds([...selectedServiceIds, id]);
//     }
//   };

//   // Calculations
//   const totalPrice = selectedServiceIds.reduce((sum, sId) => {
//     const srv = services.find((s) => s.id === sId);
//     return sum + (srv ? srv.price : 0);
//   }, 0);

//   const totalDuration = selectedServiceIds.reduce((sum, sId) => {
//     const srv = services.find((s) => s.id === sId);
//     return sum + (srv ? srv.duration : 0);
//   }, 0);

//   // Filtered customers for picker
//   const filteredCustomers = customers.filter(
//     (c) =>
//       c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
//       c.phone.includes(customerSearch)
//   );

//   const handleAddCustomer = () => {
//     if (!newCustName.trim() || !newCustPhone.trim()) {
//       Alert.alert('Perhatian', 'Nama dan No. HP pelanggan wajib diisi');
//       return;
//     }
//     const created: CustomerItem = {
//       id: Date.now(),
//       name: newCustName.trim(),
//       phone: newCustPhone.trim(),
//     };
//     setCustomers([created, ...customers]);
//     setSelectedCustomerId(created.id);
//     setNewCustName('');
//     setNewCustPhone('');
//     setShowAddCustomerModal(false);
//     Alert.alert('Sukses', `Pelanggan "${created.name}" berhasil ditambahkan!`);
//   };

//   const handleCheckInOrder = () => {
//     if (!selectedCustomerId) {
//       Alert.alert('Perhatian', 'Silakan pilih pelanggan terlebih dahulu');
//       return;
//     }
//     if (!selectedKapsterId) {
//       Alert.alert('Perhatian', 'Silakan pilih kapster yang bertugas');
//       return;
//     }
//     if (selectedServiceIds.length === 0) {
//       Alert.alert('Perhatian', 'Pilih minimal 1 jenis layanan');
//       return;
//     }

//     const selectedCust = customers.find((c) => c.id === selectedCustomerId);
//     const selectedKap = kapsters.find((k) => k.id === selectedKapsterId);

//     Alert.alert(
//       'Order Berhasil Dibuat! 🎉',
//       `Pelanggan: ${selectedCust?.name}\nKapster: ${selectedKap?.name}\nStatus: WAITING\nTotal: Rp ${totalPrice.toLocaleString('id-ID')}`,
//       [
//         {
//           text: 'Lihat Antrean',
//           onPress: () => {
//             // Reset form
//             setNotes('');
//             setCheckInTime(getCurrentTime());
//             navigation.navigate('OrdersTab');
//           },
//         },
//       ]
//     );
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

//       {/* Header */}
//       <View style={styles.header}>
//         <View>
//           <Text style={styles.headerSubtitle}>CHECK-IN KASIR</Text>
//           <Text style={styles.headerTitle}>Form Order Baru</Text>
//         </View>
//         <View style={styles.headerBadge}>
//           <Text style={styles.headerBadgeText}>STATUS: WAITING</Text>
//         </View>
//       </View>

//       <ScrollView contentContainerStyle={styles.scrollContent}>
//         {/* Section 1: Customer Selection */}
//         <View style={styles.sectionCard}>
//           <View style={styles.sectionHeaderRow}>
//             <Text style={styles.sectionTitle}>1. Pelanggan (Customer)</Text>
//             <TouchableOpacity
//               style={styles.addCustBtn}
//               onPress={() => setShowAddCustomerModal(true)}
//               activeOpacity={0.8}
//             >
//               <Text style={styles.addCustBtnText}>+ Quick Add Customer</Text>
//             </TouchableOpacity>
//           </View>

//           {/* Search customer input */}
//           <TextInput
//             style={styles.searchInput}
//             placeholder="Cari nama atau no. telepon..."
//             placeholderTextColor="#64748B"
//             value={customerSearch}
//             onChangeText={setCustomerSearch}
//           />

//           {/* Customer list horizontal selector */}
//           <ScrollView
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             contentContainerStyle={styles.customerChipsRow}
//           >
//             {filteredCustomers.map((cust) => {
//               const isSelected = selectedCustomerId === cust.id;
//               return (
//                 <TouchableOpacity
//                   key={cust.id}
//                   style={[styles.customerChip, isSelected && styles.customerChipActive]}
//                   onPress={() => setSelectedCustomerId(cust.id)}
//                   activeOpacity={0.75}
//                 >
//                   <View
//                     style={[
//                       styles.customerChipAvatar,
//                       isSelected && styles.customerChipAvatarActive,
//                     ]}
//                   >
//                     <Text style={styles.customerChipAvatarText}>{cust.name[0]}</Text>
//                   </View>
//                   <View>
//                     <Text
//                       style={[
//                         styles.customerChipName,
//                         isSelected && styles.customerChipNameActive,
//                       ]}
//                     >
//                       {cust.name}
//                     </Text>
//                     <Text style={styles.customerChipPhone}>{cust.phone}</Text>
//                   </View>
//                 </TouchableOpacity>
//               );
//             })}
//           </ScrollView>
//         </View>

//         {/* Section 2: Kapster Selection */}
//         <View style={styles.sectionCard}>
//           <Text style={styles.sectionTitle}>2. Pilih Kapster yang Bertugas</Text>
//           <View style={styles.kapsterGrid}>
//             {kapsters.map((kap) => {
//               const isSelected = selectedKapsterId === kap.id;
//               return (
//                 <TouchableOpacity
//                   key={kap.id}
//                   style={[styles.kapsterCard, isSelected && styles.kapsterCardActive]}
//                   onPress={() => setSelectedKapsterId(kap.id)}
//                   activeOpacity={0.8}
//                 >
//                   <View
//                     style={[
//                       styles.kapsterAvatar,
//                       isSelected && styles.kapsterAvatarActive,
//                     ]}
//                   >
//                     <Text style={styles.kapsterAvatarText}>{kap.name[0]}</Text>
//                   </View>
//                   <View style={styles.kapsterInfo}>
//                     <Text
//                       style={[
//                         styles.kapsterName,
//                         isSelected && styles.kapsterNameActive,
//                       ]}
//                     >
//                       {kap.name}
//                     </Text>
//                     <Text style={styles.kapsterRole}>{kap.role}</Text>
//                   </View>
//                   <View
//                     style={[
//                       styles.statusDot,
//                       { backgroundColor: kap.available ? '#10B981' : '#EF4444' },
//                     ]}
//                   />
//                 </TouchableOpacity>
//               );
//             })}
//           </View>
//         </View>

//         {/* Section 3: Services Multi-Select */}
//         <View style={styles.sectionCard}>
//           <View style={styles.sectionHeaderRow}>
//             <Text style={styles.sectionTitle}>3. Pilih Layanan (Multi-select)</Text>
//             <Text style={styles.serviceCountBadge}>
//               {selectedServiceIds.length} Layanan Terpilih
//             </Text>
//           </View>

//           <View style={styles.servicesList}>
//             {services.map((srv) => {
//               const isSelected = selectedServiceIds.includes(srv.id);
//               return (
//                 <TouchableOpacity
//                   key={srv.id}
//                   style={[styles.serviceItem, isSelected && styles.serviceItemActive]}
//                   onPress={() => toggleService(srv.id)}
//                   activeOpacity={0.8}
//                 >
//                   <View style={styles.checkboxContainer}>
//                     <View
//                       style={[
//                         styles.checkbox,
//                         isSelected && styles.checkboxChecked,
//                       ]}
//                     >
//                       {isSelected && <Text style={styles.checkboxCheckmark}>✓</Text>}
//                     </View>
//                   </View>
//                   <View style={styles.serviceItemInfo}>
//                     <Text
//                       style={[
//                         styles.serviceItemName,
//                         isSelected && styles.serviceItemNameActive,
//                       ]}
//                     >
//                       {srv.name}
//                     </Text>
//                     <Text style={styles.serviceItemDuration}>
//                       ⏱ Durasi: {srv.duration} menit
//                     </Text>
//                   </View>
//                   <Text style={styles.serviceItemPrice}>
//                     Rp {srv.price.toLocaleString('id-ID')}
//                   </Text>
//                 </TouchableOpacity>
//               );
//             })}
//           </View>
//         </View>

//         {/* Section 4: Waktu & Catatan */}
//         <View style={styles.sectionCard}>
//           <Text style={styles.sectionTitle}>4. Waktu Check-in & Catatan (Opsional)</Text>
//           <View style={styles.rowInputs}>
//             <View style={styles.timeInputGroup}>
//               <Text style={styles.inputLabel}>Jam Check-in</Text>
//               <TextInput
//                 style={styles.timeInput}
//                 value={checkInTime}
//                 onChangeText={setCheckInTime}
//                 placeholder="09:30"
//                 placeholderTextColor="#64748B"
//               />
//             </View>
//             <View style={styles.notesInputGroup}>
//               <Text style={styles.inputLabel}>Catatan / Request Gaya</Text>
//               <TextInput
//                 style={styles.notesInput}
//                 value={notes}
//                 onChangeText={setNotes}
//                 placeholder="Misal: Model Fade tipis..."
//                 placeholderTextColor="#64748B"
//               />
//             </View>
//           </View>
//         </View>

//         {/* Order Summary Box */}
//         <View style={styles.summaryBox}>
//           <View style={styles.summaryRow}>
//             <Text style={styles.summaryLabel}>Total Estimasi Durasi:</Text>
//             <Text style={styles.summaryValue}>{totalDuration} Menit</Text>
//           </View>
//           <View style={styles.summaryRow}>
//             <Text style={styles.summaryLabel}>Total Biaya:</Text>
//             <Text style={styles.summaryPrice}>
//               Rp {totalPrice.toLocaleString('id-ID')}
//             </Text>
//           </View>
//         </View>
//       </ScrollView>

//       {/* Bottom Floating Submit Button */}
//       <View style={styles.bottomBar}>
//         <TouchableOpacity
//           style={styles.submitButton}
//           onPress={handleCheckInOrder}
//           activeOpacity={0.85}
//         >
//           <Text style={styles.submitButtonText}>
//             Masuk Antrean (Rp {totalPrice.toLocaleString('id-ID')}) →
//           </Text>
//         </TouchableOpacity>
//       </View>

//       {/* Modal Quick Add Customer */}
//       <Modal
//         visible={showAddCustomerModal}
//         transparent
//         animationType="fade"
//         onRequestClose={() => setShowAddCustomerModal(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalCard}>
//             <Text style={styles.modalTitle}>+ Tambah Pelanggan Cepat</Text>
//             <Text style={styles.modalSubtitle}>
//               Data pelanggan baru akan langsung tersimpan dan dipilih.
//             </Text>

//             <View style={styles.modalInputGroup}>
//               <Text style={styles.inputLabel}>Nama Pelanggan *</Text>
//               <TextInput
//                 style={styles.modalInput}
//                 placeholder="Nama Lengkap..."
//                 placeholderTextColor="#64748B"
//                 value={newCustName}
//                 onChangeText={setNewCustName}
//                 autoFocus
//               />
//             </View>

//             <View style={styles.modalInputGroup}>
//               <Text style={styles.inputLabel}>Nomor WhatsApp / HP *</Text>
//               <TextInput
//                 style={styles.modalInput}
//                 placeholder="08123456789..."
//                 placeholderTextColor="#64748B"
//                 value={newCustPhone}
//                 onChangeText={setNewCustPhone}
//                 keyboardType="phone-pad"
//               />
//             </View>

//             <View style={styles.modalActions}>
//               <TouchableOpacity
//                 style={styles.modalCancelBtn}
//                 onPress={() => setShowAddCustomerModal(false)}
//               >
//                 <Text style={styles.modalCancelBtnText}>Batal</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={styles.modalSaveBtn}
//                 onPress={handleAddCustomer}
//               >
//                 <Text style={styles.modalSaveBtnText}>Simpan & Pilih</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#0F172A',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     paddingTop: 16,
//     paddingBottom: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#1E293B',
//   },
//   headerSubtitle: {
//     color: '#38BDF8',
//     fontSize: 11,
//     fontWeight: '700',
//     letterSpacing: 1.2,
//   },
//   headerTitle: {
//     color: '#F8FAFC',
//     fontSize: 22,
//     fontWeight: '800',
//     marginTop: 2,
//   },
//   headerBadge: {
//     backgroundColor: '#FEF3C7',
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     borderRadius: 6,
//   },
//   headerBadgeText: {
//     color: '#92400E',
//     fontSize: 11,
//     fontWeight: '800',
//   },
//   scrollContent: {
//     padding: 16,
//     gap: 16,
//     paddingBottom: 100,
//   },
//   sectionCard: {
//     backgroundColor: '#1E293B',
//     borderRadius: 12,
//     padding: 16,
//     borderWidth: 1,
//     borderColor: '#334155',
//   },
//   sectionHeaderRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   sectionTitle: {
//     color: '#F8FAFC',
//     fontSize: 15,
//     fontWeight: '700',
//   },
//   addCustBtn: {
//     backgroundColor: '#2563EB',
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     borderRadius: 6,
//   },
//   addCustBtnText: {
//     color: '#FFFFFF',
//     fontSize: 12,
//     fontWeight: '700',
//   },
//   searchInput: {
//     backgroundColor: '#0F172A',
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#334155',
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     color: '#F8FAFC',
//     fontSize: 13,
//     marginBottom: 12,
//   },
//   customerChipsRow: {
//     gap: 10,
//   },
//   customerChip: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#0F172A',
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 10,
//     borderWidth: 1.5,
//     borderColor: '#334155',
//     gap: 10,
//   },
//   customerChipActive: {
//     borderColor: '#38BDF8',
//     backgroundColor: '#0C4A6E',
//   },
//   customerChipAvatar: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     backgroundColor: '#334155',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   customerChipAvatarActive: {
//     backgroundColor: '#0284C7',
//   },
//   customerChipAvatarText: {
//     color: '#FFFFFF',
//     fontWeight: '700',
//     fontSize: 14,
//   },
//   customerChipName: {
//     color: '#CBD5E1',
//     fontWeight: '600',
//     fontSize: 13,
//   },
//   customerChipNameActive: {
//     color: '#FFFFFF',
//     fontWeight: '700',
//   },
//   customerChipPhone: {
//     color: '#64748B',
//     fontSize: 11,
//   },
//   kapsterGrid: {
//     gap: 10,
//     marginTop: 12,
//   },
//   kapsterCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#0F172A',
//     padding: 12,
//     borderRadius: 10,
//     borderWidth: 1.5,
//     borderColor: '#334155',
//   },
//   kapsterCardActive: {
//     borderColor: '#38BDF8',
//     backgroundColor: '#0C4A6E',
//   },
//   kapsterAvatar: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     backgroundColor: '#334155',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginRight: 12,
//   },
//   kapsterAvatarActive: {
//     backgroundColor: '#0284C7',
//   },
//   kapsterAvatarText: {
//     color: '#FFFFFF',
//     fontSize: 15,
//     fontWeight: '700',
//   },
//   kapsterInfo: {
//     flex: 1,
//   },
//   kapsterName: {
//     color: '#CBD5E1',
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   kapsterNameActive: {
//     color: '#FFFFFF',
//     fontWeight: '700',
//   },
//   kapsterRole: {
//     color: '#64748B',
//     fontSize: 11,
//     marginTop: 1,
//   },
//   statusDot: {
//     width: 10,
//     height: 10,
//     borderRadius: 5,
//   },
//   serviceCountBadge: {
//     color: '#10B981',
//     fontSize: 12,
//     fontWeight: '700',
//   },
//   servicesList: {
//     gap: 8,
//   },
//   serviceItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#0F172A',
//     padding: 12,
//     borderRadius: 10,
//     borderWidth: 1.5,
//     borderColor: '#334155',
//   },
//   serviceItemActive: {
//     borderColor: '#10B981',
//     backgroundColor: '#064E3B',
//   },
//   checkboxContainer: {
//     marginRight: 12,
//   },
//   checkbox: {
//     width: 22,
//     height: 22,
//     borderRadius: 6,
//     borderWidth: 2,
//     borderColor: '#64748B',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   checkboxChecked: {
//     backgroundColor: '#10B981',
//     borderColor: '#10B981',
//   },
//   checkboxCheckmark: {
//     color: '#FFFFFF',
//     fontWeight: '800',
//     fontSize: 13,
//   },
//   serviceItemInfo: {
//     flex: 1,
//   },
//   serviceItemName: {
//     color: '#CBD5E1',
//     fontSize: 13,
//     fontWeight: '600',
//   },
//   serviceItemNameActive: {
//     color: '#FFFFFF',
//     fontWeight: '700',
//   },
//   serviceItemDuration: {
//     color: '#64748B',
//     fontSize: 11,
//     marginTop: 2,
//   },
//   serviceItemPrice: {
//     color: '#10B981',
//     fontSize: 13,
//     fontWeight: '700',
//   },
//   rowInputs: {
//     flexDirection: 'row',
//     gap: 10,
//     marginTop: 10,
//   },
//   timeInputGroup: {
//     width: 100,
//   },
//   notesInputGroup: {
//     flex: 1,
//   },
//   inputLabel: {
//     color: '#94A3B8',
//     fontSize: 12,
//     fontWeight: '600',
//     marginBottom: 6,
//   },
//   timeInput: {
//     backgroundColor: '#0F172A',
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#334155',
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     color: '#F8FAFC',
//     fontSize: 13,
//     textAlign: 'center',
//   },
//   notesInput: {
//     backgroundColor: '#0F172A',
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#334155',
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     color: '#F8FAFC',
//     fontSize: 13,
//   },
//   summaryBox: {
//     backgroundColor: '#1E293B',
//     borderRadius: 12,
//     padding: 16,
//     borderWidth: 1,
//     borderColor: '#334155',
//     gap: 8,
//   },
//   summaryRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   summaryLabel: {
//     color: '#94A3B8',
//     fontSize: 13,
//   },
//   summaryValue: {
//     color: '#F8FAFC',
//     fontSize: 13,
//     fontWeight: '600',
//   },
//   summaryPrice: {
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
//   submitButton: {
//     backgroundColor: '#10B981',
//     paddingVertical: 14,
//     borderRadius: 10,
//     alignItems: 'center',
//   },
//   submitButtonText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '700',
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.7)',
//     justifyContent: 'center',
//     padding: 20,
//   },
//   modalCard: {
//     backgroundColor: '#1E293B',
//     borderRadius: 16,
//     padding: 20,
//     borderWidth: 1,
//     borderColor: '#334155',
//     gap: 14,
//   },
//   modalTitle: {
//     color: '#F8FAFC',
//     fontSize: 18,
//     fontWeight: '700',
//   },
//   modalSubtitle: {
//     color: '#94A3B8',
//     fontSize: 12,
//     marginTop: -8,
//   },
//   modalInputGroup: {
//     gap: 6,
//   },
//   modalInput: {
//     backgroundColor: '#0F172A',
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#334155',
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     color: '#F8FAFC',
//     fontSize: 14,
//   },
//   modalActions: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//     gap: 10,
//     marginTop: 8,
//   },
//   modalCancelBtn: {
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//     borderRadius: 8,
//     backgroundColor: '#334155',
//   },
//   modalCancelBtnText: {
//     color: '#CBD5E1',
//     fontWeight: '600',
//   },
//   modalSaveBtn: {
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//     borderRadius: 8,
//     backgroundColor: '#2563EB',
//   },
//   modalSaveBtnText: {
//     color: '#FFFFFF',
//     fontWeight: '700',
//   },
// });
