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

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';

import { useAuth } from '../context/AuthContext';

import {
  getHomeData,
  getOrdersData,
  getCustomerData,
  getKapsterData,
} from '../api/homeService';

type RootNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<RootNavigationProp>();

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
      const [
        invoicesRes,
        ordersRes,
        customersRes,
        kapstersRes,
      ] = await Promise.allSettled([
        getHomeData(),
        getOrdersData(),
        getCustomerData(),
        getKapsterData(),
      ]);

      if (invoicesRes.status === 'fulfilled') {
        setInvoices(invoicesRes.value || []);
      }

      if (ordersRes.status === 'fulfilled') {
        setOrders(ordersRes.value || []);
      }

      if (customersRes.status === 'fulfilled') {
        setCustomers(customersRes.value || []);
      }

      if (kapstersRes.status === 'fulfilled') {
        setKapsters(kapstersRes.value || []);
      }
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
    Alert.alert(
      'Konfirmasi Logout',
      'Apakah Anda yakin ingin keluar?',
      [
        {
          text: 'Batal',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            logout();
            navigation.replace('Login');
          },
        },
      ]
    );
  };

  // =========================
  // TODAY DATA
  // =========================

  const todayStr = new Date().toDateString();

  const todayOrders = orders.filter((order) => {
    const rawDate =
      order.createdAt ||
      order.created_at;

    if (!rawDate) return false;

    return (
      new Date(rawDate).toDateString() ===
      todayStr
    );
  });

  const totalOrdersToday =
    todayOrders.length;

  const todayCustomers = customers.filter(
    (customer) => {
      const rawDate =
        customer.createdAt ||
        customer.created_at;

      if (!rawDate) return false;

      return (
        new Date(rawDate).toDateString() ===
        todayStr
      );
    }
  );

  const totalCustomersToday =
    todayCustomers.length;

  const calculatedRevenue = invoices
    .filter((invoice) => {
      const isPaid =
        (invoice.status || '').toLowerCase() ===
        'paid';

      if (!isPaid) return false;

      const rawDate =
        invoice.paidAt ||
        invoice.paid_at ||
        invoice.issuedAt ||
        invoice.issued_at;

      if (!rawDate) return false;

      return (
        new Date(rawDate).toDateString() ===
        todayStr
      );
    })
    .reduce((total, invoice) => {
      return (
        total +
        (parseFloat(
          invoice.total_amount ||
          invoice.totalAmount
        ) || 0)
      );
    }, 0);

  const formatCurrency = (value: number) => {
    return (
      'Rp ' +
      Number(value || 0).toLocaleString('id-ID')
    );
  };

  const getCustomerName = (id: number) => {
    const customer = customers.find(
      (item) => item.id === id
    );

    return customer
      ? customer.name
      : `Customer #${id}`;
  };

  const getKapsterName = (id: number) => {
    const kapster = kapsters.find(
      (item) => item.id === id
    );

    return kapster
      ? kapster.name
      : `Kapster #${id}`;
  };

  // =========================
  // SUMMARY CARDS
  // =========================

  const summaryCards = [
    {
      id: 'total-orders',
      label: 'TOTAL ORDERS',
      value: loading
        ? '0'
        : String(totalOrdersToday),
      subtext: '↗ % vs last week',
      icon: '🧾',
    },
    {
      id: 'revenue-today',
      label: 'REVENUE (TODAY)',
      value: loading
        ? 'Rp 0'
        : formatCurrency(calculatedRevenue),
      subtext: '↗ % vs yesterday',
      icon: '💵',
    },
    {
      id: 'new-customers',
      label: 'NEW CUSTOMERS',
      value: loading
        ? '0'
        : String(totalCustomersToday),
      subtext: '→ Same as average',
      icon: '👤',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
      />

      <ScrollView
        contentContainerStyle={
          styles.scrollContent
        }
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        {/* =========================
            TOP HEADER
        ========================= */}

        <View style={styles.topHeader}>
          <View style={styles.dateBadge}>
            <Text style={styles.dateBadgeText}>
              TODAY, {todayFormatted}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <Text style={styles.logoutBtnText}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>

        {/* =========================
            TITLE
        ========================= */}

        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>
            Dashboard Overview
          </Text>

          <Text style={styles.subTitle}>
            Here's what's happening at Hairdept today.
          </Text>
        </View>

        {/* =========================
            SUMMARY CARDS
        ========================= */}

        <View style={styles.metricsSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={
              styles.horizontalScroll
            }
          >
            {summaryCards.map((card) => (
              <View
                key={card.id}
                style={styles.metricCard}
              >
                <View style={styles.cardHeaderRow}>
                  <Text style={styles.cardLabel}>
                    {card.label}
                  </Text>

                  <View style={styles.iconBox}>
                    <Text style={styles.iconText}>
                      {card.icon}
                    </Text>
                  </View>
                </View>

                <View style={styles.cardBody}>
                  <Text style={styles.metricValue}>
                    {card.value}
                  </Text>

                  <Text style={styles.metricSubtext}>
                    {card.subtext}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* =========================
            UP NEXT
        ========================= */}

        <View style={styles.upNextSection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>
              Up Next
            </Text>

            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.viewAllText}>
                View All
              </Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator
              size="small"
              color="#0F172A"
              style={styles.loadingIndicator}
            />
          ) : orders.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>
                No upcoming appointments
              </Text>
            </View>
          ) : (
            <View style={styles.ordersListVertical}>
              {orders
                .slice(0, 5)
                .map((order, index) => {
                  const customerName =
                    order.customer_name ||
                    order.customerName ||
                    getCustomerName(
                      order.customer_id ||
                      order.customerId
                    );

                  const serviceName =
                    order.notes ||
                    'Haircut & Styling';

                  const kapsterName =
                    order.kapster_name ||
                    order.kapsterName ||
                    getKapsterName(
                      order.kapster_id ||
                      order.kapsterId
                    );

                  const time =
                    order.checkin_time ||
                    order.checkInTime ||
                    '10:30';

                  const initial =
                    customerName
                      .charAt(0)
                      .toUpperCase();

                  return (
                    <View
                      key={
                        order.id || index
                      }
                      style={styles.orderCard}
                    >
                      <View style={styles.orderLeft}>
                        <View style={styles.avatarBox}>
                          <Text
                            style={styles.avatarText}
                          >
                            {initial}
                          </Text>
                        </View>

                        <View style={styles.orderInfo}>
                          <Text
                            style={styles.customerName}
                          >
                            {customerName}
                          </Text>

                          <Text
                            style={styles.serviceText}
                            numberOfLines={1}
                          >
                            {serviceName}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.orderRight}>
                        <Text
                          style={styles.orderTimeText}
                        >
                          {time}
                        </Text>

                        <View
                          style={
                            styles.kapsterBadge
                          }
                        >
                          <Text
                            style={
                              styles.kapsterBadgeText
                            }
                          >
                            w/ {kapsterName}
                          </Text>
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
    shadowOffset: {
      width: 0,
      height: 1,
    },
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
    shadowOffset: {
      width: 0,
      height: 1,
    },
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