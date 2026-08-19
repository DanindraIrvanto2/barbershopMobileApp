import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import type { InvoicePreviewScreenProps } from '../types/navigation';

export default function InvoicePreviewScreen({ route, navigation }: InvoicePreviewScreenProps) {
  const orderId = route.params?.orderId ?? 103;
  const invoiceNumber = route.params?.invoiceNumber ?? `INV-103`;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.stepIndicator}>STRUK / BUKTI TRANSAKSI</Text>
        <Text style={styles.title}>Invoice #{invoiceNumber}</Text>
        <Text style={styles.subtitle}>Pratinjau tanda terima pembayaran</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.placeholderBanner}>
          <Text style={styles.bannerBadge}>PLACEHOLDER / PAYMENT SUCCESS</Text>
          <Text style={styles.bannerTitle}>Invoice Preview Screen</Text>
          <Text style={styles.bannerText}>
            Day 1: Simulasi flow struk kasir. Fitur download/print struk akan disesuaikan pada kebutuhan lanjutan.
          </Text>
        </View>

        {/* Receipt Paper Design */}
        <View style={styles.receiptContainer}>
          <View style={styles.receiptHeader}>
            <Text style={styles.shopName}>💈 HAIRDEPT BARBERSHOP</Text>
            <Text style={styles.shopAddress}>Jl. Barbershop No. 123, Jakarta</Text>
            <Text style={styles.shopContact}>Telp: 0812-3456-7890</Text>
          </View>

          <View style={styles.receiptDivider} />

          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>No. Invoice:</Text>
            <Text style={styles.receiptValue}>{invoiceNumber}</Text>
          </View>
          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>No. Order:</Text>
            <Text style={styles.receiptValue}>#ORD-{orderId}</Text>
          </View>
          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Customer:</Text>
            <Text style={styles.receiptValue}>Reza Rahardian</Text>
          </View>
          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Kapster:</Text>
            <Text style={styles.receiptValue}>Budi Santoso</Text>
          </View>
          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Status Tagihan:</Text>
            <Text style={styles.paidBadge}>LUNAS (PAID)</Text>
          </View>

          <View style={styles.receiptDivider} />

          <View style={styles.receiptItem}>
            <Text style={styles.receiptItemName}>1x Premium Cut & Wash</Text>
            <Text style={styles.receiptItemPrice}>Rp 90.000</Text>
          </View>

          <View style={styles.receiptDivider} />

          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabelBold}>Total Biaya:</Text>
            <Text style={styles.receiptValueBold}>Rp 90.000</Text>
          </View>
          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Metode Bayar:</Text>
            <Text style={styles.receiptValue}>Tunai (Cash)</Text>
          </View>
          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Nominal Diterima:</Text>
            <Text style={styles.receiptValue}>Rp 100.000</Text>
          </View>
          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Kembalian:</Text>
            <Text style={styles.receiptValue}>Rp 10.000</Text>
          </View>

          <View style={styles.receiptDivider} />

          <Text style={styles.receiptFooterText}>
            Terima kasih atas kunjungan Anda!{'\n'}Silakan datang kembali.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.doneButton}
          onPress={() => navigation.navigate('Orders')}
          activeOpacity={0.85}
        >
          <Text style={styles.doneButtonText}>Selesai & Kembali ke Antrean</Text>
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
    color: '#10B981',
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
    borderLeftColor: '#10B981',
  },
  bannerBadge: {
    color: '#10B981',
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
  receiptContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  receiptHeader: {
    alignItems: 'center',
    marginBottom: 12,
  },
  shopName: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  shopAddress: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 2,
  },
  shopContact: {
    color: '#64748B',
    fontSize: 12,
  },
  receiptDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 10,
    borderStyle: 'dashed',
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  receiptLabel: {
    color: '#64748B',
    fontSize: 13,
  },
  receiptValue: {
    color: '#0F172A',
    fontSize: 13,
    fontWeight: '600',
  },
  receiptLabelBold: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '700',
  },
  receiptValueBold: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '800',
  },
  paidBadge: {
    color: '#059669',
    fontWeight: '800',
    fontSize: 13,
  },
  receiptItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  receiptItemName: {
    color: '#0F172A',
    fontSize: 13,
    fontWeight: '600',
  },
  receiptItemPrice: {
    color: '#0F172A',
    fontSize: 13,
    fontWeight: '700',
  },
  receiptFooterText: {
    color: '#94A3B8',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 4,
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
  doneButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  doneButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
