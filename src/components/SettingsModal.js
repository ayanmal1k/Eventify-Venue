import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Modal,
  Dimensions,
} from 'react-native';
// import { Ionicons } from '@expo/vector-icons'; // Temporarily commented out
import { useTheme } from '../context/ThemeContext';

const { height } = Dimensions.get('window');

export default function SettingsModal({ visible, onClose, navigation }) {
  const { isDarkMode, toggleTheme, colors } = useTheme();

  const handleAbout = () => {
    onClose();
    navigation.navigate('About');
  };

  const handleFAQ = () => {
    onClose();
    navigation.navigate('FAQ');
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.cardBackground }]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={[styles.closeIcon, { color: colors.textSecondary }]}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {/* Appearance Section */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                APPEARANCE
              </Text>

              <View style={[styles.settingItem, { backgroundColor: colors.background, borderColor: colors.border }]}>
                <View style={styles.settingLeft}>
                  <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
                    <Text style={[styles.optionIcon, { color: colors.primary }]}>
                      {isDarkMode ? '🌙' : '☀️'}
                    </Text>
                  </View>
                  <View style={styles.settingInfo}>
                    <Text style={[styles.settingTitle, { color: colors.text }]}>
                      {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                    </Text>
                    <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
                      {isDarkMode ? 'Dark theme is active' : 'Light theme is active'}
                    </Text>
                  </View>
                </View>
                <Switch
                  value={isDarkMode}
                  onValueChange={toggleTheme}
                  trackColor={{ false: '#D1D5DB', true: colors.primary }}
                  thumbColor="#FFFFFF"
                  ios_backgroundColor="#D1D5DB"
                />
              </View>
            </View>

            {/* FAQ Section */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                HELP
              </Text>

              <TouchableOpacity
                style={[styles.settingItem, { backgroundColor: colors.background, borderColor: colors.border }]}
                onPress={handleFAQ}
                activeOpacity={0.7}
              >
                <View style={styles.settingLeft}>
                  <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
                    <Text style={[styles.optionIcon, { color: colors.primary }]}>❓</Text>
                  </View>
                  <View style={styles.settingInfo}>
                    <Text style={[styles.settingTitle, { color: colors.text }]}>
                      FAQ & Help
                    </Text>
                    <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
                      Find answers to common questions
                    </Text>
                  </View>
                </View>
                <Text style={[styles.chevron, { color: colors.textSecondary }]}>›</Text>
              </TouchableOpacity>
            </View>

            {/* About Section */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                ABOUT
              </Text>

              <TouchableOpacity
                style={[styles.settingItem, { backgroundColor: colors.background, borderColor: colors.border }]}
                onPress={handleAbout}
                activeOpacity={0.7}
              >
                <View style={styles.settingLeft}>
                  <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
                    <Text style={[styles.optionIcon, { color: colors.primary }]}>ℹ️</Text>
                  </View>
                  <View style={styles.settingInfo}>
                    <Text style={[styles.settingTitle, { color: colors.text }]}>
                      About Eventify
                    </Text>
                    <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
                      Version & Creator info
                    </Text>
                  </View>
                </View>
                <Text style={[styles.chevron, { color: colors.textSecondary }]}>›</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.bottomSpacing} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    height: height * 0.8,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(124, 58, 237, 0.1)',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
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
  bottomSpacing: {
    height: 40,
  },
  closeIcon: {
    fontSize: 28,
  },
  optionIcon: {
    fontSize: 24,
  },
  chevron: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
