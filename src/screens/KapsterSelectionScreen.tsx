import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import type { KapsterSelectionScreenProps } from '../types/navigation';

export default function KapsterSelectionScreen({ navigation }: KapsterSelectionScreenProps) {
  const dummyKapsters = [
    { id: 1, name: 'Budi Santoso', role: 'Senior Barber', available: true },
    { id: 2, name: 'Rian Pratama', role: 'Barber Specialist', available: true },
    { id: 3, name: 'Doni Saputra', role: 'Junior Barber', available: false },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.stepIndicator}>STEP 2 OF 3</Text>
        <Text style={styles.title}>Pilih Kapster</Text>
        <Text style={styles.subtitle}>Pilih kapster yang bertugas menangani pelanggan</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.placeholderBanner}>
          <Text style={styles.bannerBadge}>PLACEHOLDER</Text>
          <Text style={styles.bannerTitle}>Kapster Selection</Text>
          <Text style={styles.bannerText}>
            Daftar kapster aktif dan availability akan diambil dari API pada Day berikutnya.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Pilih Kapster:</Text>
        {dummyKapsters.map((kap) => (
          <TouchableOpacity
            key={kap.id}
            style={styles.kapsterCard}
            onPress={() => navigation.navigate('ServiceSelection')}
            activeOpacity={0.7}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{kap.name[0]}</Text>
            </View>
            <View style={styles.kapInfo}>
              <Text style={styles.kapName}>{kap.name}</Text>
              <Text style={styles.kapRole}>{kap.role}</Text>
            </View>
            <View style={[styles.statusTag, { backgroundColor: kap.available ? '#065F46' : '#7F1D1D' }]}>
              <Text style={styles.statusTagText}>
                {kap.available ? 'Ready' : 'Busy'}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => navigation.navigate('ServiceSelection')}
          activeOpacity={0.85}
        >
          <Text style={styles.nextButtonText}>Lanjut ke Pilih Service →</Text>
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
    borderLeftColor: '#F59E0B',
    marginBottom: 8,
  },
  bannerBadge: {
    color: '#F59E0B',
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
  kapsterCard: {
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
    backgroundColor: '#0284C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  kapInfo: {
    flex: 1,
  },
  kapName: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '700',
  },
  kapRole: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 2,
  },
  statusTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusTagText: {
    color: '#FFFFFF',
    fontSize: 11,
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
