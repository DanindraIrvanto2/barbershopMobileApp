import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Image,
  Alert,
} from 'react-native';
import type { OrdersScreenProps } from '../types/navigation';
import type { QuickFilterTab } from '../types/order';
import { useAuth } from '../context/AuthContext';

export default function OrdersScreen({ navigation }: OrdersScreenProps) {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<QuickFilterTab>('ALL');

  const handleLogout = () => {
    Alert.alert('Konfirmasi Logout', 'Apakah Anda yakin ingin keluar dari akun kasir?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          logout();
          navigation.replace('Login');
        },
      },
    ]);
  };

  // Sample order data
  const sampleOrders = [
    {
      id: 1,
      code: '#ORD-001',
      customerName: 'Budi Santoso',
      kapsterName: 'Wildan',
      serviceName: 'Haircut',
      time: '09:25',
      status: 'WAITING',
      price: 'Rp 35.000',
    },
    {
      id: 2,
      code: '#ORD-002',
      customerName: 'Andi Pratama',
      kapsterName: 'Papang',
      serviceName: 'Haircut & Coloring',
      time: '09:12',
      status: 'WAITING',
      price: 'Rp 285.000',
    },
    {
      id: 3,
      code: '#ORD-003',
      customerName: 'Fajar Nugroho',
      kapsterName: 'Papang',
      serviceName: 'Twoblock Haircut',
      time: '08:55',
      status: 'IN_SERVICE',
      price: 'Rp 35.000',
    },
    {
      id: 4,
      code: '#ORD-004',
      customerName: 'Yahya',
      kapsterName: 'Wildan',
      serviceName: 'Coloring Hitam Alami',
      time: '08:45',
      status: 'COMPLETED',
      price: 'Rp 80.000',
    },
  ];

  const filteredOrders = sampleOrders.filter((item) => {
    if (activeTab === 'ALL') return true;
    return item.status === activeTab;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'WAITING':
        return { bg: '#FEF3C7', text: '#92400E', label: 'Waiting' };
      case 'IN_SERVICE':
        return { bg: '#DBEAFE', text: '#1E40AF', label: 'In Service' };
      case 'COMPLETED':
        return { bg: '#D1FAE5', text: '#065F46', label: 'Completed' };
      default:
        return { bg: '#F1F5F9', text: '#475569', label: status };
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Brand & Cashier Header */}
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <View style={styles.logoWrapper}>
            <Image
              source={require('../../assets/logo.png')}
              style={styles.logoImage}
              resizeMode="cover"
            />
          </View>
          <View>
            <Text style={styles.brandTitle}>Hairdept Barbershop.</Text>
            <Text style={styles.cashierBadge}>
              Kasir: {user?.username || 'Admin'}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
          activeOpacity={0.75}
        >
          <Text style={styles.logoutBtnText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Title & Action Bar */}
      <View style={styles.titleBar}>
        <View>
          <Text style={styles.pageTitle}>Orders / Antrean</Text>
          <Text style={styles.pageSubtitle}>Pantau status antrean pelanggan aktif</Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabContainer}>
        {(['ALL', 'WAITING', 'IN_SERVICE', 'COMPLETED'] as QuickFilterTab[]).map((tab) => {
          const isActive = activeTab === tab;
          const label =
            tab === 'ALL'
              ? 'All'
              : tab === 'WAITING'
              ? 'Waiting'
              : tab === 'IN_SERVICE'
              ? 'In Service'
              : 'Completed';
          return (
            <TouchableOpacity
              key={tab}
              style={[styles.tabButton, isActive && styles.tabButtonActive]}
              onPress={() => setActiveTab(tab)}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabButtonText, isActive && styles.tabButtonTextActive]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Orders List */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {filteredOrders.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyTitle}>Tidak ada antrean</Text>
            <Text style={styles.emptySub}>
              Belum ada pesanan pada status {activeTab}.
            </Text>
          </View>
        ) : (
          <View style={styles.listWrapper}>
            <Text style={styles.sectionHeader}>
              Daftar Antrean Aktif ({filteredOrders.length})
            </Text>
            {filteredOrders.map((ord) => {
              const badge = getStatusBadge(ord.status);
              return (
                <View key={ord.id} style={styles.orderCard}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.orderCode}>{ord.code}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
                      <Text style={[styles.statusBadgeText, { color: badge.text }]}>
                        {badge.label}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.cardBody}>
                    <Text style={styles.customerName}>{ord.customerName}</Text>
                    <Text style={styles.serviceText}>
                      {ord.serviceName} • Kapster: {ord.kapsterName}
                    </Text>
                    <View style={styles.cardFooter}>
                      <Text style={styles.timeText}>Check-in: {ord.time} WIB</Text>
                      <Text style={styles.priceText}>{ord.price}</Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoWrapper: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  brandTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  cashierBadge: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2563EB',
  },
  logoutBtn: {
    backgroundColor: '#FEE2E2',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  logoutBtnText: {
    color: '#DC2626',
    fontWeight: '700',
    fontSize: 12,
  },
  titleBar: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  pageSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    gap: 8,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  tabButtonActive: {
    backgroundColor: '#000000',
  },
  tabButtonText: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '600',
  },
  tabButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionHeader: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  listWrapper: {
    gap: 10,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  orderCode: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '700',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  cardBody: {
    gap: 3,
  },
  customerName: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '700',
  },
  serviceText: {
    color: '#475569',
    fontSize: 13,
    marginTop: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  timeText: {
    color: '#94A3B8',
    fontSize: 12,
  },
  priceText: {
    color: '#059669',
    fontSize: 14,
    fontWeight: '800',
  },
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  emptyTitle: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '700',
  },
  emptySub: {
    color: '#94A3B8',
    fontSize: 13,
    marginTop: 4,
  },
});
