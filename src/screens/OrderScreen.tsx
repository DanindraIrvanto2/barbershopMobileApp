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
import * as Print from 'expo-print';
import { orderService, type Order } from '../api/orderService';
import { getCustomerData, getKapsterData } from '../api/homeService';

export default function OrderScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Data states
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [kapsters, setKapsters] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);

  // Filter & Search states
  const [activeTab, setActiveTab] = useState<string>('ALL'); // 'ALL' | 'WAITING' | 'IN_SERVICE' | 'UNPAID' | 'PAID'
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Create Order Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [customerSearch, setCustomerSearch] = useState('');
  const [isCustomerDropdownOpen, setIsCustomerDropdownOpen] = useState(false);

  const getCurrentTimeString = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const [newOrder, setNewOrder] = useState({
    customerId: '',
    kapsterId: '',
    selectedServiceIds: [] as number[],
    checkInTime: getCurrentTimeString(),
    notes: '',
  });

  // Edit / View Modal states
  const [viewOrderModal, setViewOrderModal] = useState<Order | null>(null);
  const [selectedInvoiceModal, setSelectedInvoiceModal] = useState<Order | null>(null);
  const [statusForm, setStatusForm] = useState({
    serviceStatus: 'waiting',
    paymentStatus: 'unpaid',
  });
  const [updateLoading, setUpdateLoading] = useState(false);

  // Fetch all required data
  const fetchOrdersData = useCallback(async () => {
    try {
      const [ordersRes, customersRes, kapstersRes, servicesRes] =
        await Promise.allSettled([
          orderService.getOrders(),
          getCustomerData(),
          getKapsterData(),
          orderService.getServices(),
        ]);

      if (ordersRes.status === 'fulfilled') setOrders(ordersRes.value || []);
      if (customersRes.status === 'fulfilled') setCustomers(customersRes.value || []);
      if (kapstersRes.status === 'fulfilled') setKapsters(kapstersRes.value || []);
      if (servicesRes.status === 'fulfilled') setServices(servicesRes.value || []);
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
  const getCustomer = (id: number) => {
    return (
      customers.find((c) => c.id === id) || {
        name: `Customer #${id}`,
        phone: '-',
      }
    );
  };

  const getKapster = (id: number) => {
    return (
      kapsters.find((k) => k.id === id) || {
        name: `Kapster #${id}`,
      }
    );
  };

  const formatCurrency = (val: number | string) => {
    return 'Rp ' + Number(val || 0).toLocaleString('id-ID');
  };

  // 1. Calculate 4 Status Counter Cards
  const waitingCount = orders.filter(
    (o) => (o.serviceStatus || '').toLowerCase() === 'waiting'
  ).length;

  const inServiceCount = orders.filter(
    (o) => (o.serviceStatus || '').toLowerCase() === 'in_service'
  ).length;

  const completedUnpaidCount = orders.filter((o) => {
    const serviceStatus = (o.serviceStatus || '').toLowerCase();
    const paymentStatus = (o.paymentStatus || '').toLowerCase();
    return serviceStatus === 'completed' && paymentStatus === 'unpaid';
  }).length;

  const completedPaidCount = orders.filter((o) => {
    const serviceStatus = (o.serviceStatus || '').toLowerCase();
    const paymentStatus = (o.paymentStatus || '').toLowerCase();
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

  // 2. Open Create Modal
  const handleOpenCreateModal = () => {
    setNewOrder({
      customerId: '',
      kapsterId: '',
      selectedServiceIds: [],
      checkInTime: getCurrentTimeString(),
      notes: '',
    });
    setCustomerSearch('');
    setIsCustomerDropdownOpen(false);
    setShowCreateModal(true);
  };

  // Service toggle for multi-select
  const toggleServiceSelection = (serviceId: number) => {
    setNewOrder((prev) => {
      const exists = prev.selectedServiceIds.includes(serviceId);
      const updated = exists
        ? prev.selectedServiceIds.filter((id) => id !== serviceId)
        : [...prev.selectedServiceIds, serviceId];
      return { ...prev, selectedServiceIds: updated };
    });
  };

  const calculateCreateTotal = () => {
    return newOrder.selectedServiceIds.reduce((sum, sId) => {
      const srv = services.find((s) => s.id === sId);
      return sum + (srv ? parseFloat(srv.price) : 0);
    }, 0);
  };

  // Submit Create Order (C)
  const handleCreateOrder = async () => {
    if (!newOrder.customerId) {
      Alert.alert('Peringatan', 'Silakan pilih pelanggan terlebih dahulu.');
      return;
    }
    if (!newOrder.kapsterId) {
      Alert.alert('Peringatan', 'Silakan pilih kapster yang bertugas.');
      return;
    }
    if (newOrder.selectedServiceIds.length === 0) {
      Alert.alert('Peringatan', 'Pilih minimal satu layanan / produk.');
      return;
    }

    setCreateLoading(true);
    try {
      await orderService.createOrder({
        customerId: parseInt(newOrder.customerId),
        kapsterId: parseInt(newOrder.kapsterId),
        serviceIds: newOrder.selectedServiceIds,
        checkInTime: newOrder.checkInTime || getCurrentTimeString(),
        notes: newOrder.notes,
        serviceStatus: 'waiting',
        paymentStatus: 'unpaid',
      });

      setShowCreateModal(false);
      Alert.alert('Berhasil', 'Order baru berhasil ditambahkan!');
      fetchOrdersData();
    } catch (error: any) {
      console.log('Error creating order:', error);
      Alert.alert('Gagal', error.response?.data?.error || 'Gagal membuat order baru.');
    } finally {
      setCreateLoading(false);
    }
  };

  // Quick Delete from Card (D)
  const handleQuickDelete = (ord: Order) => {
    Alert.alert(
      'Hapus Pesanan',
      `Apakah Anda yakin ingin membatalkan & menghapus Order #ORD-${String(
        ord.id
      ).padStart(3, '0')}?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              await orderService.deleteOrder(ord.id);
              Alert.alert('Sukses', 'Pesanan berhasil dihapus.');
              fetchOrdersData();
            } catch (error: any) {
              console.log('Error deleting order:', error);
              Alert.alert('Gagal', 'Gagal menghapus order.');
            }
          },
        },
      ]
    );
  };

  // Open Edit / View Modal (U/D)
  const handleOpenViewModal = (ord: Order) => {
    setViewOrderModal(ord);
    setStatusForm({
      serviceStatus: ord.serviceStatus || 'waiting',
      paymentStatus: ord.paymentStatus || 'unpaid',
    });
  };

  // Submit Update Order Status (U)
  const handleSaveStatusUpdate = async () => {
    if (!viewOrderModal) return;
    setUpdateLoading(true);
    try {
      await orderService.updateOrder(viewOrderModal.id, {
        serviceStatus: statusForm.serviceStatus,
        paymentStatus: statusForm.paymentStatus,
      });

      setViewOrderModal(null);
      Alert.alert('Sukses', 'Status pesanan berhasil diperbarui!');
      fetchOrdersData();
    } catch (error: any) {
      console.log('Error updating order status:', error);
      Alert.alert('Gagal', 'Gagal memperbarui status order.');
    } finally {
      setUpdateLoading(false);
    }
  };

  // Payment Modal states
  const [paymentModal, setPaymentModal] = useState<Order | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'QRIS'>('Cash');
  const [amountReceived, setAmountReceived] = useState<string>('');
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Open Payment Modal
  const handleOpenPaymentModal = (ord: Order) => {
    setViewOrderModal(null);
    setPaymentModal(ord);
    setPaymentMethod('Cash');
    setAmountReceived(String(ord.totalPrice || 35000));
  };

  // Confirm Payment
  const handleConfirmPayment = async () => {
    if (!paymentModal) return;
    const total = parseFloat(String(paymentModal.totalPrice || 35000));
    const received = parseFloat(amountReceived) || 0;

    if (paymentMethod === 'Cash' && received < total) {
      Alert.alert('Peringatan', 'Jumlah uang yang diterima kurang dari total tagihan!');
      return;
    }

    const change = Math.max(received - total, 0);

    setPaymentLoading(true);
    try {
      await orderService.updateOrder(paymentModal.id, {
        paymentStatus: 'paid',
        paymentMethod: paymentMethod,
        amountReceived: paymentMethod === 'Cash' ? received : total,
        changeAmount: paymentMethod === 'Cash' ? change : 0,
      });

      setPaymentModal(null);
      Alert.alert('Sukses', 'Pembayaran kasir berhasil diselesaikan!');
      fetchOrdersData();
    } catch (error: any) {
      console.log('Error confirming payment:', error);
      Alert.alert('Gagal', 'Gagal memproses pembayaran.');
    } finally {
      setPaymentLoading(false);
    }
  };

  // Print Receipt Handler
  const handlePrintReceipt = async (order: Order) => {
    const cust = getCustomer(order.customerId);
    const kap = getKapster(order.kapsterId);
    const dateStr = new Date(order.createdAt || Date.now()).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    const timeStr = order.checkInTime || '10:30';
    const totalDue = parseFloat(String(order.totalPrice || 35000));
    const items =
      order.services && order.services.length > 0
        ? order.services
        : [{ name: order.notes || 'Haircut & Styling', price: totalDue }];

    const itemsHtml = items
      .map(
        (it) => `
      <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 13px;">
        <span style="font-weight: 600; color: #1e293b;">${it.name}</span>
        <span style="font-weight: 700; color: #0f172a;">${formatCurrency(it.price)}</span>
      </div>
    `
      )
      .join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              color: #0f172a;
              padding: 24px;
              margin: 0;
              max-width: 320px;
              margin: auto;
            }
            .header {
              text-align: center;
              padding-bottom: 12px;
              border-bottom: 1px dashed #94a3b8;
              margin-bottom: 12px;
            }
            .brand-title {
              font-size: 16px;
              font-weight: 900;
              letter-spacing: 0.5px;
              margin: 4px 0 2px 0;
            }
            .address {
              font-size: 11px;
              color: #64748b;
              margin: 2px 0;
            }
            .meta-row {
              display: flex;
              justify-content: space-between;
              font-size: 12px;
              margin-bottom: 5px;
            }
            .meta-label {
              color: #64748b;
              font-weight: 600;
            }
            .meta-value {
              font-weight: 800;
              color: #0f172a;
            }
            .divider {
              border-bottom: 1px dashed #94a3b8;
              margin: 12px 0;
            }
            .total-row {
              display: flex;
              justify-content: space-between;
              align-items: center;
              font-size: 15px;
              font-weight: 900;
              margin-top: 6px;
            }
            .status-badge {
              display: inline-block;
              padding: 3px 8px;
              border-radius: 4px;
              font-size: 11px;
              font-weight: 800;
              background-color: ${order.paymentStatus === 'paid' ? '#dcfce7' : '#fef3c7'};
              color: ${order.paymentStatus === 'paid' ? '#16a34a' : '#d97706'};
            }
            .footer {
              text-align: center;
              margin-top: 16px;
              font-size: 11px;
              color: #64748b;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div style="font-size: 24px; margin-bottom: 4px;">✂️</div>
            <div class="brand-title">HAIRDEPT BARBERSHOP</div>
            <div class="address">Jl. Grand Sutra Raya, Tangerang</div>
            <div class="address">Telp: 0812-3456-7890</div>
          </div>

          <div class="meta-row">
            <span class="meta-label">No. Invoice:</span>
            <span class="meta-value">#INV-${String(order.id).padStart(4, '0')}</span>
          </div>
          <div class="meta-row">
            <span class="meta-label">No. Order:</span>
            <span class="meta-value">#ORD-${String(order.id).padStart(3, '0')}</span>
          </div>
          <div class="meta-row">
            <span class="meta-label">Tanggal:</span>
            <span class="meta-value">${dateStr} • ${timeStr}</span>
          </div>
          <div class="meta-row">
            <span class="meta-label">Customer:</span>
            <span class="meta-value">${cust.name} (${cust.phone || '-'})</span>
          </div>
          <div class="meta-row">
            <span class="meta-label">Kapster:</span>
            <span class="meta-value">${kap.name}</span>
          </div>

          <div class="divider"></div>

          <div style="font-size: 11px; font-weight: 800; color: #64748b; margin-bottom: 8px; text-transform: uppercase;">
            RINCIAN LAYANAN & PRODUK:
          </div>
          ${itemsHtml}

          <div class="divider"></div>

          <div class="meta-row" style="margin-bottom: 8px;">
            <span class="meta-label">Metode Bayar:</span>
            <span class="meta-value">Cash (Tunai)</span>
          </div>
          <div class="total-row">
            <span>TOTAL TAGIHAN:</span>
            <span style="color: #0f172a;">${formatCurrency(totalDue)}</span>
          </div>
          <div class="meta-row" style="margin-top: 8px; align-items: center;">
            <span class="meta-label">Status:</span>
            <span class="status-badge">${(order.paymentStatus || 'UNPAID').toUpperCase()}</span>
          </div>

          <div class="divider"></div>

          <div class="footer">
            <div style="font-weight: 800; color: #1e293b; margin-bottom: 2px;">Terima Kasih Atas Kunjungan Anda!</div>
            <div>See you next time at Hairdept Barbershop.</div>
          </div>
        </body>
      </html>
    `;

    try {
      await Print.printAsync({ html: htmlContent });
    } catch (err) {
      console.log('Error printing receipt:', err);
      Alert.alert('Gagal Print', 'Tidak dapat memproses print struk.');
    }
  };

  // Delete Order (D)
  const handleDeleteOrder = () => {
    if (!viewOrderModal) return;

    Alert.alert(
      'Hapus Pesanan',
      `Apakah Anda yakin ingin membatalkan & menghapus Order #ORD-${String(
        viewOrderModal.id
      ).padStart(3, '0')}?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              await orderService.deleteOrder(viewOrderModal.id);
              setViewOrderModal(null);
              Alert.alert('Sukses', 'Pesanan berhasil dihapus.');
              fetchOrdersData();
            } catch (error: any) {
              console.log('Error deleting order:', error);
              Alert.alert('Gagal', 'Gagal menghapus order.');
            }
          },
        },
      ]
    );
  };

  // 3. Filter & Search Order List (R)
  const filteredOrders = orders.filter((ord) => {
    const serviceStatus = (ord.serviceStatus || '').toLowerCase();
    const paymentStatus = (ord.paymentStatus || '').toLowerCase();

    // Filter by selected tab / status card
    if (activeTab === 'WAITING' && serviceStatus !== 'waiting') return false;
    if (activeTab === 'IN_SERVICE' && serviceStatus !== 'in_service') return false;
    if (
      activeTab === 'UNPAID' &&
      !(serviceStatus === 'completed' && paymentStatus === 'unpaid')
    )
      return false;
    if (
      activeTab === 'PAID' &&
      !(serviceStatus === 'completed' && paymentStatus === 'paid')
    )
      return false;

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const cust = getCustomer(ord.customerId);
      const kap = getKapster(ord.kapsterId);
      const custName = (cust.name || '').toLowerCase();
      const custPhone = (cust.phone || '').toLowerCase();
      const kapName = (kap.name || '').toLowerCase();
      const orderCode = `#ord-${String(ord.id).padStart(3, '0')}`.toLowerCase();
      const notes = (ord.notes || '').toLowerCase();

      return (
        custName.includes(q) ||
        custPhone.includes(q) ||
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
          <View style={styles.headerTitleRow}>
            <View>
              <Text style={styles.mainTitle}>Orders</Text>
              <Text style={styles.subTitle}>
                Review and manage recent appointments and transactions.
              </Text>
            </View>

            {/* + New Order Button */}
            <TouchableOpacity
              style={styles.newOrderBtn}
              onPress={handleOpenCreateModal}
              activeOpacity={0.85}
            >
              <Text style={styles.newOrderBtnPlus}>+</Text>
              <Text style={styles.newOrderBtnText}>NEW ORDER</Text>
            </TouchableOpacity>
          </View>
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

        {/* Orders List Section (R) */}
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
                const cust = getCustomer(ord.customerId);
                const kap = getKapster(ord.kapsterId);
                const serviceStatus = (ord.serviceStatus || 'waiting').toLowerCase();
                const paymentStatus = (ord.paymentStatus || 'unpaid').toLowerCase();
                const time = ord.checkInTime || '10:30';
                const orderCode = `#ORD-${String(ord.id || idx + 1).padStart(3, '0')}`;
                const servicesText =
                  ord.services && ord.services.length > 0
                    ? ord.services.map((s) => s.name).join(', ')
                    : ord.notes || 'Haircut & Styling';

                return (
                  <View key={ord.id || idx} style={styles.orderCard}>
                    {/* Header: Order Code, Price & Time */}
                    <View style={styles.orderCardHeader}>
                      <Text style={styles.orderCode}>{orderCode}</Text>
                      <View style={styles.orderHeaderRight}>
                        {ord.totalPrice ? (
                          <Text style={styles.orderPrice}>
                            {formatCurrency(ord.totalPrice)}
                          </Text>
                        ) : null}
                        <Text style={styles.orderTime}>{time}</Text>
                      </View>
                    </View>

                    {/* Customer Info */}
                    <Text style={styles.customerName}>{cust.name}</Text>
                    <Text style={styles.serviceDesc} numberOfLines={1}>
                      {servicesText}
                    </Text>

                    {/* Footer: Kapster & Status Badges on left, Action buttons (View & Delete) on right */}
                    <View style={styles.orderCardFooter}>
                      <View style={styles.footerLeftArea}>
                        <View style={styles.kapsterBadge}>
                          <Text style={styles.kapsterText}>w/ {kap.name}</Text>
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

                      {/* Action Buttons: View, Invoice & Delete */}
                      <View style={styles.actionButtonsRow}>
                        <TouchableOpacity
                          style={styles.viewActionBtn}
                          onPress={() => handleOpenViewModal(ord)}
                          activeOpacity={0.85}
                        >
                          <Text style={styles.viewActionBtnText}>View</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.invoiceActionBtn}
                          onPress={() => setSelectedInvoiceModal(ord)}
                          activeOpacity={0.7}
                        >
                          <Ionicons name="receipt-outline" size={17} color="#1E293B" />
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.deleteActionBtn}
                          onPress={() => handleQuickDelete(ord)}
                          activeOpacity={0.7}
                        >
                          <Ionicons name="trash-outline" size={17} color="#94A3B8" />
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
      {/* 4. MODAL: CREATE NEW ORDER (C) */}
      {/* ======================================================== */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Appointment / Order</Text>
              <TouchableOpacity
                onPress={() => setShowCreateModal(false)}
                style={styles.modalCloseBtn}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.modalScroll}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* Select Customer (Searchable Combobox) */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Select Customer *</Text>
                <TouchableOpacity
                  style={[
                    styles.comboboxTrigger,
                    isCustomerDropdownOpen && styles.comboboxTriggerActive,
                  ]}
                  onPress={() =>
                    setIsCustomerDropdownOpen(!isCustomerDropdownOpen)
                  }
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.comboboxValueText,
                      !newOrder.customerId && styles.placeholderText,
                    ]}
                  >
                    {newOrder.customerId
                      ? `${getCustomer(parseInt(newOrder.customerId)).name} (${
                          getCustomer(parseInt(newOrder.customerId)).phone
                        })`
                      : '-- Choose Customer --'}
                  </Text>
                  <Ionicons
                    name={
                      isCustomerDropdownOpen ? 'chevron-up' : 'chevron-down'
                    }
                    size={16}
                    color="#64748B"
                  />
                </TouchableOpacity>

                {isCustomerDropdownOpen && (
                  <View style={styles.dropdownPanel}>
                    {/* Search inside dropdown */}
                    <View style={styles.dropdownSearchBox}>
                      <Ionicons
                        name="search-outline"
                        size={14}
                        color="#94A3B8"
                      />
                      <TextInput
                        style={styles.dropdownSearchInput}
                        placeholder="Search name or phone..."
                        placeholderTextColor="#94A3B8"
                        value={customerSearch}
                        onChangeText={setCustomerSearch}
                        autoCapitalize="none"
                      />
                      {customerSearch ? (
                        <TouchableOpacity
                          onPress={() => setCustomerSearch('')}
                        >
                          <Text style={styles.clearSearchText}>✕</Text>
                        </TouchableOpacity>
                      ) : null}
                    </View>

                    {/* Customers list */}
                    <ScrollView
                      style={styles.dropdownList}
                      nestedScrollEnabled={true}
                    >
                      {customers
                        .filter((c) => {
                          if (!customerSearch.trim()) return true;
                          const q = customerSearch.toLowerCase();
                          return (
                            (c.name || '').toLowerCase().includes(q) ||
                            (c.phone || '').includes(q)
                          );
                        })
                        .map((c) => {
                          const isSelected =
                            parseInt(newOrder.customerId) === c.id;
                          return (
                            <TouchableOpacity
                              key={c.id}
                              style={[
                                styles.dropdownItem,
                                isSelected && styles.dropdownItemSelected,
                              ]}
                              onPress={() => {
                                setNewOrder({
                                  ...newOrder,
                                  customerId: String(c.id),
                                });
                                setIsCustomerDropdownOpen(false);
                                setCustomerSearch('');
                              }}
                            >
                              <View>
                                <Text style={styles.customerItemName}>
                                  {c.name}
                                </Text>
                                <Text style={styles.customerItemPhone}>
                                  {c.phone || '-'}
                                </Text>
                              </View>
                              {isSelected && (
                                <Ionicons
                                  name="checkmark"
                                  size={16}
                                  color="#000000"
                                />
                              )}
                            </TouchableOpacity>
                          );
                        })}
                    </ScrollView>
                  </View>
                )}
              </View>

              {/* Select Kapster */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Select Kapster *</Text>
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.horizontalPills}
                >
                  {kapsters.map((k) => {
                    const isSelected = String(k.id) === newOrder.kapsterId;
                    return (
                      <TouchableOpacity
                        key={k.id}
                        style={[
                          styles.kapsterPill,
                          isSelected && styles.kapsterPillActive,
                        ]}
                        onPress={() =>
                          setNewOrder({
                            ...newOrder,
                            kapsterId: String(k.id),
                          })
                        }
                      >
                        <Text
                          style={[
                            styles.kapsterPillText,
                            isSelected && styles.kapsterPillTextActive,
                          ]}
                        >
                          {k.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>

              {/* Multi-Select Services & Products */}
              <View style={styles.formGroup}>
                <View style={styles.labelWithBadge}>
                  <Text style={styles.formLabel}>Select Services & Products *</Text>
                  <Text style={styles.totalPreviewText}>
                    Total: {formatCurrency(calculateCreateTotal())}
                  </Text>
                </View>

                <View style={styles.servicesContainer}>
                  {services.map((s) => {
                    const isSelected = newOrder.selectedServiceIds.includes(
                      s.id
                    );
                    return (
                      <TouchableOpacity
                        key={s.id}
                        style={[
                          styles.serviceRow,
                          isSelected && styles.serviceRowActive,
                        ]}
                        onPress={() => toggleServiceSelection(s.id)}
                        activeOpacity={0.8}
                      >
                        <View style={styles.serviceRowLeft}>
                          <View
                            style={[
                              styles.checkbox,
                              isSelected && styles.checkboxActive,
                            ]}
                          >
                            {isSelected && (
                              <Text style={styles.checkmark}>✓</Text>
                            )}
                          </View>
                          <Text style={styles.serviceName}>{s.name}</Text>
                        </View>
                        <Text style={styles.servicePrice}>
                          {formatCurrency(s.price)}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Check-in Time */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Check-in Time</Text>
                <TextInput
                  style={styles.textInput}
                  value={newOrder.checkInTime}
                  onChangeText={(val) =>
                    setNewOrder({ ...newOrder, checkInTime: val })
                  }
                  placeholder="e.g. 10:30"
                  placeholderTextColor="#94A3B8"
                />
              </View>

              {/* Notes / Request */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Notes / Request</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  value={newOrder.notes}
                  onChangeText={(val) =>
                    setNewOrder({ ...newOrder, notes: val })
                  }
                  placeholder="e.g. Potong rapi samping tipis"
                  placeholderTextColor="#94A3B8"
                  multiline={true}
                  numberOfLines={2}
                />
              </View>
            </ScrollView>

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
                onPress={handleCreateOrder}
                disabled={createLoading}
              >
                {createLoading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.modalSubmitText}>Create Order</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ======================================================== */}
      {/* 5. MODAL: VIEW / UPDATE STATUS / DELETE ORDER (U / D) */}
      {/* ======================================================== */}
      <Modal
        visible={!!viewOrderModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setViewOrderModal(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Order Details & Status</Text>
                <Text style={styles.modalSubtitle}>
                  #ORD-{String(viewOrderModal?.id || 0).padStart(3, '0')}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setViewOrderModal(null)}
                style={styles.modalCloseBtn}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              {/* Order Info Card */}
              <View style={styles.orderInfoCard}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Customer:</Text>
                  <Text style={styles.infoValue}>
                    {getCustomer(viewOrderModal?.customerId || 0).name} (
                    {getCustomer(viewOrderModal?.customerId || 0).phone})
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Kapster:</Text>
                  <Text style={styles.infoValue}>
                    {getKapster(viewOrderModal?.kapsterId || 0).name}
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Services:</Text>
                  <Text style={styles.infoValue}>
                    {viewOrderModal?.services && viewOrderModal.services.length > 0
                      ? viewOrderModal.services.map((s) => s.name).join(', ')
                      : viewOrderModal?.notes || 'Haircut'}
                  </Text>
                </View>

                <View style={[styles.infoRow, styles.infoDividerRow]}>
                  <Text style={styles.infoLabel}>Total Price:</Text>
                  <Text style={styles.infoPriceValue}>
                    {formatCurrency(viewOrderModal?.totalPrice || 35000)}
                  </Text>
                </View>
              </View>

              {/* 1. Status Layanan (Service Status) */}
              <View style={styles.formGroup}>
                <Text style={styles.workflowSectionLabel}>
                  1. Status Layanan (Service Status)
                </Text>
                <View style={styles.serviceStatusRow}>
                  {[
                    {
                      key: 'waiting',
                      label: 'Waiting',
                      activeStyle: styles.statusWaitingActive,
                      activeTextStyle: styles.statusWaitingTextActive,
                    },
                    {
                      key: 'in_service',
                      label: 'In Service',
                      activeStyle: styles.statusInServiceActive,
                      activeTextStyle: styles.statusInServiceTextActive,
                    },
                    {
                      key: 'completed',
                      label: 'Completed',
                      activeStyle: styles.statusCompletedActive,
                      activeTextStyle: styles.statusCompletedTextActive,
                    },
                  ].map((st) => {
                    const isSelected = statusForm.serviceStatus === st.key;
                    return (
                      <TouchableOpacity
                        key={st.key}
                        style={[
                          styles.serviceStatusOptionBtn,
                          isSelected && st.activeStyle,
                        ]}
                        onPress={() =>
                          setStatusForm({
                            ...statusForm,
                            serviceStatus: st.key,
                          })
                        }
                        activeOpacity={0.8}
                      >
                        <Text
                          style={[
                            styles.serviceStatusOptionText,
                            isSelected && st.activeTextStyle,
                          ]}
                        >
                          {st.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Pay Now Button (If Unpaid) */}
              {viewOrderModal?.paymentStatus === 'unpaid' ? (
                <TouchableOpacity
                  style={styles.payNowBtn}
                  onPress={() =>
                    viewOrderModal && handleOpenPaymentModal(viewOrderModal)
                  }
                  activeOpacity={0.85}
                  disabled={updateLoading}
                >
                  <Ionicons name="card-outline" size={18} color="#FFFFFF" />
                  <Text style={styles.payNowBtnText}>
                    Proses Pembayaran Kasir (Pay Now)
                  </Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.paidBadgeBanner}>
                  <Ionicons name="checkmark-circle" size={18} color="#16A34A" />
                  <Text style={styles.paidBadgeText}>
                    Pesanan ini sudah lunas (Paid)
                  </Text>
                </View>
              )}
            </ScrollView>

            {/* Bottom Modal Actions (Cancel & Save Status Update) */}
            <View style={styles.updateModalActions}>
              <TouchableOpacity
                style={styles.cancelActionBtn}
                onPress={() => setViewOrderModal(null)}
              >
                <Text style={styles.cancelActionBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.saveUpdateBtn,
                  updateLoading && styles.modalSubmitBtnDisabled,
                ]}
                onPress={handleSaveStatusUpdate}
                disabled={updateLoading}
              >
                {updateLoading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.saveUpdateText}>Save Status Update</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ======================================================== */}
      {/* 6. MODAL: PEMBAYARAN KASIR (PAYMENT MODAL) */}
      {/* ======================================================== */}
      <Modal
        visible={!!paymentModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setPaymentModal(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <View>
                <View style={styles.payHeaderTitleRow}>
                  <Ionicons name="card" size={18} color="#059669" />
                  <Text style={styles.modalTitle}>Pembayaran Kasir</Text>
                </View>
                <Text style={styles.modalSubtitle}>
                  Order #ORD-{String(paymentModal?.id || 0).padStart(3, '0')} •{' '}
                  {getCustomer(paymentModal?.customerId || 0).name}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setPaymentModal(null)}
                style={styles.modalCloseBtn}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.modalScroll}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* Total Tagihan Card (Dark Slate Banner) */}
              <View style={styles.totalDueCard}>
                <View>
                  <Text style={styles.totalDueLabel}>TOTAL TAGIHAN</Text>
                  <Text style={styles.totalDueAmount}>
                    {formatCurrency(paymentModal?.totalPrice || 35000)}
                  </Text>
                </View>
                <View style={styles.statusDueRight}>
                  <Text style={styles.statusDueLabel}>STATUS</Text>
                  <View style={styles.unpaidTag}>
                    <Text style={styles.unpaidTagText}>UNPAID</Text>
                  </View>
                </View>
              </View>

              {/* Pilihan Metode Bayar */}
              <View style={styles.formGroup}>
                <Text style={styles.paymentSectionLabel}>
                  METODE PEMBAYARAN:
                </Text>
                <View style={styles.methodToggleRow}>
                  {/* Cash */}
                  <TouchableOpacity
                    style={[
                      styles.methodBtn,
                      paymentMethod === 'Cash' && styles.methodBtnActive,
                    ]}
                    onPress={() => {
                      setPaymentMethod('Cash');
                      setAmountReceived(
                        String(paymentModal?.totalPrice || 35000)
                      );
                    }}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name="cash-outline"
                      size={18}
                      color={paymentMethod === 'Cash' ? '#FFFFFF' : '#0F172A'}
                    />
                    <Text
                      style={[
                        styles.methodBtnText,
                        paymentMethod === 'Cash' && styles.methodBtnTextActive,
                      ]}
                    >
                      Cash (Tunai)
                    </Text>
                  </TouchableOpacity>

                  {/* QRIS */}
                  <TouchableOpacity
                    style={[
                      styles.methodBtn,
                      paymentMethod === 'QRIS' && styles.methodBtnActive,
                    ]}
                    onPress={() => {
                      setPaymentMethod('QRIS');
                      setAmountReceived(
                        String(paymentModal?.totalPrice || 35000)
                      );
                    }}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name="qr-code-outline"
                      size={18}
                      color={paymentMethod === 'QRIS' ? '#FFFFFF' : '#0F172A'}
                    />
                    <Text
                      style={[
                        styles.methodBtnText,
                        paymentMethod === 'QRIS' && styles.methodBtnTextActive,
                      ]}
                    >
                      QRIS
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Cash Input Details */}
              {paymentMethod === 'Cash' ? (
                <View style={styles.cashFormCard}>
                  <Text style={styles.formLabel}>
                    Uang Diterima (Amount Received):
                  </Text>
                  <View style={styles.amountInputRow}>
                    <Text style={styles.rpPrefix}>Rp</Text>
                    <TextInput
                      style={styles.amountInput}
                      value={amountReceived}
                      onChangeText={setAmountReceived}
                      keyboardType="numeric"
                      placeholder="0"
                      placeholderTextColor="#94A3B8"
                    />
                  </View>

                  {/* Quick Preset Pills */}
                  <View style={styles.presetPillsRow}>
                    {[
                      parseFloat(String(paymentModal?.totalPrice || 35000)),
                      50000,
                      100000,
                      200000,
                    ].map((preset) => {
                      const isExact =
                        preset ===
                        parseFloat(String(paymentModal?.totalPrice || 35000));
                      return (
                        <TouchableOpacity
                          key={preset}
                          style={styles.presetPill}
                          onPress={() => setAmountReceived(String(preset))}
                        >
                          <Text style={styles.presetPillText}>
                            {isExact ? 'Uang Pas' : formatCurrency(preset)}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  {/* Uang Kembalian (Change) */}
                  <View style={styles.changeRow}>
                    <Text style={styles.changeLabel}>
                      Uang Kembalian (Change):
                    </Text>
                    <Text
                      style={[
                        styles.changeValue,
                        (parseFloat(amountReceived) || 0) <
                          parseFloat(
                            String(paymentModal?.totalPrice || 35000)
                          ) && styles.changeValueShortage,
                      ]}
                    >
                      {(parseFloat(amountReceived) || 0) <
                      parseFloat(String(paymentModal?.totalPrice || 35000))
                        ? 'Uang Kurang!'
                        : formatCurrency(
                            Math.max(
                              (parseFloat(amountReceived) || 0) -
                                parseFloat(
                                  String(paymentModal?.totalPrice || 35000)
                                ),
                              0
                            )
                          )}
                    </Text>
                  </View>
                </View>
              ) : (
                /* QRIS Card */
                <View style={styles.qrisCard}>
                  <View style={styles.qrisIconCircle}>
                    <Ionicons name="qr-code-outline" size={28} color="#059669" />
                  </View>
                  <Text style={styles.qrisTitle}>
                    Pembayaran via QRIS Standee Kasir
                  </Text>
                  <Text style={styles.qrisSubtext}>
                    Pelanggan melakukan scan pada cetakan QRIS di meja kasir.
                    Klik tombol{' '}
                    <Text style={{ fontWeight: '800', color: '#0F172A' }}>
                      Mark as Paid
                    </Text>{' '}
                    setelah konfirmasi pembayaran berhasil.
                  </Text>
                </View>
              )}
            </ScrollView>

            {/* Bottom Actions */}
            <View style={styles.updateModalActions}>
              <TouchableOpacity
                style={styles.cancelActionBtn}
                onPress={() => setPaymentModal(null)}
              >
                <Text style={styles.cancelActionBtnText}>Batal</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.markAsPaidBtn,
                  paymentLoading && styles.modalSubmitBtnDisabled,
                ]}
                onPress={handleConfirmPayment}
                disabled={paymentLoading}
              >
                {paymentLoading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <>
                    <Ionicons
                      name="checkmark-circle"
                      size={18}
                      color="#FFFFFF"
                    />
                    <Text style={styles.markAsPaidText}>Mark as Paid</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ======================================================== */}
      {/* 7. MODAL: INVOICE & RECEIPT PREVIEW */}
      {/* ======================================================== */}
      <Modal
        visible={!!selectedInvoiceModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setSelectedInvoiceModal(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, styles.receiptModalCard]}>
            {/* Close Button Header */}
            <View style={styles.receiptTopBar}>
              <Text style={styles.receiptTopTitle}>Invoice & Receipt</Text>
              <TouchableOpacity
                onPress={() => setSelectedInvoiceModal(null)}
                style={styles.modalCloseBtn}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.modalScroll}
              showsVerticalScrollIndicator={false}
            >
              {/* Receipt Paper Card */}
              <View style={styles.receiptPaper}>
                {/* Header Struk */}
                <View style={styles.receiptHeader}>
                  <View style={styles.receiptLogoCircle}>
                    <Ionicons name="cut" size={24} color="#0F172A" />
                  </View>
                  <Text style={styles.receiptBrandTitle}>
                    HAIRDEPT BARBERSHOP
                  </Text>
                  <Text style={styles.receiptAddressText}>
                    Jl. Grand Sutra Raya, Tangerang
                  </Text>
                  <Text style={styles.receiptAddressText}>
                    Telp: 0812-3456-7890
                  </Text>
                </View>

                {/* Dashed Line */}
                <View style={styles.dashedLine} />

                {/* Meta Transaksi */}
                <View style={styles.receiptMetaSection}>
                  <View style={styles.receiptMetaRow}>
                    <Text style={styles.receiptMetaLabel}>No. Invoice:</Text>
                    <Text style={styles.receiptMetaValue}>
                      #INV-
                      {String(selectedInvoiceModal?.id || 0).padStart(4, '0')}
                    </Text>
                  </View>

                  <View style={styles.receiptMetaRow}>
                    <Text style={styles.receiptMetaLabel}>No. Order:</Text>
                    <Text style={styles.receiptMetaValue}>
                      #ORD-
                      {String(selectedInvoiceModal?.id || 0).padStart(3, '0')}
                    </Text>
                  </View>

                  <View style={styles.receiptMetaRow}>
                    <Text style={styles.receiptMetaLabel}>Tanggal & Jam:</Text>
                    <Text style={styles.receiptMetaValue}>
                      {new Date(
                        selectedInvoiceModal?.createdAt || Date.now()
                      ).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}{' '}
                      • {selectedInvoiceModal?.checkInTime || '10:30'}
                    </Text>
                  </View>

                  <View style={styles.receiptMetaRow}>
                    <Text style={styles.receiptMetaLabel}>Customer:</Text>
                    <Text style={styles.receiptMetaValue}>
                      {
                        getCustomer(selectedInvoiceModal?.customerId || 0)
                          .name
                      }{' '}
                      (
                      {
                        getCustomer(selectedInvoiceModal?.customerId || 0)
                          .phone
                      }
                      )
                    </Text>
                  </View>

                  <View style={styles.receiptMetaRow}>
                    <Text style={styles.receiptMetaLabel}>Kapster:</Text>
                    <Text style={styles.receiptMetaValue}>
                      {getKapster(selectedInvoiceModal?.kapsterId || 0).name}
                    </Text>
                  </View>
                </View>

                {/* Dashed Line */}
                <View style={styles.dashedLine} />

                {/* Itemized Services & Products */}
                <View style={styles.receiptItemsSection}>
                  <Text style={styles.receiptSectionHeader}>
                    RINCIAN LAYANAN & PRODUK:
                  </Text>
                  {selectedInvoiceModal?.services &&
                  selectedInvoiceModal.services.length > 0 ? (
                    selectedInvoiceModal.services.map((item, idx) => (
                      <View key={idx} style={styles.receiptItemRow}>
                        <Text style={styles.receiptItemName}>{item.name}</Text>
                        <Text style={styles.receiptItemPrice}>
                          {formatCurrency(item.price)}
                        </Text>
                      </View>
                    ))
                  ) : (
                    <View style={styles.receiptItemRow}>
                      <Text style={styles.receiptItemName}>
                        {selectedInvoiceModal?.notes || 'Haircut & Styling'}
                      </Text>
                      <Text style={styles.receiptItemPrice}>
                        {formatCurrency(
                          selectedInvoiceModal?.totalPrice || 35000
                        )}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Dashed Line */}
                <View style={styles.dashedLine} />

                {/* Total & Payment Summary */}
                <View style={styles.receiptTotalSection}>
                  <View style={styles.receiptTotalRow}>
                    <Text style={styles.receiptTotalLabel}>TOTAL TAGIHAN</Text>
                    <Text style={styles.receiptTotalAmount}>
                      {formatCurrency(
                        selectedInvoiceModal?.totalPrice || 35000
                      )}
                    </Text>
                  </View>

                  <View style={styles.receiptStatusRow}>
                    <Text style={styles.receiptStatusLabel}>
                      Status Pembayaran:
                    </Text>
                    <View
                      style={[
                        styles.badge,
                        (
                          selectedInvoiceModal?.paymentStatus || 'unpaid'
                        ).toLowerCase() === 'paid'
                          ? styles.badgePaid
                          : styles.badgeUnpaid,
                      ]}
                    >
                      <Text
                        style={[
                          styles.badgeText,
                          (
                            selectedInvoiceModal?.paymentStatus || 'unpaid'
                          ).toLowerCase() === 'paid'
                            ? styles.badgeTextPaid
                            : styles.badgeTextUnpaid,
                        ]}
                      >
                        {(
                          selectedInvoiceModal?.paymentStatus || 'unpaid'
                        ).toUpperCase()}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Dashed Line */}
                <View style={styles.dashedLine} />

                {/* Thank You Note */}
                <View style={styles.receiptFooter}>
                  <Text style={styles.receiptThankYou}>
                    Terima Kasih Atas Kunjungan Anda!
                  </Text>
                  <Text style={styles.receiptSubThankYou}>
                    Harap simpan struk ini sebagai bukti pembayaran yang sah.
                  </Text>
                </View>
              </View>
            </ScrollView>

            {/* Bottom Modal Actions (Close & Print Receipt) */}
            <View style={styles.updateModalActions}>
              <TouchableOpacity
                style={styles.cancelActionBtn}
                onPress={() => setSelectedInvoiceModal(null)}
              >
                <Text style={styles.cancelActionBtnText}>Close</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.printReceiptBtn}
                onPress={() =>
                  selectedInvoiceModal &&
                  handlePrintReceipt(selectedInvoiceModal)
                }
                activeOpacity={0.85}
              >
                <Ionicons name="print-outline" size={17} color="#FFFFFF" />
                <Text style={styles.printReceiptBtnText}>Print Receipt</Text>
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
    maxWidth: 220,
  },
  newOrderBtn: {
    backgroundColor: '#000000',
    paddingHorizontal: 14,
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
  newOrderBtnPlus: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    lineHeight: 18,
  },
  newOrderBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  cardsSection: {
    marginBottom: 18,
  },
  horizontalScroll: {
    paddingHorizontal: 20,
    gap: 12,
  },
  statusCard: {
    width: 190,
    height: 76,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
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
    width: 42,
    height: 42,
    borderRadius: 10,
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
    fontSize: 9.5,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.6,
  },
  cardCount: {
    fontSize: 19,
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
  orderHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  orderPrice: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
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
    gap: 8,
  },
  footerLeftArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  kapsterBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'center',
  },
  kapsterText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  statusBadgesRow: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 3,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  viewActionBtn: {
    backgroundColor: '#000000',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewActionBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  invoiceActionBtn: {
    padding: 5,
    borderRadius: 6,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteActionBtn: {
    padding: 5,
    borderRadius: 6,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
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
    fontWeight: '600',
  },
  modalCloseBtn: {
    padding: 6,
  },
  modalCloseText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#64748B',
  },
  modalScroll: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 24,
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 6,
  },
  labelWithBadge: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  totalPreviewText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2563EB',
  },
  comboboxTrigger: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  comboboxTriggerActive: {
    borderColor: '#000000',
    backgroundColor: '#FFFFFF',
  },
  comboboxValueText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  placeholderText: {
    color: '#94A3B8',
    fontWeight: '500',
  },
  dropdownPanel: {
    marginTop: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  dropdownSearchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 6,
  },
  dropdownSearchInput: {
    flex: 1,
    fontSize: 12,
    color: '#0F172A',
    padding: 0,
  },
  clearSearchText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '800',
    paddingHorizontal: 4,
  },
  dropdownList: {
    maxHeight: 140,
  },
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  dropdownItemSelected: {
    backgroundColor: '#F1F5F9',
  },
  customerItemName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  customerItemPhone: {
    fontSize: 11,
    color: '#64748B',
  },
  horizontalPills: {
    gap: 8,
    paddingVertical: 2,
  },
  kapsterPill: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  kapsterPillActive: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },
  kapsterPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  kapsterPillTextActive: {
    color: '#FFFFFF',
  },
  servicesContainer: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    padding: 8,
    gap: 6,
  },
  serviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 8,
  },
  serviceRowActive: {
    borderColor: '#000000',
    backgroundColor: '#FAFAFA',
  },
  serviceRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
  },
  serviceName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
  },
  servicePrice: {
    fontSize: 12,
    fontWeight: '800',
    color: '#475569',
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#0F172A',
  },
  textArea: {
    height: 60,
    textAlignVertical: 'top',
  },
  modalActionRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 12,
    gap: 10,
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

  // Web-like Order Details & Status Modal Styles
  orderInfoCard: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  infoValue: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
    maxWidth: '65%',
    textAlign: 'right',
  },
  infoDividerRow: {
    paddingTop: 10,
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  infoPriceValue: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
  },
  workflowSectionLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 8,
  },
  serviceStatusRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  serviceStatusOptionBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceStatusOptionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  statusWaitingActive: {
    borderWidth: 2,
    borderColor: '#000000',
    backgroundColor: '#F1F5F9',
  },
  statusWaitingTextActive: {
    color: '#0F172A',
    fontWeight: '800',
  },
  statusInServiceActive: {
    borderWidth: 2,
    borderColor: '#000000',
    backgroundColor: '#FEF3C7',
  },
  statusInServiceTextActive: {
    color: '#B45309',
    fontWeight: '800',
  },
  statusCompletedActive: {
    borderWidth: 2,
    borderColor: '#000000',
    backgroundColor: '#DCFCE7',
  },
  statusCompletedTextActive: {
    color: '#15803D',
    fontWeight: '800',
  },
  payNowBtn: {
    backgroundColor: '#059669',
    paddingVertical: 12,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  payNowBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  paidBadgeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DCFCE7',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
    marginBottom: 16,
  },
  paidBadgeText: {
    color: '#16A34A',
    fontWeight: '800',
    fontSize: 12,
  },
  updateModalActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 12,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  cancelActionBtn: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelActionBtnText: {
    color: '#475569',
    fontWeight: '800',
    fontSize: 13,
  },
  saveUpdateBtn: {
    flex: 2,
    backgroundColor: '#000000',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveUpdateText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },

  // Payment Modal Specific Styles
  payHeaderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  totalDueCard: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalDueLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  totalDueAmount: {
    fontSize: 22,
    fontWeight: '900',
    color: '#34D399',
    letterSpacing: -0.5,
  },
  statusDueRight: {
    alignItems: 'flex-end',
  },
  statusDueLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    marginBottom: 4,
  },
  unpaidTag: {
    backgroundColor: 'rgba(251, 191, 36, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  unpaidTagText: {
    color: '#FBBF24',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  paymentSectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1E293B',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  methodToggleRow: {
    flexDirection: 'row',
    gap: 10,
  },
  methodBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  methodBtnActive: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },
  methodBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  methodBtnTextActive: {
    color: '#FFFFFF',
  },
  cashFormCard: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 14,
    gap: 10,
  },
  amountInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  rpPrefix: {
    fontSize: 14,
    fontWeight: '800',
    color: '#64748B',
    marginRight: 6,
  },
  amountInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  presetPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  presetPill: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  presetPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
  },
  changeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    marginTop: 2,
  },
  changeLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  changeValue: {
    fontSize: 15,
    fontWeight: '900',
    color: '#059669',
  },
  changeValueShortage: {
    color: '#DC2626',
  },
  qrisCard: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    textAlign: 'center',
    gap: 8,
  },
  qrisIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  qrisTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  qrisSubtext: {
    fontSize: 11,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 16,
  },
  markAsPaidBtn: {
    flex: 2,
    backgroundColor: '#059669',
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  markAsPaidText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },

  // Receipt / Invoice Preview Styles
  receiptModalCard: {
    maxHeight: '92%',
  },
  receiptTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  receiptTopTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  receiptPaper: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  receiptHeader: {
    alignItems: 'center',
    paddingBottom: 12,
  },
  receiptLogoCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  receiptBrandTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 0.5,
  },
  receiptAddressText: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },
  dashedLine: {
    borderWidth: 0.8,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
    marginVertical: 12,
  },
  receiptMetaSection: {
    gap: 6,
  },
  receiptMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  receiptMetaLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  receiptMetaValue: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  receiptItemsSection: {
    gap: 6,
  },
  receiptSectionHeader: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  receiptItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  receiptItemName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
  },
  receiptItemPrice: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  receiptTotalSection: {
    gap: 8,
  },
  receiptTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  receiptTotalLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: 0.4,
  },
  receiptTotalAmount: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  receiptStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  receiptStatusLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  receiptFooter: {
    alignItems: 'center',
    paddingTop: 4,
    gap: 4,
  },
  receiptThankYou: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#1E293B',
    textAlign: 'center',
  },
  receiptSubThankYou: {
    fontSize: 9.5,
    color: '#94A3B8',
    textAlign: 'center',
  },
  printReceiptBtn: {
    flex: 2,
    backgroundColor: '#000000',
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  printReceiptBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
});