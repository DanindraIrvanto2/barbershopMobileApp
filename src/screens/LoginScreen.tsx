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
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';

export default function LoginScreen() {
  const { user, login, logout } = useAuth();
  const [email, setEmail] = useState('admin@hairdept.com');
  const [password, setPassword] = useState('admin123');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async () => {
    setErrorMsg('');
    const inputEmail = email.trim();
    const inputPassword = password.trim();

    if (!inputEmail || !inputPassword) {
      setErrorMsg('Email/Username dan Password wajib diisi');
      return;
    }

    setLoading(true);
    try {
      // 1. Coba request ke API backend asli
      const data = await authService.login(inputEmail, inputPassword);
      login(data.user || { id: 1, username: inputEmail, email: inputEmail, role: 'admin' });
      Alert.alert('Login Berhasil', data.message || 'Selamat datang kembali!');
    } catch (err: any) {
      console.log('Login attempt error:', err?.message);

      // 2. Fallback jika server backend lokal belum dinyalakan atau kredensial default admin
      const isDemoUser =
        inputEmail === 'admin' ||
        inputEmail === 'admin@hairdept.com' ||
        inputEmail === 'kasir' ||
        inputEmail === 'kasir@hairdept.com';

      const isDemoPassword =
        inputPassword === 'admin123' ||
        inputPassword === 'password123' ||
        inputPassword === 'admin';

      if (isDemoUser && isDemoPassword) {
        login({
          id: 1,
          username: inputEmail.includes('@') ? inputEmail.split('@')[0] : inputEmail,
          email: inputEmail.includes('@') ? inputEmail : `${inputEmail}@hairdept.com`,
          role: 'admin',
        });
        Alert.alert('Login Berhasil', `Selamat datang kembali, ${inputEmail}!`);
      } else {
        const msg = err.response?.data?.error || 'Email/username atau password salah';
        setErrorMsg(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    setEmail('admin@hairdept.com');
    setPassword('admin123');
    setErrorMsg('');
  };

  const fillDemoAccount = () => {
    setEmail('admin@hairdept.com');
    setPassword('admin123');
    setErrorMsg('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Brand Header */}
          <View style={styles.brandHeader}>
            <View style={styles.logoWrapper}>
              <Image
                source={require('../../assets/logo.png')}
                style={styles.logoImage}
                resizeMode="cover"
              />
            </View>
            <Text style={styles.brandTitle}>Hairdept Barbershop.</Text>
          </View>

          {/* Conditional: Form Login vs Akun Sedang Aktif */}
          {!user ? (
            <View style={styles.formContainer}>
              {/* Heading */}
              <View style={styles.headingBox}>
                <Text style={styles.mainTitle}>Log in to your account</Text>
                <Text style={styles.subTitle}>
                  Enter your email or username and password below to log in
                </Text>
              </View>

              {/* Error Message Box */}
              {errorMsg ? (
                <View style={styles.errorBanner}>
                  <Text style={styles.errorIcon}>⚠️</Text>
                  <Text style={styles.errorText}>{errorMsg}</Text>
                </View>
              ) : null}

              {/* Input Fields */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email / Username</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Email"
                  placeholderTextColor="#94A3B8"
                  value={email}
                  onChangeText={(val) => {
                    setEmail(val);
                    if (errorMsg) setErrorMsg('');
                  }}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Password</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Password"
                  placeholderTextColor="#94A3B8"
                  value={password}
                  onChangeText={(val) => {
                    setPassword(val);
                    if (errorMsg) setErrorMsg('');
                  }}
                  secureTextEntry
                />
              </View>

              {/* Remember Me Toggle */}
              <TouchableOpacity
                style={styles.rememberMeRow}
                onPress={() => setRememberMe(!rememberMe)}
                activeOpacity={0.7}
              >
                <View style={[styles.checkbox, rememberMe && styles.checkboxActive]}>
                  {rememberMe && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.rememberMeText}>Remember me</Text>
              </TouchableOpacity>

              {/* Submit Button */}
              <TouchableOpacity
                style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                onPress={handleLogin}
                activeOpacity={0.85}
                disabled={loading}
              >
                <Text style={styles.submitButtonText}>
                  {loading ? 'Logging in...' : 'Log in'}
                </Text>
              </TouchableOpacity>

              {/* Quick Fill Demo */}
              <TouchableOpacity
                style={styles.quickFillBtn}
                onPress={fillDemoAccount}
                activeOpacity={0.7}
              >
                <Text style={styles.quickFillText}>
                  💡 Akun Bawaan: admin@hairdept.com / admin123
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.activeContainer}>
              <View style={styles.activeCard}>
                <View style={styles.activeBadge}>
                  <Text style={styles.activeBadgeText}>LOGGED IN</Text>
                </View>
                <Text style={styles.activeTitle}>Akun Kasir Sedang Aktif</Text>
                <Text style={styles.activeSubtitle}>
                  Selamat datang kembali di Hairdept Barbershop!
                </Text>

                <View style={styles.profileBox}>
                  <View style={styles.profileRow}>
                    <Text style={styles.profileLabel}>Username</Text>
                    <Text style={styles.profileValue}>{user.username}</Text>
                  </View>
                  <View style={styles.profileDivider} />
                  <View style={styles.profileRow}>
                    <Text style={styles.profileLabel}>Email</Text>
                    <Text style={styles.profileValue}>{user.email}</Text>
                  </View>
                  <View style={styles.profileDivider} />
                  <View style={styles.profileRow}>
                    <Text style={styles.profileLabel}>Role</Text>
                    <Text style={styles.profileRole}>{user.role || 'Admin'}</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.logoutButton}
                  onPress={handleLogout}
                  activeOpacity={0.85}
                >
                  <Text style={styles.logoutButtonText}>Log out dari Akun</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Footer Copyright */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>© 2026 Hairdept Barbershop Management POS</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    paddingVertical: 24,
  },
  brandHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: Platform.OS === 'ios' ? 8 : 16,
  },
  logoWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  formContainer: {
    marginVertical: 'auto',
    paddingVertical: 20,
    width: '100%',
  },
  headingBox: {
    marginBottom: 24,
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    lineHeight: 18,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  errorIcon: {
    fontSize: 14,
  },
  errorText: {
    color: '#B91C1C',
    fontSize: 12,
    fontWeight: '700',
    flex: 1,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
  },
  rememberMeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
    marginBottom: 20,
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
    fontSize: 11,
    fontWeight: '800',
  },
  rememberMeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  submitButton: {
    backgroundColor: '#000000',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  quickFillBtn: {
    marginTop: 16,
    paddingVertical: 10,
    alignItems: 'center',
  },
  quickFillText: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '600',
  },
  activeContainer: {
    marginVertical: 'auto',
    paddingVertical: 20,
    width: '100%',
  },
  activeCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  activeBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: 12,
  },
  activeBadgeText: {
    color: '#15803D',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  activeTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  activeSubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
  },
  profileBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    width: '100%',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
  },
  profileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  profileLabel: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '600',
  },
  profileValue: {
    color: '#0F172A',
    fontSize: 13,
    fontWeight: '700',
  },
  profileRole: {
    color: '#2563EB',
    fontSize: 12,
    fontWeight: '800',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  profileDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 6,
  },
  logoutButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  footer: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 8,
  },
  footerText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '500',
  },
});
