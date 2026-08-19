import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import type { NewOrderScreenProps } from '../types/navigation';

export default function NewOrderScreen({ navigation }: NewOrderScreenProps) {
  const handleConfirmOrder = () => {
    Alert.alert(
      'Konfirmasi Order (Day 1 Mock)',
      'Order berhasil disimulasikan! Status order awal: WAITING',
      [
        {
          text: 'Kembali ke Antrean',
          onPress: () => navigation.navigate('Orders'),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.stepIndicator}>RINGKASAN & KONFIRMASI</Text>
        <Text style={styles.title}>New Order / Check-in</Text>
        <Text style={styles.subtitle}>Konfirmasi pesanan baru sebelum masuk antrean WAITING</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.placeholderBanner}>
          <Text style={styles.bannerBadge}>PLACEHOLDER / FLOW COMPLETE</Text>
          <Text style={styles.bannerTitle}>Review New Order</Text>
          <Text style={styles.bannerText}>
            Day 1: Simulasi flow + navigation. Belum ada API create order yang dipanggil.
          </Text>
        </View>

        {/* Wizard Steps Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.cardTitle}>Detail Order Baru</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>👤 Customer</Text>
            <TouchableOpacity onPress={() => navigation.navigate('CustomerSelection')}>
              <Text style={styles.detailValueAction}>Ahmad Faiz (Ubah)</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>✂️ Kapster</Text>
            <TouchableOpacity onPress={() => navigation.navigate('KapsterSelection')}>
              <Text style={styles.detailValueAction}>Budi Santoso (Ubah)</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>💈 Layanan</Text>
            <TouchableOpacity onPress={() => navigation.navigate('ServiceSelection')}>
              <Text style={styles.detailValueAction}>Haircut Regular (Ubah)</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>⏱ Check-in Time</Text>
            <Text style={styles.detailValue}>09:30 WIB</Text>
          </View>

          <View style={[styles.detailRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Status Awal</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusBadgeText}>WAITING</Text>
            </View>
          </View>
        </View>

        {/* Direct Navigation Links for quick testing */}
        <View style={styles.navLinksCard}>
          <Text style={styles.cardTitle}>Navigasi Cepat Step New Order:</Text>
          <TouchableOpacity
            style={styles.stepNavLink}
            onPress={() => navigation.navigate('CustomerSelection')}
          >
            <Text style={styles.stepNavLinkText}>1. Step Customer Selection →</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.stepNavLink}
            onPress={() => navigation.navigate('KapsterSelection')}
          >
            <Text style={styles.stepNavLinkText}>2. Step Kapster Selection →</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.stepNavLink}
            onPress={() => navigation.navigate('ServiceSelection')}
          >
            <Text style={styles.stepNavLinkText}>3. Step Service Selection →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleConfirmOrder}
          activeOpacity={0.85}
        >
          <Text style={styles.confirmButtonText}>Konfirmasi & Simpan Antrean</Text>
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
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 12,
  },
  cardTitle: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  detailLabel: {
    color: '#94A3B8',
    fontSize: 14,
  },
  detailValue: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '600',
  },
  detailValueAction: {
    color: '#38BDF8',
    fontSize: 14,
    fontWeight: '600',
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  totalLabel: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '700',
  },
  statusBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  statusBadgeText: {
    color: '#92400E',
    fontSize: 12,
    fontWeight: '700',
  },
  navLinksCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 8,
  },
  stepNavLink: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  stepNavLinkText: {
    color: '#38BDF8',
    fontSize: 14,
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
  confirmButton: {
    backgroundColor: '#10B981',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
