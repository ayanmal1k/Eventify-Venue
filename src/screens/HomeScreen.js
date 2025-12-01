import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  RefreshControl,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import BottomNavigation from '../components/BottomNavigation';
import EventDetailsModal from '../components/EventDetailsModal';
import { useTheme } from '../context/ThemeContext';
import { useSession } from '../context/AuthContext';
import { eventsService } from '../services/firestoreService';

export default function HomeScreen({ navigation }) {
  const { colors } = useTheme();
  const { user, userProfile, userEvents, refreshUserData } = useSession();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Handle refresh - use the refreshUserData from context
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshUserData();
    } catch (error) {
      console.error('Error refreshing data:', error);
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'planned':
        return '#10B981';
      case 'planning':
        return '#F59E0B';
      case 'completed':
        return '#6B7280';
      default:
        return colors.primary;
    }
  };

  const formatEventDate = (dateString) => {
    try {
      const eventDate = new Date(dateString);
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      if (isNaN(eventDate.getTime())) {
        return dateString;
      }
      
      if (eventDate.toDateString() === today.toDateString()) {
        return 'Today';
      } else if (eventDate.toDateString() === tomorrow.toDateString()) {
        return 'Tomorrow';
      } else {
        return eventDate.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric',
          year: eventDate.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
        });
      }
    } catch (error) {
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
      `Are you sure you want to delete "${event.eventName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await eventsService.deleteEvent(event.id);
              await refreshUserData(); // Refresh data after deletion
              Alert.alert('Success', 'Event deleted successfully!');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete event. Please try again.');
            }
          }
        }
      ]
    );
  };

  // Calculate stats from preloaded data
  const totalEvents = userEvents?.length || 0;
  const plannedEvents = userEvents?.filter(e => (e.status || 'planned') === 'planned').length || 0;
  const upcomingEvents = userEvents?.filter(e => {
    const eventDate = new Date(e.date);
    return eventDate >= new Date();
  }).length || 0;

  // Get display name from preloaded data
  const displayName = userProfile?.venueName || userProfile?.name || user?.displayName || user?.email?.split('@')[0] || 'Venue';

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

      {/* Top Bar with Eventify Logo and Text */}
      <View style={[styles.topBar, { backgroundColor: colors.cardBackground, borderBottomColor: colors.border }]}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/New Eventify-Icon.png')}
            style={styles.topBarIcon}
            resizeMode="contain"
          />
          <Text style={[styles.appTitle, { color: colors.primary }]}>EVENTIFY - VENUE</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header - now using preloaded data */}
        <View style={styles.header}>
          <Text style={[styles.welcomeText, { color: colors.text }]}>
            Welcome back, {displayName}!
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Manage your venue and bookings
          </Text>
        </View>

        {/* Quick Stats - Updated with preloaded data */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>{totalEvents}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Bookings</Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>{plannedEvents}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Confirmed</Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>{upcomingEvents}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Upcoming</Text>
          </View>
        </View>

        {/* Recent Bookings - Using preloaded data */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Bookings</Text>
            <TouchableOpacity onPress={() => navigation.navigate('MyEvents')}>
              <Text style={[styles.seeAllText, { color: colors.primary }]}>See All</Text>
            </TouchableOpacity>
          </View>

          {userEvents && userEvents.length > 0 ? (
            userEvents.slice(0, 3).map((event) => (
              <TouchableOpacity
                key={event.id}
                style={[styles.eventCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
                activeOpacity={0.7}
                onPress={() => handleEventPress(event)}
              >
                <View style={styles.eventLeft}>
                  <View style={[styles.eventIconContainer, { backgroundColor: colors.primary + '20' }]}>
                    <Text style={styles.eventIcon}>{getEventIcon(event.eventType)}</Text>
                  </View>
                  <View style={styles.eventInfo}>
                    <Text style={[styles.eventName, { color: colors.text }]}>{event.eventName}</Text>
                    <Text style={[styles.eventDate, { color: colors.textSecondary }]}>
                      {formatEventDate(event.date)} • {event.time}
                    </Text>
                    {event.venue && (
                      <Text style={[styles.eventVenue, { color: colors.textTertiary }]} numberOfLines={1}>
                        📍 {event.venue}
                      </Text>
                    )}
                  </View>
                </View>
                <View style={styles.eventRight}>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(event.status || 'planned') + '20' }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(event.status || 'planned') }]}>
                      {(event.status || 'planned').charAt(0).toUpperCase() + (event.status || 'planned').slice(1)}
                    </Text>
                  </View>
                  <Text style={[styles.chevron, { color: colors.textSecondary }]}>›</Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={[styles.emptyState, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
              <Image
                source={require('../../assets/Icons/confetti.png')}
                style={[styles.emptyIcon, { tintColor: colors.primary }]}
                resizeMode="contain"
              />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>No Bookings Yet</Text>
              <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                Accepted Bookings will appear here
              </Text>
            </View>
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

      <BottomNavigation navigation={navigation} currentRoute="Home" />
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
  topBar: {
    width: '100%',
    paddingTop: 50, // Add top padding for status bar
    paddingBottom: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start', // Align to start instead of space-between
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topBarIcon: {
    width: 30, // Reduced from 60 to 40
    height: 30, // Reduced from 60 to 40
    marginRight: 12,
  },
  appTitle: {
    fontSize: 26, // Reduced from 28 to 24 to match the smaller icon
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingTop: 30, // Reduced from 60 since we now have the top bar
    paddingHorizontal: 24,
    paddingBottom: 30,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginHorizontal: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  eventLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  eventIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  eventIcon: {
    width: 24,
    height: 24,
  },
  eventInfo: {
    flex: 1,
  },
  eventName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  eventDate: {
    fontSize: 14,
  },
  eventRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  chevron: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    borderRadius: 16,
    borderWidth: 1,
  },
  emptyIcon: {
    width: 48,
    height: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 20,
  },
  eventVenue: {
    fontSize: 12,
    marginTop: 2,
  },
});
