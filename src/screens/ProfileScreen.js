import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import BottomNavigation from '../components/BottomNavigation';
import { useTheme } from '../context/ThemeContext';
import { useSession } from '../context/AuthContext';

export default function ProfileScreen({ navigation }) {
  const { colors, toggleTheme, isDarkMode } = useTheme();
  const { user, userProfile, userEvents, signOut } = useSession();

  const settings = [
    { id: 1, icon: require('../../assets/Icons/user.png'), title: 'Edit Profile', subtitle: 'Update your information', action: 'edit' },
    { id: 2, icon: require('../../assets/Icons/painting.png'), title: 'Appearance', subtitle: isDarkMode ? 'Dark mode' : 'Light mode', action: 'appearance' },
    { id: 3, icon: require('../../assets/Icons/information-button.png'), title: 'About', subtitle: 'App version and creator', action: 'about' },
  ];

  const handleSettingPress = (action) => {
    if (action === 'appearance') {
      toggleTheme();
    } else if (action === 'about') {
      navigation.navigate('About');
    } else if (action === 'edit') {
      navigation.navigate('EditProfile');
    } else if (action === 'faq') {
      navigation.navigate('FAQ');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
            } catch (error) {
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ]
    );
  };

  // Get user's initials for avatar
  const getUserInitials = () => {
    if (userProfile?.venueName) {
      return userProfile.venueName
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }
    if (user?.displayName) {
      return user.displayName
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  // Use preloaded data from context
  const venueName = userProfile?.venueName || 'My Venue';
  const ownerName = userProfile?.name || user?.displayName || 'User';
  const eventsCount = userEvents?.length || 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
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

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Profile</Text>
          
        </View>

        {/* Profile Card - using preloaded data */}
        <View style={[styles.profileCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          <View style={styles.avatarContainer}>
            <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
              <Text style={styles.avatarText}>{getUserInitials()}</Text>
            </View>
            <TouchableOpacity style={[styles.editAvatarButton, { backgroundColor: colors.primaryDark, borderColor: colors.cardBackground }]}>
              <Image
                source={require('../../assets/Icons/user.png')}
                style={styles.cameraIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
          <Text style={[styles.userName, { color: colors.text }]}>
            {venueName}
          </Text>
          <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
            {user?.email || 'No email'}
          </Text>
          
          <View style={[styles.statsContainer, { borderTopColor: colors.border }]}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.primary }]}>
                {eventsCount}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Event{eventsCount !== 1 ? 's' : ''}
              </Text>
            </View>
          </View>
        </View>

        {/* Settings List */}
        <View style={styles.settingsList}>
          {settings.map((setting) => (
            <TouchableOpacity
              key={setting.id}
              style={[styles.settingItem, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
              activeOpacity={0.7}
              onPress={() => handleSettingPress(setting.action)}
            >
              <View style={[styles.settingIcon, { backgroundColor: colors.primary + '20' }]}>
                <Image
                  source={setting.icon}
                  style={[styles.settingIconImage, { tintColor: colors.primary }]}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>{setting.title}</Text>
                <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>{setting.subtitle}</Text>
              </View>
              <Text style={[styles.chevron, { color: colors.textSecondary }]}>›</Text>
            </TouchableOpacity>
          ))}

          {/* FAQ Button */}
          <TouchableOpacity
            style={[styles.settingItem, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
            activeOpacity={0.7}
            onPress={() => handleSettingPress('faq')}
          >
            <View style={[styles.settingIcon, { backgroundColor: colors.primary + '20' }]}>
              <Image
                source={require('../../assets/Icons/qa.png')}
                style={[styles.settingIconImage, { tintColor: colors.primary }]}
                resizeMode="contain"
              />
            </View>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>FAQ & Help</Text>
              <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>Find answers to common questions</Text>
            </View>
            <Text style={[styles.chevron, { color: colors.textSecondary }]}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Image
            source={require('../../assets/Icons/logout.png')}
            style={styles.logoutIcon}
            resizeMode="contain"
          />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      <BottomNavigation navigation={navigation} currentRoute="Profile" />
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
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  settingsButton: {
    padding: 4,
  },
  profileCard: {
    marginHorizontal: 24,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    marginBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#1F2937', // Dark text for Golden Field background
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  settingsList: {
    paddingHorizontal: 24,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  settingIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  settingSubtitle: {
    fontSize: 13,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 24,
    marginTop: 12,
    padding: 16,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
    marginLeft: 8,
  },
  bottomSpacing: {
    height: 20,
  },
  settingsIcon: {
    width: 24,
    height: 24,
  },
  cameraIcon: {
    width: 16,
    height: 16,
    tintColor: '#FFFFFF',
  },
  settingIconImage: {
    width: 24,
    height: 24,
  },
  chevron: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  logoutIcon: {
    width: 20,
    height: 20,
    tintColor: '#EF4444',
  },
});
