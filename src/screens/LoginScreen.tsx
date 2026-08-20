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
  ImageBackground,
  ScrollView,
} from 'react-native';
import type { LoginScreenProps } from '../types/navigation';
import { useAuth } from '../context/AuthContext';
import { authService } from '../api/authService';

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
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
      const data = await authService.login(inputEmail, inputPassword);
      login(data.user || { id: 1, username: inputEmail, email: inputEmail, role: 'admin' });
      navigation.replace('Orders');
    } catch (err: any) {
      console.log('Login attempt error:', err?.message);
      const msg = err.response?.data?.error || 'Email/username atau password salah';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/login-bg.jpg')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      {/* Dark Overlay untuk kontras visual dan keterbacaan */}
      <View style={styles.overlay}>
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
          <KeyboardAvoidingView
            style={styles.keyboardContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {/* Brand Header */}
              <View style={styles.brandHeader}>
                <View style={styles.logoWrapper}>
                  <Image
                    source={require('../../assets/logo.png')}
                    style={styles.logoImage}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.brandTitle}>Hairdept Barbershop.</Text>
              </View>

              {/* Form Content */}
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

                {/* Input Email / Username */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Email / Username</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Email"
                    placeholderTextColor="rgba(255, 255, 255, 0.45)"
                    value={email}
                    onChangeText={(val) => {
                      setEmail(val);
                      if (errorMsg) setErrorMsg('');
                    }}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>

                {/* Input Password */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Password</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Password"
                    placeholderTextColor="rgba(255, 255, 255, 0.45)"
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
              </View>

              {/* Footer Copyright */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>
                  © 2026 Hairdept Barbershop Management POS
                </Text>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.72)', // Dark tint overlay
  },
  container: {
    flex: 1,
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
    gap: 12,
    marginTop: Platform.OS === 'ios' ? 10 : 20,
  },
  logoWrapper: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
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
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#CBD5E1',
    lineHeight: 18,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.25)',
    borderColor: 'rgba(239, 68, 68, 0.6)',
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
    color: '#FECACA',
    fontSize: 12,
    fontWeight: '700',
    flex: 1,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  rememberMeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
    marginBottom: 22,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  checkmark: {
    color: '#000000',
    fontSize: 11,
    fontWeight: '900',
  },
  rememberMeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#E2E8F0',
  },
  submitButton: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 8,
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 11,
    fontWeight: '500',
  },
});
