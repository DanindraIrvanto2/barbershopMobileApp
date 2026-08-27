import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Platform,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { customerService, type Customer } from '../api/customerService';

export default function CustomerScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Create Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    phone: '',
  });

  // Edit Modal state
  const [editCustomerModal, setEditCustomerModal] = useState<Customer | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
  });

  // Fetch Customers Data
  const fetchCustomers = useCallback(async () => {
    try {
      const data = await customerService.getCustomers();
      setCustomers(data || []);
    } catch (error) {
      console.log('Error loading customers:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchCustomers();
  };

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setCreateForm({ name: '', phone: '' });
    setShowCreateModal(true);
  };

  // Submit Create Customer
  const handleCreateCustomer = async () => {
    if (!createForm.name.trim()) {
      Alert.alert('Peringatan', 'Silakan masukkan nama customer.');
      return;
    }
    if (!createForm.phone.trim()) {
      Alert.alert('Peringatan', 'Silakan masukkan nomor telepon customer.');
      return;
    }

    setCreateLoading(true);
    try {
      await customerService.createCustomer({
        name: createForm.name.trim(),
        phone: createForm.phone.trim(),
      });

      setShowCreateModal(false);
      Alert.alert('Berhasil', 'Customer baru berhasil ditambahkan!');
      fetchCustomers();
    } catch (error: any) {
      console.log('Error creating customer:', error);
      Alert.alert('Gagal', error.response?.data?.error || 'Gagal menambahkan customer.');
    } finally {
      setCreateLoading(false);
    }
  };

  // Open Edit Modal
  const handleOpenEditModal = (cust: Customer) => {
    setEditCustomerModal(cust);
    setEditForm({
      name: cust.name || '',
      phone: cust.phone || '',
    });
  };

  // Submit Edit Customer
  const handleUpdateCustomer = async () => {
    if (!editCustomerModal) return;
    if (!editForm.name.trim()) {
      Alert.alert('Peringatan', 'Nama customer tidak boleh kosong.');
      return;
    }
    if (!editForm.phone.trim()) {
      Alert.alert('Peringatan', 'Nomor telepon tidak boleh kosong.');
      return;
    }

    setEditLoading(true);
    try {
      await customerService.updateCustomer(editCustomerModal.id, {
        name: editForm.name.trim(),
        phone: editForm.phone.trim(),
      });

      setEditCustomerModal(null);
      Alert.alert('Berhasil', 'Data customer berhasil diperbarui!');
      fetchCustomers();
    } catch (error: any) {
      console.log('Error updating customer:', error);
      Alert.alert('Gagal', error.response?.data?.error || 'Gagal memperbarui customer.');
    } finally {
      setEditLoading(false);
    }
  };

  // Delete Customer
  const handleDeleteCustomer = (cust: Customer) => {
    Alert.alert(
      'Hapus Customer',
      `Apakah Anda yakin ingin menghapus data "${cust.name}"?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              await customerService.deleteCustomer(cust.id);
              Alert.alert('Sukses', 'Data customer berhasil dihapus.');
              fetchCustomers();
            } catch (error: any) {
              console.log('Error deleting customer:', error);
              Alert.alert('Gagal', 'Gagal menghapus data customer.');
            }
          },
        },
      ]
    );
  };

  // Format date helper
  const formatDate = (rawDate?: string) => {
    if (!rawDate) return 'Baru saja';
    return new Date(rawDate).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // Filtered customers by search query
  const filteredCustomers = customers.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const name = (c.name || '').toLowerCase();
    const phone = (c.phone || '').toLowerCase();
    const idStr = `#${String(c.id).padStart(3, '0')}`.toLowerCase();
    return name.includes(q) || phone.includes(q) || idStr.includes(q);
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAFA" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Page Header */}
        <View style={styles.headerSection}>
          <View style={styles.headerTitleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.mainTitle}>Customers</Text>
              <Text style={styles.subTitle}>
                Manage registered barbershop customers and contact information.
              </Text>
            </View>

            {/* + New Customer Button */}
            <TouchableOpacity
              style={styles.newCustomerBtn}
              onPress={handleOpenCreateModal}
              activeOpacity={0.85}
            >
              <Text style={styles.newCustomerBtnPlus}>+</Text>
              <Text style={styles.newCustomerBtnText}>NEW CUSTOMER</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar & Counter */}
        <View style={styles.searchSection}>
          <View style={styles.searchBox}>
            <Ionicons name="search-outline" size={18} color="#94A3B8" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search customers by name or phone..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color="#94A3B8" />
              </TouchableOpacity>
            ) : null}
          </View>

          <View style={styles.counterRow}>
            <Text style={styles.counterText}>
              Total: <Text style={styles.counterNumber}>{filteredCustomers.length}</Text> customers
            </Text>
          </View>
        </View>

        {/* Customer Cards List */}
        <View style={styles.listSection}>
          {loading ? (
            <ActivityIndicator
              size="small"
              color="#0F172A"
              style={styles.loadingIndicator}
            />
          ) : filteredCustomers.length === 0 ? (
            <View style={styles.emptyCard}>
              <Ionicons name="people-outline" size={36} color="#CBD5E1" />
              <Text style={styles.emptyTitle}>No customers found</Text>
              <Text style={styles.emptySubtext}>
                {searchQuery
                  ? 'No customers match your search keyword.'
                  : 'Start by adding your first barbershop customer!'}
              </Text>
            </View>
          ) : (
            <View style={styles.customerListVertical}>
              {filteredCustomers.map((cust) => {
                const idCode = `#${String(cust.id).padStart(3, '0')}`;
                const regDate = formatDate(cust.created_at || cust.createdAt);

                return (
                  <View key={cust.id} style={styles.customerCard}>
                    {/* Top Row: ID Badge & Reg Date */}
                    <View style={styles.cardTopRow}>
                      <View style={styles.idBadge}>
                        <Text style={styles.idBadgeText}>{idCode}</Text>
                      </View>

                      <View style={styles.dateBadge}>
                        <Ionicons name="calendar-outline" size={13} color="#94A3B8" />
                        <Text style={styles.dateText}>{regDate}</Text>
                      </View>
                    </View>

                    {/* Middle: Customer Name & Phone */}
                    <View style={styles.customerMainInfo}>
                      <Text style={styles.customerName}>{cust.name}</Text>
                      <View style={styles.phoneRow}>
                        <Ionicons name="call-outline" size={13} color="#64748B" />
                        <Text style={styles.phoneText}>{cust.phone || '-'}</Text>
                      </View>
                    </View>

                    {/* Bottom Row: Actions (Edit & Delete) */}
                    <View style={styles.cardFooterRow}>
                      <View style={styles.clientTag}>
                        <Ionicons name="person-circle-outline" size={14} color="#64748B" />
                        <Text style={styles.clientTagText}>Verified Client</Text>
                      </View>

                      <View style={styles.actionButtonsRow}>
                        {/* Edit Button */}
                        <TouchableOpacity
                          style={styles.editBtn}
                          onPress={() => handleOpenEditModal(cust)}
                          activeOpacity={0.7}
                        >
                          <Ionicons name="create-outline" size={16} color="#1E293B" />
                        </TouchableOpacity>

                        {/* Delete Button */}
                        <TouchableOpacity
                          style={styles.deleteBtn}
                          onPress={() => handleDeleteCustomer(cust)}
                          activeOpacity={0.7}
                        >
                          <Ionicons name="trash-outline" size={16} color="#DC2626" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>

      {/* ======================================================== */}
      {/* MODAL: CREATE NEW CUSTOMER */}
      {/* ======================================================== */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>New Customer Registration</Text>
                <Text style={styles.modalSubtitle}>
                  Add customer name and contact phone number
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowCreateModal(false)}
                style={styles.modalCloseBtn}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalFormBody}>
              {/* Customer Name */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Customer Name *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. Rizky Febian"
                  placeholderTextColor="#94A3B8"
                  value={createForm.name}
                  onChangeText={(text) =>
                    setCreateForm({ ...createForm, name: text })
                  }
                  autoCapitalize="words"
                />
              </View>

              {/* Phone Number */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Phone Number *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. 081299887700"
                  placeholderTextColor="#94A3B8"
                  value={createForm.phone}
                  onChangeText={(text) =>
                    setCreateForm({ ...createForm, phone: text })
                  }
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            {/* Modal Actions */}
            <View style={styles.modalActionRow}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setShowCreateModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modalSubmitBtn,
                  createLoading && styles.modalSubmitBtnDisabled,
                ]}
                onPress={handleCreateCustomer}
                disabled={createLoading}
              >
                {createLoading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.modalSubmitText}>Save Customer</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ======================================================== */}
      {/* MODAL: EDIT CUSTOMER */}
      {/* ======================================================== */}
      <Modal
        visible={!!editCustomerModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setEditCustomerModal(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Edit Customer Profile</Text>
                <Text style={styles.modalSubtitle}>
                  Update contact information for #{String(editCustomerModal?.id || 0).padStart(3, '0')}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setEditCustomerModal(null)}
                style={styles.modalCloseBtn}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalFormBody}>
              {/* Customer Name */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Customer Name *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Customer Name"
                  placeholderTextColor="#94A3B8"
                  value={editForm.name}
                  onChangeText={(text) =>
                    setEditForm({ ...editForm, name: text })
                  }
                  autoCapitalize="words"
                />
              </View>

              {/* Phone Number */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Phone Number *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Phone Number"
                  placeholderTextColor="#94A3B8"
                  value={editForm.phone}
                  onChangeText={(text) =>
                    setEditForm({ ...editForm, phone: text })
                  }
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            {/* Modal Actions */}
            <View style={styles.modalActionRow}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setEditCustomerModal(null)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modalSubmitBtn,
                  editLoading && styles.modalSubmitBtnDisabled,
                ]}
                onPress={handleUpdateCustomer}
                disabled={editLoading}
              >
                {editLoading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.modalSubmitText}>Save Changes</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollContent: {
    paddingVertical: 18,
  },
  headerSection: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  headerTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#1A1C1C',
    letterSpacing: -0.6,
  },
  subTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
  },
  newCustomerBtn: {
    backgroundColor: '#000000',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  newCustomerBtnPlus: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    lineHeight: 18,
  },
  newCustomerBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  searchSection: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 10 : 6,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '500',
  },
  counterRow: {
    marginTop: 8,
    paddingHorizontal: 2,
  },
  counterText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  counterNumber: {
    fontWeight: '800',
    color: '#0F172A',
  },
  listSection: {
    paddingHorizontal: 20,
  },
  loadingIndicator: {
    paddingVertical: 40,
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E2E2',
    padding: 36,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E293B',
  },
  emptySubtext: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
  },
  customerListVertical: {
    gap: 12,
  },
  customerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E2E2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
    gap: 10,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  idBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  idBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#475569',
  },
  dateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
  },
  customerMainInfo: {
    gap: 4,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A1C1C',
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  phoneText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  cardFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  clientTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  clientTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  editBtn: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtn: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FECACA',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },
  modalCloseBtn: {
    padding: 6,
  },
  modalCloseText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#64748B',
  },
  modalFormBody: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 14,
  },
  formGroup: {
    gap: 6,
  },
  formLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1E293B',
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
  },
  modalActionRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 12,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  modalCancelBtn: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  modalSubmitBtn: {
    flex: 2,
    backgroundColor: '#000000',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSubmitBtnDisabled: {
    opacity: 0.6,
  },
  modalSubmitText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
