import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import BottomNavigation from '../components/BottomNavigation';
import EventDetailsModal from '../components/EventDetailsModal';
import { useTheme } from '../context/ThemeContext';
import { useSession } from '../context/AuthContext';
import { eventsService } from '../services/firestoreService';

export default function MyEventsScreen({ navigation }) {
  const { colors } = useTheme();
  const { userEvents, refreshUserData } = useSession();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshUserData();
    } catch (error) {
      console.error('Error refreshing data:', error);
      Alert.alert('Error', 'Failed to refresh events. Please try again.');
    } finally {
      setRefreshing(false);
    }
  };

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

  // Improved date formatting that handles the stored date format
  const formatEventDate = (dateString) => {
    try {
      // If it's already a formatted date string like "Wednesday, November 13, 2024"
      if (dateString.includes(',') && dateString.includes(' ')) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        // Try to parse the formatted date string
        const eventDate = new Date(dateString);
        
        if (isNaN(eventDate.getTime())) {
          // If parsing fails, return the original string
          return dateString;
        }
        
        if (eventDate.toDateString() === today.toDateString()) {
          return 'Today';
        } else if (eventDate.toDateString() === tomorrow.toDateString()) {
          return 'Tomorrow';
        } else {
          return eventDate.toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric',
            year: eventDate.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
          });
        }
      } else {
        // Handle other date formats
        const eventDate = new Date(dateString);
        if (isNaN(eventDate.getTime())) {
          return dateString; // Return original if parsing fails
        }
        return eventDate.toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        });
      }
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  const handleEventPress = (event) => {
    setSelectedEvent(event);
    setModalVisible(true);
  };

  const handleEditEvent = (event) => {
    Alert.alert('Coming Soon', 'Event editing will be available in the next update!');
  };

  const handleDeleteEvent = (event) => {
    Alert.alert(
      'Delete Event',
      `Are you sure you want to delete "${event.eventName}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await eventsService.deleteEvent(event.id);
              await refreshUserData(); // Refresh the data using context method
              Alert.alert('Success', 'Event deleted successfully!');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete event. Please try again.');
            }
          }
        }
      ]
    );
  };

  const handleAddEvent = () => {
    navigation.navigate('Form');
  };

  // Use preloaded events from context
  const events = userEvents || [];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
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

      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Bookings</Text>
        
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.content}>
          {events.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyIcon, { color: colors.textSecondary }]}>📅</Text>
              <Text style={[styles.emptyTitle, { color: colors.text }]}>No Events Yet</Text>
              <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                Create your first event to get started!
              </Text>
              <TouchableOpacity 
                style={[styles.createButton, { backgroundColor: colors.primary }]} 
                onPress={handleAddEvent}
              >
                <Text style={[styles.createButtonText, { color: colors.background }]}>
                  Create Event
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            events.map((event) => (
              <TouchableOpacity
                key={event.id}
                style={[styles.eventCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
                activeOpacity={0.7}
                onPress={() => handleEventPress(event)}
              >
                <View style={[styles.iconCircle, { backgroundColor: colors.primary + '20' }]}>
                  <Text style={[styles.eventTypeIcon, { color: colors.primary }]}>
                    {getEventIcon(event.eventType)}
                  </Text>
                </View>
                <View style={styles.eventInfo}>
                  <Text style={[styles.eventName, { color: colors.text }]}>{event.eventName}</Text>
                  <View style={styles.detailRow}>
                    <Text style={[styles.smallIcon, { color: colors.textSecondary }]}>📅</Text>
                    <Text style={[styles.eventDetail, { color: colors.textSecondary }]}>
                      {formatEventDate(event.date)} • {event.time}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={[styles.smallIcon, { color: colors.textSecondary }]}>📍</Text>
                    <Text style={[styles.eventDetail, { color: colors.textSecondary }]}>{event.venue}</Text>
                  </View>
                  {event.selectedDecor && (
                    <View style={styles.detailRow}>
                      <Text style={[styles.smallIcon, { color: colors.textSecondary }]}>🎨</Text>
                      <Text style={[styles.eventDetail, { color: colors.textSecondary }]}>
                        {event.selectedDecor.title}
                      </Text>
                    </View>
                  )}
                </View>
                <View style={styles.eventMeta}>
                  <View style={[styles.statusBadge, { backgroundColor: colors.primary + '20' }]}>
                    <Text style={[styles.statusText, { color: colors.primary }]}>
                      {event.status || 'Planned'}
                    </Text>
                  </View>
                  <Text style={[styles.chevron, { color: colors.textSecondary }]}>›</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Event Details Modal */}
      <EventDetailsModal
        visible={modalVisible}
        event={selectedEvent}
        onClose={() => {
          setModalVisible(false);
          setSelectedEvent(null);
        }}
        onEdit={handleEditEvent}
        onDelete={handleDeleteEvent}
      />

      <BottomNavigation navigation={navigation} currentRoute="MyEvents" />
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
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  addButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
  },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  eventInfo: {
    flex: 1,
  },
  eventName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  eventDetail: {
    fontSize: 13,
    marginLeft: 6,
  },
  bottomSpacing: {
    height: 20,
  },
  addIcon: {
    fontSize: 28,
  },
  eventTypeIcon: {
    fontSize: 32,
  },
  smallIcon: {
    fontSize: 14,
  },
  chevron: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  createButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  eventMeta: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});
