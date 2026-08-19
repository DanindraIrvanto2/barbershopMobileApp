import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const { user, login, logout } = useAuth();
  const [email, setEmail] = useState('kasir@hairdept.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Perhatian', 'Email/Username dan Password wajib diisi');
      return;
    }

    setLoading(true);

    // Simulasi autentikasi
    setTimeout(() => {
      login({
        id: 1,
        username: email.includes('@') ? email.split('@')[0] : email,
        email: email,
        role: 'kasir',
      });
      setLoading(false);
      Alert.alert('Login Berhasil! 🎉', `Selamat datang, ${email.split('@')[0]}!`);
    }, 400);
  };

  const handleLogout = () => {
    logout();
    Alert.alert('Logout', 'Anda telah keluar dari akun kasir.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.innerContainer}>
          {/* Logo & Header */}
          <View style={styles.header}>
            <View style={styles.logoBadge}>
              <Text style={styles.logoBadgeText}>HD</Text>
            </View>
            <Text style={styles.appTitle}>Hairdept Barbershop</Text>
            <Text style={styles.appSubtitle}>PORTAL KASIR MOBILE</Text>
          </View>

          {/* Conditional Card: Form Login vs Status Kasir Aktif */}
          {!user ? (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Masuk ke Akun Kasir</Text>
              <Text style={styles.cardSubtitle}>
                Masukkan kredensial akun kasir untuk mulai bertugas
              </Text>

              {/* Input Email / Username */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email atau Username</Text>
                <TextInput
                  style={styles.input}
                  placeholder="kasir@hairdept.com"
                  placeholderTextColor="#64748B"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>

              {/* Input Password */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor="#64748B"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>

              {/* Tombol Login */}
              <TouchableOpacity
                style={[styles.loginButton, loading && styles.loginButtonDisabled]}
                onPress={handleLogin}
                activeOpacity={0.85}
                disabled={loading}
              >
                <Text style={styles.loginButtonText}>
                  {loading ? 'Memproses...' : 'Masuk ke Kasir →'}
                </Text>
              </TouchableOpacity>

              {/* Box Info Demo */}
              <View style={styles.demoBox}>
                <Text style={styles.demoTitle}>Akun Demo Kasir:</Text>
                <Text style={styles.demoText}>Email: kasir@hairdept.com</Text>
                <Text style={styles.demoText}>Pass: password123</Text>
              </View>
            </View>
          ) : (
            <View style={styles.card}>
              <View style={styles.activeUserHeader}>
                <View style={styles.activeAvatar}>
                  <Text style={styles.activeAvatarText}>
                    {user.username ? user.username[0].toUpperCase() : 'K'}
                  </Text>
                </View>
                <Text style={styles.activeTitle}>Akun Kasir Sedang Aktif</Text>
                <Text style={styles.activeSubtitle}>
                  Anda saat ini sedang login sebagai kasir terverifikasi.
                </Text>
              </View>

              <View style={styles.infoBox}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Username:</Text>
                  <Text style={styles.infoValue}>{user.username}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Email:</Text>
                  <Text style={styles.infoValue}>{user.email}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Role Akses:</Text>
                  <Text style={styles.infoValueBadge}>{user.role?.toUpperCase() || 'KASIR'}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
                activeOpacity={0.85}
              >
                <Text style={styles.logoutButtonText}>Keluar / Logout Akun</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  keyboardContainer: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  logoBadgeText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 1,
  },
  appTitle: {
    color: '#F8FAFC',
    fontSize: 24,
    fontWeight: '800',
  },
  appSubtitle: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginTop: 4,
  },
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  cardTitle: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '700',
  },
  cardSubtitle: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 4,
    marginBottom: 18,
    lineHeight: 18,
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    color: '#CBD5E1',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#0F172A',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#F8FAFC',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  demoBox: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#0F172A',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#38BDF8',
  },
  demoTitle: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 2,
  },
  demoText: {
    color: '#94A3B8',
    fontSize: 12,
  },
  activeUserHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  activeAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  activeAvatarText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
  },
  activeTitle: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '700',
  },
  activeSubtitle: {
    color: '#94A3B8',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  infoBox: {
    backgroundColor: '#0F172A',
    borderRadius: 10,
    padding: 14,
    gap: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    color: '#64748B',
    fontSize: 13,
  },
  infoValue: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '600',
  },
  infoValueBadge: {
    color: '#10B981',
    fontWeight: '700',
    fontSize: 12,
  },
  logoutButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
