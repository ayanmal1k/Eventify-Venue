import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import SettingsModal from '../components/SettingsModal';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }) {
  const [settingsVisible, setSettingsVisible] = useState(false);
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: '#f8f8ec' }]}>
      {/* Decorative dots pattern */}
      <View style={styles.dotsContainer}>
        {[...Array(100)].map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              {
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.2 + 0.05,
                backgroundColor: colors.dot,
              },
            ]}
          />
        ))}
      </View>

      {/* Header if needed in future */}
      <View style={styles.header}>
        <View style={styles.placeholder} />
        
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* App Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoWrapper}>
            <Image
              source={require('../../assets/New Eventify-Icon.png')}
              style={styles.logoIcon}
              resizeMode="contain"
            />
          </View>
          <Text style={[styles.appName, { color: colors.primary }]}>Eventify</Text>
        </View>

        {/* Welcome Message */}
        <View style={styles.welcomeContainer}>
          <Text style={[styles.welcomeTitle, { color: colors.text }]}>
            Welcome to Eventify Venues
          </Text>
          <Text style={[styles.welcomeSubtitle, { color: colors.textSecondary }]}>
            Manage your venue and bookings
          </Text>
        </View>

        {/* Authentication Buttons */}
        <View style={styles.authContainer}>
          <TouchableOpacity
            style={styles.signUpButton}
            onPress={() => navigation.navigate('SignUp')}
          >
            <LinearGradient
              colors={[colors.primary, colors.primaryDark]}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.signUpButtonText}>Create Account</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.signInButton, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={[styles.signInButtonText, { color: colors.text }]}>Sign In</Text>
          </TouchableOpacity>
        </View>

      </View>
      
      <SettingsModal
        visible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
        navigation={navigation}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dotsContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  dot: {
    position: 'absolute',
    width: 2,
    height: 2,
    borderRadius: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  placeholder: {
    width: 40,
  },
  settingsButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsIcon: {
    fontSize: 24,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logoWrapper: {
    width: 100,
    height: 100,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
  },
  logoIcon: {
    width: 100,
    height: 100,
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  welcomeSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
  },
  authContainer: {
    width: '100%',
    marginBottom: 40,
  },
  signUpButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 5,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  signUpButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937', // Dark text for Golden Field background
  },
  signInButton: {
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
  },
  signInButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  featuresContainer: {
    alignItems: 'center',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  featureText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
