import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import type { ServiceSelectionScreenProps } from '../types/navigation';

export default function ServiceSelectionScreen({ navigation }: ServiceSelectionScreenProps) {
  const dummyServices = [
    { id: 1, name: 'Haircut Regular', duration: '30 min', price: 'Rp 45.000' },
    { id: 2, name: 'Haircut + Styling / Pomade', duration: '40 min', price: 'Rp 55.000' },
    { id: 3, name: 'Gentleman Shaving', duration: '20 min', price: 'Rp 30.000' },
    { id: 4, name: 'Complete Package (Cut + Shave + Wash)', duration: '60 min', price: 'Rp 85.000' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.stepIndicator}>STEP 3 OF 3</Text>
        <Text style={styles.title}>Pilih Layanan / Service</Text>
        <Text style={styles.subtitle}>Pilih paket treatment yang diinginkan pelanggan</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.placeholderBanner}>
          <Text style={styles.bannerBadge}>PLACEHOLDER</Text>
          <Text style={styles.bannerTitle}>Service Selection</Text>
          <Text style={styles.bannerText}>
            Daftar paket layanan dan multi-select akan diintegrasikan pada Day berikutnya.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Pilihan Layanan:</Text>
        {dummyServices.map((srv) => (
          <TouchableOpacity
            key={srv.id}
            style={styles.serviceCard}
            onPress={() => navigation.navigate('NewOrder')}
            activeOpacity={0.7}
          >
            <View style={styles.serviceIcon}>
              <Text style={styles.serviceIconText}>{srv.name[0]}</Text>
            </View>
            <View style={styles.srvInfo}>
              <Text style={styles.srvName}>{srv.name}</Text>
              <Text style={styles.srvDuration}>Durasi: {srv.duration}</Text>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.srvPrice}>{srv.price}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => navigation.navigate('NewOrder')}
          activeOpacity={0.85}
        >
          <Text style={styles.nextButtonText}>Konfirmasi Order →</Text>
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
    borderLeftColor: '#10B981',
    marginBottom: 8,
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
  sectionTitle: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginTop: 6,
  },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  serviceIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  serviceIconText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  srvInfo: {
    flex: 1,
  },
  srvName: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
  },
  srvDuration: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 2,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  srvPrice: {
    color: '#10B981',
    fontWeight: '700',
    fontSize: 14,
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
