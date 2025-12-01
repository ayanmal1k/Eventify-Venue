import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Linking,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { userService } from '../services/firestoreService';

const { width, height } = Dimensions.get('window');

export default function EventDetailsModal({ visible, event, onClose, onEdit, onDelete }) {
  const { colors } = useTheme();
  const [userName, setUserName] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [loadingUserData, setLoadingUserData] = useState(false);

  // Fetch user data when modal becomes visible or event changes
  useEffect(() => {
    if (visible && event?.userId) {
      fetchUserData(event.userId);
    }
  }, [visible, event?.userId]);

  // Function to fetch user data from users collection
  const fetchUserData = async (userId) => {
    try {
      setLoadingUserData(true);
      const userData = await userService.getUserData(userId);
      if (userData) {
        setUserName(userData.name);
        setPhoneNumber(userData.phoneNumber);
      } else {
        setUserName(null);
        setPhoneNumber(null);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUserName(null);
      setPhoneNumber(null);
    } finally {
      setLoadingUserData(false);
    }
  };

  // Function to handle contact button click
  const handleContactPress = () => {
    if (!phoneNumber) {
      Alert.alert('No Phone Number', 'Phone number is not available for this user.');
      return;
    }

    const phoneUrl = `tel:${phoneNumber}`;
    Linking.canOpenURL(phoneUrl)
      .then((supported) => {
        if (supported) {
          Linking.openURL(phoneUrl);
        } else {
          Alert.alert('Error', 'Phone dialing is not supported on this device.');
        }
      })
      .catch((err) => {
        console.error('Error opening dialer:', err);
        Alert.alert('Error', 'Failed to open phone dialer.');
      });
  };

  if (!event) return null;

  const getEventIcon = (type) => {
    switch (type) {
      case 'birthday':
        return '🎂';
      case 'wedding':
        return '💕';
      case 'corporate':
        return '🏢';
      case 'graduation':
        return '🎓';
      case 'anniversary':
        return '💒';
      default:
        return '🎉';
    }
  };

  const formatCreatedDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Unknown';
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <LinearGradient
        colors={[colors.gradient1, colors.gradient2, colors.gradient3]}
        style={styles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={[styles.closeIcon, { color: colors.text }]}>✕</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Event Details</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Event Header */}
          <View style={[styles.eventHeader, { backgroundColor: colors.cardBackground }]}>
            <View style={[styles.iconCircle, { backgroundColor: colors.primary + '30' }]}>
              <Text style={[styles.eventIcon, { color: colors.primary }]}>
                {getEventIcon(event.eventType)}
              </Text>
            </View>
            <View style={styles.eventTitleSection}>
              <Text style={[styles.eventName, { color: colors.text }]}>{event.eventName}</Text>
              <Text style={[styles.eventType, { color: colors.textSecondary }]}>
                {event.eventType.charAt(0).toUpperCase() + event.eventType.slice(1)} Event
              </Text>
            </View>
          </View>

          {/* Event Details */}
          <View style={[styles.detailsCard, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>📅 When & Where</Text>
            
            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Date</Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>{event.date}</Text>
            </View>
            
            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Time</Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>{event.time}</Text>
            </View>

            {event.duration && (
              <View style={styles.detailItem}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Duration</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>{event.duration} Hour</Text>
              </View>
            )}
          </View>

          {/* Guest & Budget Info */}
          <View style={[styles.detailsCard, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>👥 Event Details</Text>
            
            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Booked By</Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>
                {loadingUserData ? 'Loading...' : userName || 'Not available'}
              </Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Guest Count</Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>
                {event.guestCount || 'Not specified'}
              </Text>
            </View>
            
            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Budget</Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>
                Rs. {event.budget || 'Not specified'}
              </Text>
            </View>
            
            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Status</Text>
              <View style={[styles.statusBadge, { backgroundColor: colors.primary + '20' }]}>
                <Text style={[styles.statusText, { color: colors.primary }]}>
                  {event.status || 'Planned'}
                </Text>
              </View>
            </View>
          </View>

          {/* Decor Selection */}
          {event.selectedDecor && (
            <View style={[styles.detailsCard, { backgroundColor: colors.cardBackground }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>🎨 Chosen Decoration</Text>
              
              <View style={[styles.decorCard, { borderColor: colors.border }]}>
                <Text style={[styles.decorTitle, { color: colors.text }]}>
                  {event.selectedDecor.title}
                </Text>
                <Text style={[styles.decorTheme, { color: colors.textSecondary }]}>
                  {event.selectedDecor.theme}
                </Text>
                <Text style={[styles.decorDescription, { color: colors.textTertiary }]}>
                  {event.selectedDecor.description}
                </Text>
                
                {event.selectedDecor.colors && (
                  <View style={styles.colorPalette}>
                    {event.selectedDecor.colors.map((color, index) => (
                      <View
                        key={index}
                        style={[styles.colorDot, { backgroundColor: color }]}
                      />
                    ))}
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Preferences */}
          {event.decorPreferences && (
            <View style={[styles.detailsCard, { backgroundColor: colors.cardBackground }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>💭 Personal Preference</Text>
              <Text style={[styles.preferencesText, { color: colors.textTertiary }]}>
                {event.decorPreferences}
              </Text>
            </View>
          )}

          {/* Decor Instructions */}
          {event.selectedDecor && event.selectedDecor.instructions && event.selectedDecor.instructions.length > 0 && (
            <View style={[styles.detailsCard, { backgroundColor: colors.cardBackground }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>📋 Setup Instructions</Text>
              {event.selectedDecor.instructions.map((instruction, index) => (
                <View key={index} style={styles.instructionItem}>
                  <Text style={[styles.instructionNumber, { color: colors.primary }]}>
                    {index + 1}.
                  </Text>
                  <Text style={[styles.instructionText, { color: colors.text }]}>
                    {instruction}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.contactButton, { backgroundColor: colors.primary }]}
              onPress={handleContactPress}
              disabled={loadingUserData || !phoneNumber}
            >
              <Text style={[styles.buttonText, { color: colors.background }]}>📞 Contact</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.bottomSpacing} />
        </ScrollView>
      </LinearGradient>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  closeButton: {
    padding: 8,
  },
  closeIcon: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  placeholder: {
    width: 36,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
  },
  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  eventIcon: {
    fontSize: 36,
  },
  eventTitleSection: {
    flex: 1,
  },
  eventName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  eventType: {
    fontSize: 16,
    textTransform: 'capitalize',
  },
  detailsCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  detailLabel: {
    fontSize: 14,
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    flex: 2,
    textAlign: 'right',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  decorCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
  },
  decorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  decorTheme: {
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  decorDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  colorPalette: {
    flexDirection: 'row',
    gap: 8,
  },
  colorDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  preferencesText: {
    fontSize: 14,
    lineHeight: 22,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  instructionNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 8,
  },
  instructionText: {
    fontSize: 14,
    lineHeight: 20,
  },
  actionButtons: {
    marginTop: 10,
  },
  contactButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 40,
  },
});