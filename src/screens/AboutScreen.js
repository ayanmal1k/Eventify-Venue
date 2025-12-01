import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

export default function AboutScreen({ navigation }) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Enhanced background pattern */}
      <View style={styles.backgroundPattern}>
        {[...Array(40)].map((_, i) => (
          <View
            key={i}
            style={[
              styles.backgroundElement,
              {
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.08 + 0.02,
                backgroundColor: colors.primary,
                transform: [
                  { rotate: `${Math.random() * 360}deg` },
                  { scale: Math.random() * 0.8 + 0.3 }
                ],
              },
            ]}
          />
        ))}
      </View>

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border + '30' }]}>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: colors.cardBackground }]}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Text style={[styles.backIcon, { color: colors.text }]}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>About Eventify</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* App Logo and Info */}
        <View style={styles.logoContainer}>
          <View style={[styles.logoCircle, { backgroundColor: colors.primary + '15' }]}>
            <Image
              source={require('../../assets/New Eventify-Icon.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          <Text style={[styles.appName, { color: colors.text }]}>Eventify - Venue</Text>
          <Text style={[styles.tagline, { color: colors.textSecondary }]}>
            Plan Perfect Events with AI-Powered Decoration Suggestions
          </Text>
        </View>

        {/* Creators Card */}
        <View style={[styles.creatorsCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          <View style={styles.creatorsHeader}>
            <View style={[styles.creatorsIconContainer, { backgroundColor: colors.primary + '20' }]}>
              <View style={[styles.creatorIcon, { backgroundColor: colors.primary }]}>
                <Text style={styles.creatorIconText}>A</Text>
              </View>
              <View style={[styles.creatorIcon, { backgroundColor: colors.primary, marginLeft: -8 }]}>
                <Text style={styles.creatorIconText}>H</Text>
              </View>
            </View>
            <View style={styles.creatorsInfo}>
              <Text style={[styles.creatorsLabel, { color: colors.textSecondary }]}>Created by</Text>
              <Text style={[styles.creatorsNames, { color: colors.text }]}>Aman & Haniya</Text>
              <Text style={[styles.creatorsRole, { color: colors.textTertiary }]}>Mobile App Developers</Text>
            </View>
          </View>
        </View>

        {/* Mission Statement */}
        <View style={[styles.missionCard, { backgroundColor: colors.cardBackground, borderColor: colors.primary + '30' }]}>
          <LinearGradient
            colors={[colors.primary + '10', colors.primary + '05']}
            style={styles.missionGradient}
          >
            <View style={styles.missionContent}>
              <Text style={[styles.missionTitle, { color: colors.text }]}>Our Mission</Text>
              <Text style={[styles.missionText, { color: colors.textSecondary }]}>
                To simplify event planning by providing intelligent decoration suggestions that transform your vision into reality. 
                We believe every celebration deserves to be special and memorable.
              </Text>
            </View>
          </LinearGradient>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Key Features</Text>
          
          <View style={styles.featuresGrid}>
            <View style={[styles.featureCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
              <View style={[styles.featureIconContainer, { backgroundColor: '#2196F3' + '20' }]}>
                <View style={[styles.featureIconCircle, { backgroundColor: '#2196F3' }]} />
              </View>
              <Text style={[styles.featureTitle, { color: colors.text }]}>Event Proposals</Text>
              <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
                Receive booking proposals from event organizers
              </Text>
            </View>

            <View style={[styles.featureCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
              <View style={[styles.featureIconContainer, { backgroundColor: '#9C27B0' + '20' }]}>
                <View style={[styles.featureIconCircle, { backgroundColor: '#9C27B0' }]} />
              </View>
              <Text style={[styles.featureTitle, { color: colors.text }]}>Booking Management</Text>
              <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
                Accept or reject proposals with ease
              </Text>
            </View>

            <View style={[styles.featureCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
              <View style={[styles.featureIconContainer, { backgroundColor: '#FF9800' + '20' }]}>
                <View style={[styles.featureIconCircle, { backgroundColor: '#FF9800' }]} />
              </View>
              <Text style={[styles.featureTitle, { color: colors.text }]}>Direct Contact</Text>
              <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
                Call Users directly for coordination
              </Text>
            </View>

            <View style={[styles.featureCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
              <View style={[styles.featureIconContainer, { backgroundColor: '#4CAF50' + '20' }]}>
                <View style={[styles.featureIconCircle, { backgroundColor: '#4CAF50' }]} />
              </View>
              <Text style={[styles.featureTitle, { color: colors.text }]}>Smart Dashboard</Text>
              <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
                Track all bookings and venue statistics
              </Text>
            </View>
          </View>
        </View>

        {/* Build Info */}
        <View style={[styles.buildCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          <View style={styles.buildInfo}>
            <View style={styles.buildItem}>
              <Text style={[styles.buildLabel, { color: colors.textTertiary }]}>Platform</Text>
              <Text style={[styles.buildValue, { color: colors.text }]}>React Native using Expo</Text>
            </View>
            
          </View>
        </View>

        {/* Footer */}
        <View style={[styles.footer, { borderTopColor: colors.border + '40' }]}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            Crafted with passion for memorable celebrations
          </Text>
          <Text style={[styles.copyright, { color: colors.textTertiary }]}>
            © 2025 Eventify. All rights reserved.
          </Text>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundPattern: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  backgroundElement: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backIcon: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  placeholder: {
    width: 44,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  logoImage: {
    width: 80,
    height: 80,
  },
  appName: {
    fontSize: 36,
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  creatorsCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  creatorsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  creatorsIconContainer: {
    flexDirection: 'row',
    marginRight: 16,
    padding: 8,
    borderRadius: 16,
  },
  creatorIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  creatorIconText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  creatorsInfo: {
    flex: 1,
  },
  creatorsLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  creatorsNames: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 2,
  },
  creatorsRole: {
    fontSize: 14,
  },
  missionCard: {
    borderRadius: 20,
    marginBottom: 24,
    borderWidth: 2,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  missionGradient: {
    padding: 24,
  },
  missionContent: {
    alignItems: 'center',
  },
  missionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  missionText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  featuresSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: (width - 60) / 2,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  featureIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  featureIconCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  buildCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
  },
  buildInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buildItem: {
    flex: 1,
    alignItems: 'center',
  },
  buildDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E5E5E5',
    marginHorizontal: 20,
  },
  buildLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  buildValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingTop: 24,
    borderTopWidth: 1,
  },
  footerText: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  copyright: {
    fontSize: 14,
  },
  bottomSpacing: {
    height: 40,
  },
});
