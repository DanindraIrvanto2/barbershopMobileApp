import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import type { PaymentScreenProps } from '../types/navigation';

export default function PaymentScreen({ route, navigation }: PaymentScreenProps) {
  const orderId = route.params?.orderId ?? 103;
  const totalAmount = route.params?.totalAmount ?? 90000;
  const [selectedMethod, setSelectedMethod] = useState<'CASH' | 'QRIS'>('CASH');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.stepIndicator}>KASIR PAYMENT FLOW</Text>
        <Text style={styles.title}>Pembayaran Order #{orderId}</Text>
        <Text style={styles.subtitle}>Pilih metode pembayaran dan cetak bukti transaksi</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.placeholderBanner}>
          <Text style={styles.bannerBadge}>PLACEHOLDER</Text>
          <Text style={styles.bannerTitle}>Payment Screen</Text>
          <Text style={styles.bannerText}>
            Day 1: Simulasi flow navigasi. Perhitungan kembalian, input uang tunai, dan QRIS API akan diimplementasikan pada Day berikutnya.
          </Text>
        </View>

        {/* Bill Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total yang harus dibayar:</Text>
          <Text style={styles.summaryAmount}>Rp {totalAmount.toLocaleString('id-ID')}</Text>
        </View>

        {/* Payment Method Selector */}
        <Text style={styles.sectionTitle}>Pilih Metode Pembayaran (Mock)</Text>
        <View style={styles.methodGrid}>
          <TouchableOpacity
            style={[styles.methodCard, selectedMethod === 'CASH' && styles.methodCardActive]}
            onPress={() => setSelectedMethod('CASH')}
            activeOpacity={0.8}
          >
            <Text style={styles.methodIcon}>💵</Text>
            <Text style={[styles.methodTitle, selectedMethod === 'CASH' && styles.methodTitleActive]}>
              Tunai (Cash)
            </Text>
            <Text style={styles.methodSub}>Input nominal uang</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.methodCard, selectedMethod === 'QRIS' && styles.methodCardActive]}
            onPress={() => setSelectedMethod('QRIS')}
            activeOpacity={0.8}
          >
            <Text style={styles.methodIcon}>📱</Text>
            <Text style={[styles.methodTitle, selectedMethod === 'QRIS' && styles.methodTitleActive]}>
              QRIS
            </Text>
            <Text style={styles.methodSub}>Scan QR Code</Text>
          </TouchableOpacity>
        </View>

        {/* Placeholder Form Fields */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Simulasi Pembayaran {selectedMethod}:</Text>
          <View style={styles.inputMock}>
            <Text style={styles.inputMockLabel}>Nominal Uang Diterima:</Text>
            <Text style={styles.inputMockValue}>Rp 100.000 (Mock)</Text>
          </View>
          <View style={styles.inputMock}>
            <Text style={styles.inputMockLabel}>Kembalian:</Text>
            <Text style={styles.inputMockValueChange}>Rp 10.000 (Mock)</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.payCompleteButton}
          onPress={() =>
            navigation.navigate('InvoicePreview', {
              orderId,
              invoiceNumber: `INV-${orderId}`,
            })
          }
          activeOpacity={0.85}
        >
          <Text style={styles.payCompleteButtonText}>Proses Bayar & Lihat Invoice →</Text>
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
  summaryCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  summaryLabel: {
    color: '#94A3B8',
    fontSize: 13,
    marginBottom: 4,
  },
  summaryAmount: {
    color: '#10B981',
    fontSize: 28,
    fontWeight: '800',
  },
  sectionTitle: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  methodGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  methodCard: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#334155',
  },
  methodCardActive: {
    borderColor: '#3B82F6',
    backgroundColor: '#1E3A5F',
  },
  methodIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  methodTitle: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '700',
  },
  methodTitleActive: {
    color: '#FFFFFF',
  },
  methodSub: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 2,
  },
  formCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 12,
  },
  formTitle: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
  },
  inputMock: {
    backgroundColor: '#0F172A',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputMockLabel: {
    color: '#94A3B8',
    fontSize: 13,
  },
  inputMockValue: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '600',
  },
  inputMockValueChange: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: '700',
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
  payCompleteButton: {
    backgroundColor: '#10B981',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  payCompleteButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
