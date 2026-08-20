import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import type { HomeScreenProps } from '../types/navigation';
import { useAuth } from '../context/AuthContext';
import {
  getHomeData,
  getOrdersData,
  getCustomerData,
  getKapsterData,
} from '../api/homeService';

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const { user, logout } = useAuth();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [orders, setOrders] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [kapsters, setKapsters] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);

  const todayFormatted = new Date()
    .toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
    .toUpperCase();

  const fetchDashboardData = useCallback(async () => {
    try {
      const [invoicesRes, ordersRes, customersRes, kapstersRes] =
        await Promise.allSettled([
          getHomeData(),
          getOrdersData(),
          getCustomerData(),
          getKapsterData(),
        ]);

      if (invoicesRes.status === 'fulfilled') setInvoices(invoicesRes.value || []);
      if (ordersRes.status === 'fulfilled') setOrders(ordersRes.value || []);
      if (customersRes.status === 'fulfilled') setCustomers(customersRes.value || []);
      if (kapstersRes.status === 'fulfilled') setKapsters(kapstersRes.value || []);
    } catch (error) {
      console.log('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const handleLogout = () => {
    Alert.alert('Konfirmasi Logout', 'Apakah Anda yakin ingin keluar?', [
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

  // 1. Perhitungan Metrics Hari Ini
  const todayStr = new Date().toDateString();

  const todayOrders = orders.filter((o) => {
    const orderDate = new Date(o.createdAt || o.created_at || Date.now()).toDateString();
    return orderDate === todayStr;
  });
  const totalOrdersCount = todayOrders.length > 0 ? todayOrders.length : orders.length;

  const todayCustomers = customers.filter((c) => {
    const custDate = new Date(c.createdAt || c.created_at || Date.now()).toDateString();
    return custDate === todayStr;
  });
  const totalCustomersCount = todayCustomers.length > 0 ? todayCustomers.length : customers.length;

  const calculatedRevenue = invoices
    .filter((inv) => {
      const isPaid = (inv.status || '').toLowerCase() === 'paid';
      return isPaid;
    })
    .reduce((acc, curr) => {
      return acc + (parseFloat(curr.total_amount || curr.totalAmount) || 0);
    }, 0);

  const formatCurrency = (val: number) => {
    return 'Rp ' + Number(val || 0).toLocaleString('id-ID');
  };

  const getCustomerName = (id: number) => {
    const cust = customers.find((c) => c.id === id);
    return cust ? cust.name : `Customer #${id}`;
  };

  const getKapsterName = (id: number) => {
    const kap = kapsters.find((k) => k.id === id);
    return kap ? kap.name : `Kapster #${id}`;
  };

  // 3 Card Data Sesuai Screenshot Web
  const summaryCards = [
    {
      id: 'total-orders',
      label: 'TOTAL ORDERS',
      value: loading ? '0' : String(totalOrdersCount),
      subtext: '↗ % vs last week',
      icon: '🧾',
    },
    {
      id: 'revenue-today',
      label: 'REVENUE (TODAY)',
      value: loading ? 'Rp 0' : formatCurrency(calculatedRevenue),
      subtext: '↗ % vs yesterday',
      icon: '💵',
    },
    {
      id: 'new-customers',
      label: 'NEW CUSTOMERS',
      value: loading ? '0' : String(totalCustomersCount),
      subtext: '→ Same as average',
      icon: '👤',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Top Header Bar */}
        <View style={styles.topHeader}>
          <View style={styles.dateBadge}>
            <Text style={styles.dateBadgeText}>TODAY, {todayFormatted}</Text>
          </View>

          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <Text style={styles.logoutBtnText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Dashboard Title Header */}
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>Dashboard Overview</Text>
          <Text style={styles.subTitle}>
            Here's what's happening at Hairdept today.
          </Text>
        </View>

        {/* Section: Metrics Bento Cards (Horizontal Scroll) */}
        <View style={styles.metricsSection}>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {summaryCards.map((card) => (
              <View key={card.id} style={styles.metricCard}>
                <View style={styles.cardHeaderRow}>
                  <Text style={styles.cardLabel}>{card.label}</Text>
                  <View style={styles.iconBox}>
                    <Text style={styles.iconText}>{card.icon}</Text>
                  </View>
                </View>

                <View style={styles.cardBody}>
                  <Text style={styles.metricValue}>{card.value}</Text>
                  <Text style={styles.metricSubtext}>{card.subtext}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Section: Up Next / Recent Orders (Vertical List) */}
        <View style={styles.upNextSection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Up Next</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator size="small" color="#0F172A" style={styles.loadingIndicator} />
          ) : orders.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>No upcoming appointments</Text>
            </View>
          ) : (
            <View style={styles.ordersListVertical}>
              {orders.slice(0, 5).map((ord, idx) => {
                const customerName =
                  ord.customer_name ||
                  ord.customerName ||
                  getCustomerName(ord.customer_id || ord.customerId);
                const serviceName = ord.notes || 'Haircut & Styling';
                const kapsterName =
                  ord.kapster_name ||
                  ord.kapsterName ||
                  getKapsterName(ord.kapster_id || ord.kapsterId);
                const time = ord.checkin_time || ord.checkInTime || '10:30';
                const initial = customerName.charAt(0).toUpperCase();

                return (
                  <View key={ord.id || idx} style={styles.orderCard}>
                    {/* Left Side: Avatar & Info */}
                    <View style={styles.orderLeft}>
                      <View style={styles.avatarBox}>
                        <Text style={styles.avatarText}>{initial}</Text>
                      </View>
                      <View style={styles.orderInfo}>
                        <Text style={styles.customerName}>{customerName}</Text>
                        <Text style={styles.serviceText} numberOfLines={1}>
                          {serviceName}
                        </Text>
                      </View>
                    </View>

                    {/* Right Side: Time & Kapster Pill */}
                    <View style={styles.orderRight}>
                      <Text style={styles.orderTimeText}>{time}</Text>
                      <View style={styles.kapsterBadge}>
                        <Text style={styles.kapsterBadgeText}>w/ {kapsterName}</Text>
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
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  dateBadge: {
    backgroundColor: '#EEEEEE',
    borderWidth: 1,
    borderColor: '#E2E2E2',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
  },
  dateBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#475569',
    letterSpacing: 0.8,
  },
  logoutBtn: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FECACA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  logoutBtnText: {
    color: '#DC2626',
    fontWeight: '700',
    fontSize: 12,
  },
  titleSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
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
  metricsSection: {
    marginBottom: 28,
  },
  horizontalScroll: {
    paddingHorizontal: 20,
    gap: 14,
  },
  metricCard: {
    width: 220,
    height: 140,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E2E2',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: '#475569',
    letterSpacing: 1.2,
    flex: 1,
    paddingRight: 6,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 16,
  },
  cardBody: {
    marginTop: 2,
  },
  metricValue: {
    fontSize: 26,
    fontWeight: '900',
    color: '#1A1C1C',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  metricSubtext: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  upNextSection: {
    paddingHorizontal: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1A1C1C',
    letterSpacing: -0.4,
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#000000',
  },
  loadingIndicator: {
    paddingVertical: 30,
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E2E2',
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
  },
  ordersListVertical: {
    gap: 10,
  },
  orderCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E2E2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  orderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  avatarBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E293B',
  },
  orderInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1A1C1C',
    marginBottom: 2,
  },
  serviceText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748B',
  },
  orderRight: {
    alignItems: 'flex-end',
  },
  orderTimeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1A1C1C',
    marginBottom: 4,
  },
  kapsterBadge: {
    backgroundColor: '#EEEEEE',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  kapsterBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#334155',
  },
});