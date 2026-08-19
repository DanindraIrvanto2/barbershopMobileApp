import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import type { OrderDetailScreenProps } from '../types/navigation';

export default function OrderDetailScreen({ route, navigation }: OrderDetailScreenProps) {
  const orderId = route.params?.orderId ?? 103;
  const customerName = route.params?.customerName ?? 'Reza Rahardian';
  const status = route.params?.status ?? 'COMPLETED';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.stepIndicator}>ORDER MANAGEMENT</Text>
        <Text style={styles.title}>Order #{orderId}</Text>
        <Text style={styles.subtitle}>Detail pesanan dan status layanan kasir</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.placeholderBanner}>
          <Text style={styles.bannerBadge}>PLACEHOLDER</Text>
          <Text style={styles.bannerTitle}>Order Detail Screen</Text>
          <Text style={styles.bannerText}>
            Informasi lengkap order dari backend akan dimuat pada fase integrasi API.
          </Text>
        </View>

        {/* Order Details Card */}
        <View style={styles.detailCard}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardSectionTitle}>Informasi Order</Text>
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>{status}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Customer</Text>
            <Text style={styles.infoValue}>{customerName}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Kapster</Text>
            <Text style={styles.infoValue}>Budi Santoso (Senior)</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Waktu Check-in</Text>
            <Text style={styles.infoValue}>10:15 WIB</Text>
          </View>
        </View>

        {/* Services List */}
        <View style={styles.detailCard}>
          <Text style={styles.cardSectionTitle}>Layanan & Treatment</Text>
          
          <View style={styles.serviceItem}>
            <View>
              <Text style={styles.serviceItemName}>Premium Cut & Wash</Text>
              <Text style={styles.serviceItemSub}>Durasi: 45 Menit</Text>
            </View>
            <Text style={styles.serviceItemPrice}>Rp 90.000</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Tagihan</Text>
            <Text style={styles.totalAmount}>Rp 90.000</Text>
          </View>
        </View>

        {/* Navigation Flow Demonstration */}
        <View style={styles.flowNavCard}>
          <Text style={styles.cardSectionTitle}>Aksi Kasir:</Text>
          <TouchableOpacity
            style={styles.actionBtnPrimary}
            onPress={() => navigation.navigate('Payment', { orderId, totalAmount: 90000 })}
            activeOpacity={0.8}
          >
            <Text style={styles.actionBtnPrimaryText}>Bayar Sekarang (Ke Halaman Payment) →</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtnSecondary}
            onPress={() => navigation.navigate('InvoicePreview', { orderId, invoiceNumber: `INV-${orderId}` })}
            activeOpacity={0.8}
          >
            <Text style={styles.actionBtnSecondaryText}>Lihat Invoice Preview Langsung →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.payButton}
          onPress={() => navigation.navigate('Payment', { orderId, totalAmount: 90000 })}
          activeOpacity={0.85}
        >
          <Text style={styles.payButtonText}>BAYAR PESANAN (Rp 90.000) →</Text>
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
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  stepIndicator: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 4,
  },
  title: {
    color: '#F8FAFC',
    fontSize: 22,
    fontWeight: '800',
  },
  subtitle: {
    color: '#94A3B8',
    fontSize: 13,
    marginTop: 4,
  },
  content: {
    padding: 16,
    gap: 16,
    paddingBottom: 90,
  },
  placeholderBanner: {
    backgroundColor: '#1E293B',
    borderRadius: 10,
    padding: 14,
    borderLeftWidth: 4,
    borderLeftColor: '#38BDF8',
  },
  bannerBadge: {
    color: '#38BDF8',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 2,
  },
  bannerTitle: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '700',
  },
  bannerText: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 2,
  },
  detailCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 10,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardSectionTitle: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '700',
  },
  badgeContainer: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  badgeText: {
    color: '#065F46',
    fontSize: 11,
    fontWeight: '700',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  infoLabel: {
    color: '#94A3B8',
    fontSize: 13,
  },
  infoValue: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '600',
  },
  serviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  serviceItemName: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '600',
  },
  serviceItemSub: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 2,
  },
  serviceItemPrice: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#334155',
    marginVertical: 4,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  totalLabel: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '700',
  },
  totalAmount: {
    color: '#10B981',
    fontSize: 18,
    fontWeight: '800',
  },
  flowNavCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 10,
  },
  actionBtnPrimary: {
    backgroundColor: '#334155',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  actionBtnPrimaryText: {
    color: '#60A5FA',
    fontWeight: '600',
    fontSize: 13,
  },
  actionBtnSecondary: {
    backgroundColor: '#334155',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#475569',
  },
  actionBtnSecondaryText: {
    color: '#CBD5E1',
    fontWeight: '600',
    fontSize: 13,
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
  payButton: {
    backgroundColor: '#10B981',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
