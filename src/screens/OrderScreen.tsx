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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  getOrdersData,
  getCustomerData,
  getKapsterData,
} from '../api/homeService';

export default function OrderScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [orders, setOrders] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [kapsters, setKapsters] = useState<any[]>([]);

  // Filter & Search states
  const [activeTab, setActiveTab] = useState<string>('ALL'); // 'ALL' | 'WAITING' | 'IN_SERVICE' | 'UNPAID' | 'PAID'
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchOrdersData = useCallback(async () => {
    try {
      const [ordersRes, customersRes, kapstersRes] = await Promise.allSettled([
        getOrdersData(),
        getCustomerData(),
        getKapsterData(),
      ]);

      if (ordersRes.status === 'fulfilled') setOrders(ordersRes.value || []);
      if (customersRes.status === 'fulfilled') setCustomers(customersRes.value || []);
      if (kapstersRes.status === 'fulfilled') setKapsters(kapstersRes.value || []);
    } catch (error) {
      console.log('Error loading orders:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchOrdersData();
  }, [fetchOrdersData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrdersData();
  };

  // Helper resolvers
  const getCustomerName = (id: number) => {
    const cust = customers.find((c) => c.id === id);
    return cust ? cust.name : `Customer #${id}`;
  };

  const getKapsterName = (id: number) => {
    const kap = kapsters.find((k) => k.id === id);
    return kap ? kap.name : `Kapster #${id}`;
  };

  // 1. Calculate 4 Status Counter Cards
  const waitingCount = orders.filter(
    (o) => (o.serviceStatus || o.service_status || '').toLowerCase() === 'waiting'
  ).length;

  const inServiceCount = orders.filter(
    (o) => (o.serviceStatus || o.service_status || '').toLowerCase() === 'in_service'
  ).length;

  const completedUnpaidCount = orders.filter((o) => {
    const serviceStatus = (o.serviceStatus || o.service_status || '').toLowerCase();
    const paymentStatus = (o.paymentStatus || o.payment_status || '').toLowerCase();
    return serviceStatus === 'completed' && paymentStatus === 'unpaid';
  }).length;

  const completedPaidCount = orders.filter((o) => {
    const serviceStatus = (o.serviceStatus || o.service_status || '').toLowerCase();
    const paymentStatus = (o.paymentStatus || o.payment_status || '').toLowerCase();
    return serviceStatus === 'completed' && paymentStatus === 'paid';
  }).length;

  // 4 Status Cards Configuration
  const statusCards = [
    {
      id: 'WAITING',
      title: 'WAITING',
      count: waitingCount,
      icon: 'people-outline' as const,
    },
    {
      id: 'IN_SERVICE',
      title: 'IN SERVICE',
      count: inServiceCount,
      icon: 'cut-outline' as const,
    },
    {
      id: 'UNPAID',
      title: 'COMPLETED (UNPAID)',
      count: completedUnpaidCount,
      icon: 'receipt-outline' as const,
    },
    {
      id: 'PAID',
      title: 'COMPLETED (PAID)',
      count: completedPaidCount,
      icon: 'cash-outline' as const,
    },
  ];

  // 2. Filter & Search Order List
  const filteredOrders = orders.filter((ord) => {
    const serviceStatus = (ord.serviceStatus || ord.service_status || '').toLowerCase();
    const paymentStatus = (ord.paymentStatus || ord.payment_status || '').toLowerCase();

    // Filter by selected tab / status card
    if (activeTab === 'WAITING' && serviceStatus !== 'waiting') return false;
    if (activeTab === 'IN_SERVICE' && serviceStatus !== 'in_service') return false;
    if (activeTab === 'UNPAID' && !(serviceStatus === 'completed' && paymentStatus === 'unpaid'))
      return false;
    if (activeTab === 'PAID' && !(serviceStatus === 'completed' && paymentStatus === 'paid'))
      return false;

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const custName = (ord.customer_name || ord.customerName || getCustomerName(ord.customerId || ord.customer_id)).toLowerCase();
      const kapName = (ord.kapster_name || ord.kapsterName || getKapsterName(ord.kapsterId || ord.kapster_id)).toLowerCase();
      const orderCode = `#ord-${String(ord.id).padStart(3, '0')}`.toLowerCase();
      const notes = (ord.notes || '').toLowerCase();

      return (
        custName.includes(q) ||
        kapName.includes(q) ||
        orderCode.includes(q) ||
        notes.includes(q)
      );
    }

    return true;
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
          <Text style={styles.mainTitle}>Orders</Text>
          <Text style={styles.subTitle}>
            Review and manage recent appointments and transactions.
          </Text>
        </View>

        {/* 4 Status Counter Cards (Horizontal Scroll) */}
        <View style={styles.cardsSection}>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {statusCards.map((card) => {
              const isSelected = activeTab === card.id;
              return (
                <TouchableOpacity
                  key={card.id}
                  style={[
                    styles.statusCard,
                    isSelected && styles.statusCardActive,
                  ]}
                  onPress={() => {
                    setActiveTab(isSelected ? 'ALL' : card.id);
                  }}
                  activeOpacity={0.8}
                >
                  <View style={styles.iconBox}>
                    <Ionicons name={card.icon} size={22} color="#1E293B" />
                  </View>
                  <View style={styles.cardTextBox}>
                    <Text style={styles.cardTitle}>{card.title}</Text>
                    <Text style={styles.cardCount}>
                      {loading ? '0' : card.count}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View style={styles.searchBox}>
            <Ionicons name="search-outline" size={18} color="#94A3B8" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search order, customer, or kapster..."
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
        </View>

        {/* Orders List Section */}
        <View style={styles.listSection}>
          <View style={styles.listHeaderRow}>
            <Text style={styles.listHeaderTitle}>
              {activeTab === 'ALL'
                ? 'All Orders'
                : `Orders (${activeTab.replace('_', ' ')})`}
            </Text>
            {activeTab !== 'ALL' && (
              <TouchableOpacity onPress={() => setActiveTab('ALL')}>
                <Text style={styles.resetFilterText}>Show All</Text>
              </TouchableOpacity>
            )}
          </View>

          {loading ? (
            <ActivityIndicator
              size="small"
              color="#0F172A"
              style={styles.loadingIndicator}
            />
          ) : filteredOrders.length === 0 ? (
            <View style={styles.emptyCard}>
              <Ionicons name="clipboard-outline" size={32} color="#CBD5E1" />
              <Text style={styles.emptyTitle}>No orders found</Text>
              <Text style={styles.emptySubtext}>
                No orders match your filter criteria.
              </Text>
            </View>
          ) : (
            <View style={styles.ordersListVertical}>
              {filteredOrders.map((ord, idx) => {
                const customerName =
                  ord.customer_name ||
                  ord.customerName ||
                  getCustomerName(ord.customer_id || ord.customerId);
                const kapsterName =
                  ord.kapster_name ||
                  ord.kapsterName ||
                  getKapsterName(ord.kapster_id || ord.kapsterId);
                const serviceStatus = (
                  ord.serviceStatus ||
                  ord.service_status ||
                  'waiting'
                ).toLowerCase();
                const paymentStatus = (
                  ord.paymentStatus ||
                  ord.payment_status ||
                  'unpaid'
                ).toLowerCase();
                const time =
                  ord.checkin_time || ord.checkInTime || '10:30';
                const orderCode = `#ORD-${String(ord.id || idx + 1).padStart(
                  3,
                  '0'
                )}`;

                return (
                  <View key={ord.id || idx} style={styles.orderCard}>
                    {/* Header: Order Code & Time */}
                    <View style={styles.orderCardHeader}>
                      <Text style={styles.orderCode}>{orderCode}</Text>
                      <Text style={styles.orderTime}>{time}</Text>
                    </View>

                    {/* Customer Info */}
                    <Text style={styles.customerName}>{customerName}</Text>
                    <Text style={styles.serviceDesc} numberOfLines={1}>
                      {ord.notes || 'Haircut & Styling'}
                    </Text>

                    {/* Footer: Kapster & Status Badges */}
                    <View style={styles.orderCardFooter}>
                      <View style={styles.kapsterBadge}>
                        <Text style={styles.kapsterText}>w/ {kapsterName}</Text>
                      </View>

                      <View style={styles.statusBadgesRow}>
                        {/* Service Status Badge */}
                        <View
                          style={[
                            styles.badge,
                            serviceStatus === 'waiting' && styles.badgeWaiting,
                            serviceStatus === 'in_service' && styles.badgeInService,
                            serviceStatus === 'completed' && styles.badgeCompleted,
                          ]}
                        >
                          <Text
                            style={[
                              styles.badgeText,
                              serviceStatus === 'waiting' && styles.badgeTextWaiting,
                              serviceStatus === 'in_service' && styles.badgeTextInService,
                              serviceStatus === 'completed' && styles.badgeTextCompleted,
                            ]}
                          >
                            {serviceStatus.replace('_', ' ').toUpperCase()}
                          </Text>
                        </View>

                        {/* Payment Status Badge */}
                        <View
                          style={[
                            styles.badge,
                            paymentStatus === 'paid'
                              ? styles.badgePaid
                              : styles.badgeUnpaid,
                          ]}
                        >
                          <Text
                            style={[
                              styles.badgeText,
                              paymentStatus === 'paid'
                                ? styles.badgeTextPaid
                                : styles.badgeTextUnpaid,
                            ]}
                          >
                            {paymentStatus.toUpperCase()}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>
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
  mainTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1A1C1C',
    letterSpacing: -0.6,
  },
  subTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 4,
  },
  cardsSection: {
    marginBottom: 20,
  },
  horizontalScroll: {
    paddingHorizontal: 20,
    gap: 12,
  },
  statusCard: {
    width: 200,
    height: 80,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E2E2E2',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  statusCardActive: {
    borderColor: '#000000',
    borderWidth: 1.5,
    backgroundColor: '#FAFAFA',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cardTextBox: {
    flex: 1,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.6,
  },
  cardCount: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1A1C1C',
    marginTop: 2,
    letterSpacing: -0.5,
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
  listSection: {
    paddingHorizontal: 20,
  },
  listHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  listHeaderTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A1C1C',
    letterSpacing: -0.3,
  },
  resetFilterText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
  loadingIndicator: {
    paddingVertical: 30,
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E2E2',
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  emptySubtext: {
    fontSize: 12,
    color: '#94A3B8',
  },
  ordersListVertical: {
    gap: 12,
  },
  orderCard: {
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
  },
  orderCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  orderCode: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  orderTime: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
  },
  customerName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1A1C1C',
    marginBottom: 2,
  },
  serviceDesc: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    marginBottom: 12,
  },
  orderCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  kapsterBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  kapsterText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  statusBadgesRow: {
    flexDirection: 'row',
    gap: 6,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  badgeWaiting: {
    backgroundColor: '#FEF3C7',
  },
  badgeTextWaiting: {
    color: '#D97706',
  },
  badgeInService: {
    backgroundColor: '#DBEAFE',
  },
  badgeTextInService: {
    color: '#2563EB',
  },
  badgeCompleted: {
    backgroundColor: '#DCFCE7',
  },
  badgeTextCompleted: {
    color: '#16A34A',
  },
  badgePaid: {
    backgroundColor: '#DCFCE7',
  },
  badgeTextPaid: {
    color: '#16A34A',
  },
  badgeUnpaid: {
    backgroundColor: '#FEE2E2',
  },
  badgeTextUnpaid: {
    color: '#DC2626',
  },
});