import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import type { OrdersScreenProps } from '../types/navigation';
import type { QuickFilterTab } from '../types/order';

import { useAuth } from '../context/AuthContext';

export default function OrdersScreen({ navigation }: OrdersScreenProps) {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<QuickFilterTab>('ALL');

  const handleLogout = () => {
    logout();
    navigation.replace('Login');
  };

  // Placeholder sample items to allow testing the Order Detail flow easily
  const sampleOrders = [
    {
      id: 101,
      code: '#ORD-101',
      customerName: 'Ahmad Faiz',
      kapsterName: 'Budi (Senior)',
      serviceName: 'Haircut + Styling',
      time: '09:30',
      status: 'WAITING',
      price: 'Rp 50.000',
    },
    {
      id: 102,
      code: '#ORD-102',
      customerName: 'Dimas Pratama',
      kapsterName: 'Rian (Barber)',
      serviceName: 'Haircut + Shaving',
      time: '10:00',
      status: 'IN_SERVICE',
      price: 'Rp 75.000',
    },
    {
      id: 103,
      code: '#ORD-103',
      customerName: 'Reza Rahardian',
      kapsterName: 'Budi (Senior)',
      serviceName: 'Premium Cut & Wash',
      time: '10:15',
      status: 'COMPLETED',
      price: 'Rp 90.000',
    },
  ];

  const filteredOrders = sampleOrders.filter((item) => {
    if (activeTab === 'ALL') return true;
    return item.status === activeTab;
  });

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'WAITING':
        return { bg: '#FEF3C7', text: '#92400E', label: 'Waiting' };
      case 'IN_SERVICE':
        return { bg: '#DBEAFE', text: '#1E40AF', label: 'In Service' };
      case 'COMPLETED':
        return { bg: '#D1FAE5', text: '#065F46', label: 'Completed' };
      default:
        return { bg: '#F3F4F6', text: '#374151', label: status };
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.appSubtitle}>
            {user?.username ? `KASIR: ${user.username.toUpperCase()}` : 'HAIRDEPT CASHIER'}
          </Text>
          <Text style={styles.appTitle}>Orders / Antrean</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.logoutHeaderBtn}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <Text style={styles.logoutHeaderBtnText}>Logout</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.newOrderHeaderBtn}
            onPress={() => navigation.navigate('CustomerSelection')}
            activeOpacity={0.8}
          >
            <Text style={styles.newOrderHeaderBtnText}>+ NEW ORDER</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Quick Filter Tabs */}
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

      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {filteredOrders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No orders yet</Text>
            <Text style={styles.emptySubtext}>
              Belum ada antrean untuk status ini. Tekan tombol di bawah untuk membuat order baru.
            </Text>
          </View>
        ) : (
          <View style={styles.listContainer}>
            <Text style={styles.sectionHeader}>Antrean Aktif ({filteredOrders.length})</Text>
            {filteredOrders.map((ord) => {
              const badge = getStatusBadgeStyle(ord.status);
              return (
                <TouchableOpacity
                  key={ord.id}
                  style={styles.orderCard}
                  onPress={() =>
                    navigation.navigate('OrderDetail', {
                      orderId: ord.id,
                      customerName: ord.customerName,
                      status: ord.status,
                    })
                  }
                  activeOpacity={0.75}
                >
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
                    <Text style={styles.serviceDetail}>
                      {ord.serviceName} • {ord.kapsterName}
                    </Text>
                    <View style={styles.cardFooter}>
                      <Text style={styles.orderTime}>Check-in: {ord.time}</Text>
                      <Text style={styles.orderPrice}>{ord.price}</Text>
                    </View>
                  </View>

                  <View style={styles.cardActionHint}>
                    <Text style={styles.cardActionHintText}>Tap untuk lihat detail & bayar →</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Bottom Floating Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.primaryActionButton}
          onPress={() => navigation.navigate('CustomerSelection')}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryActionButtonText}>+ NEW ORDER</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  appSubtitle: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  appTitle: {
    color: '#F8FAFC',
    fontSize: 22,
    fontWeight: '800',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoutHeaderBtn: {
    backgroundColor: '#334155',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#475569',
  },
  logoutHeaderBtnText: {
    color: '#94A3B8',
    fontWeight: '700',
    fontSize: 12,
  },
  newOrderHeaderBtn: {
    backgroundColor: '#3B82F6',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  newOrderHeaderBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1E293B',
    gap: 8,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
    backgroundColor: '#334155',
  },
  tabButtonActive: {
    backgroundColor: '#3B82F6',
  },
  tabButtonText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  tabButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptySubtext: {
    color: '#64748B',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  sectionHeader: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  listContainer: {
    gap: 12,
  },
  orderCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderCode: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '700',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  cardBody: {
    gap: 4,
  },
  customerName: {
    color: '#F8FAFC',
    fontSize: 17,
    fontWeight: '700',
  },
  serviceDetail: {
    color: '#CBD5E1',
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
    borderTopColor: '#334155',
  },
  orderTime: {
    color: '#64748B',
    fontSize: 12,
  },
  orderPrice: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: '700',
  },
  cardActionHint: {
    marginTop: 8,
    alignItems: 'flex-end',
  },
  cardActionHintText: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '600',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#0F172A',
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
  },
  primaryActionButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryActionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
