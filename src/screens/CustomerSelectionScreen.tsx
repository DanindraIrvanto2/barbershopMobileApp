import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import type { CustomerSelectionScreenProps } from '../types/navigation';

export default function CustomerSelectionScreen({ navigation }: CustomerSelectionScreenProps) {
  const dummyCustomers = [
    { id: 1, name: 'Ahmad Faiz', phone: '08123456789' },
    { id: 2, name: 'Dimas Pratama', phone: '08219876543' },
    { id: 3, name: 'Reza Rahardian', phone: '085711223344' },
    { id: 4, name: 'Bambang Pamungkas', phone: '081399887766' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.stepIndicator}>STEP 1 OF 3</Text>
        <Text style={styles.title}>Pilih Customer</Text>
        <Text style={styles.subtitle}>Pilih pelanggan yang sudah terdaftar atau buat baru</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.placeholderBanner}>
          <Text style={styles.bannerBadge}>PLACEHOLDER</Text>
          <Text style={styles.bannerTitle}>Customer Selection</Text>
          <Text style={styles.bannerText}>
            Fitur pencarian dan input customer akan diintegrasikan pada Day berikutnya.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Pilih Contoh Pelanggan:</Text>
        {dummyCustomers.map((cust) => (
          <TouchableOpacity
            key={cust.id}
            style={styles.customerCard}
            onPress={() => navigation.navigate('KapsterSelection')}
            activeOpacity={0.7}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{cust.name[0]}</Text>
            </View>
            <View style={styles.custInfo}>
              <Text style={styles.custName}>{cust.name}</Text>
              <Text style={styles.custPhone}>📱 {cust.phone}</Text>
            </View>
            <Text style={styles.selectText}>Pilih →</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => navigation.navigate('KapsterSelection')}
          activeOpacity={0.85}
        >
          <Text style={styles.nextButtonText}>Lanjut ke Pilih Kapster →</Text>
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
    gap: 12,
    paddingBottom: 90,
  },
  placeholderBanner: {
    backgroundColor: '#1E293B',
    borderRadius: 10,
    padding: 14,
    borderLeftWidth: 4,
    borderLeftColor: '#38BDF8',
    marginBottom: 8,
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
  sectionTitle: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginTop: 6,
  },
  customerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  custInfo: {
    flex: 1,
  },
  custName: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '700',
  },
  custPhone: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 2,
  },
  selectText: {
    color: '#38BDF8',
    fontWeight: '700',
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
  nextButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
