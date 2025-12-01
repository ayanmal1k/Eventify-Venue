import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  FlatList,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { eventsService } from '../services/firestoreService';
import { useTheme } from '../context/ThemeContext';
import { useSession } from '../context/AuthContext';
import SuccessModal from '../components/SuccessModal';
import ErrorModal from '../components/ErrorModal';

export default function EventProposalScreen({ navigation }) {
  const { colors } = useTheme();
  const { user, userProfile, refreshUserData } = useSession();
  
  const [pendingEvents, setPendingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  
  const [successModal, setSuccessModal] = useState({
    visible: false,
    title: '',
    message: '',
    primaryButton: null,
  });
  
  const [errorModal, setErrorModal] = useState({
    visible: false,
    title: '',
    message: '',
    primaryButton: null
  });

  // Fetch unassigned events when screen comes into focus or userProfile changes
  useFocusEffect(
    React.useCallback(() => {
      if (userProfile?.area) {
        fetchPendingEvents();
      }
    }, [userProfile?.area])
  );

  const fetchPendingEvents = async () => {
    setLoading(true);
    try {
      const allEvents = await eventsService.getAllEvents();
      // Filter events with "pending" status AND matching venue location
      const pendingEventsList = allEvents.filter(event => {
        // Check if status is pending
        const isPending = event.status === 'pending';
        
        // Check if event venue/area matches venue's area
        const venueAreaMatch = event.venue === userProfile?.area;
        
        return isPending && venueAreaMatch;
      });
      setPendingEvents(pendingEventsList);
    } catch (error) {
      console.error('Error fetching pending events:', error);
      setErrorModal({
        visible: true,
        title: 'Error',
        message: 'Failed to load event proposals. Please try again.',
        primaryButton: { text: 'OK', onPress: () => {} }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptEvent = async () => {
    if (!selectedEvent || !user) return;

    setActionLoading(true);
    try {
      await eventsService.updateEvent(selectedEvent.id, {
        assignedVenueId: user.uid,
        assignedVenueName: userProfile?.venueName,
        status: 'accepted',
        assignedAt: new Date().toISOString(),
      });

      setSuccessModal({
        visible: true,
        title: 'Success!',
        message: `You have accepted "${selectedEvent.eventName}". The organizer will be notified.`,
        primaryButton: {
          text: 'OK',
          onPress: () => {
            setShowDetailsModal(false);
            setSelectedEvent(null);
            fetchPendingEvents();
          }
        },
      });
    } catch (error) {
      console.error('Error accepting event:', error);
      setErrorModal({
        visible: true,
        title: 'Error',
        message: 'Failed to accept event. Please try again.',
        primaryButton: { text: 'OK', onPress: () => {} }
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectEvent = async () => {
    if (!selectedEvent) return;

    setActionLoading(true);
    try {
      await eventsService.updateEvent(selectedEvent.id, {
        status: 'rejected',
        rejectedAt: new Date().toISOString()
      });

      setSuccessModal({
        visible: true,
        title: 'Event Rejected',
        message: `You have rejected "${selectedEvent.eventName}". The organizer will be notified.`,
        primaryButton: {
          text: 'OK',
          onPress: () => {
            setShowDetailsModal(false);
            setSelectedEvent(null);
            fetchPendingEvents();
          }
        },
      });
    } catch (error) {
      console.error('Error rejecting event:', error);
      setErrorModal({
        visible: true,
        title: 'Error',
        message: 'Failed to reject event. Please try again.',
        primaryButton: { text: 'OK', onPress: () => {} }
      });
    } finally {
      setActionLoading(false);
    }
  };

  const renderEventCard = ({ item }) => (
    <TouchableOpacity
      style={[styles.eventCard, { borderColor: colors.border, backgroundColor: `${colors.primary}15` }]}
      onPress={() => {
        setSelectedEvent(item);
        setShowDetailsModal(true);
      }}
    >
      <View style={styles.cardHeader}>
        <View style={styles.eventInfo}>
          <Text style={[styles.eventName, { color: colors.text }]} numberOfLines={1}>
            {item.eventName}
          </Text>
          <View style={styles.eventMeta}>
            <Text style={[styles.eventType, { color: colors.textSecondary }]}>
              {item.eventType?.charAt(0).toUpperCase() + item.eventType?.slice(1) || 'Event'}
            </Text>
            <Text style={[styles.eventType, { color: colors.textSecondary }]}>•</Text>
            <Text style={[styles.eventType, { color: colors.textSecondary }]}>
              {item.guestCount} guests
            </Text>
          </View>
        </View>
        <View style={[styles.badge, { backgroundColor: `${colors.primary}30` }]}>
          <Text style={[styles.badgeText, { color: colors.primary }]}>📝</Text>
        </View>
      </View>

      <View style={styles.cardDetails}>
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: colors.textTertiary }]}>Venue:</Text>
          <Text style={[styles.detailValue, { color: colors.text }]} numberOfLines={1}>
            {item.venue}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: colors.textTertiary }]}>Date:</Text>
          <Text style={[styles.detailValue, { color: colors.text }]}>
            {item.date}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: colors.textTertiary }]}>Budget:</Text>
          <Text style={[styles.detailValue, { color: colors.text }]}>
            {item.budget}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.viewDetailsButton, { backgroundColor: colors.primary }]}
        onPress={() => {
          setSelectedEvent(item);
          setShowDetailsModal(true);
        }}
      >
        <Text style={[styles.viewDetailsText, { color: colors.text }]}>View Details</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={[colors.gradient1, colors.gradient2, colors.gradient3]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.backIcon, { color: colors.text }]}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Event Proposals</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            {pendingEvents.length} pending proposal{pendingEvents.length !== 1 ? 's' : ''}
          </Text>
        </View>
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Loading event proposals...
          </Text>
        </View>
      ) : pendingEvents.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={[styles.emptyIcon, { color: colors.primary }]}>📭</Text>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>No Proposals Yet</Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            Event organizers will submit their proposals here
          </Text>
        </View>
      ) : (
        <FlatList
          data={pendingEvents}
          renderItem={renderEventCard}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Event Details Modal */}
      <Modal
        visible={showDetailsModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDetailsModal(false)}
      >
        <LinearGradient
          colors={[colors.gradient1, colors.gradient2, colors.gradient3]}
          style={styles.modalContainer}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {selectedEvent && (
            <>
              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <TouchableOpacity
                  onPress={() => setShowDetailsModal(false)}
                >
                  <Text style={[styles.closeIcon, { color: colors.text }]}>✕</Text>
                </TouchableOpacity>
                <Text style={[styles.modalTitle, { color: colors.text }]}>Event Details</Text>
                <View style={{ width: 30 }} />
              </View>

              {/* Modal Content */}
              <ScrollView
                style={styles.modalContent}
                contentContainerStyle={styles.modalScrollContent}
                showsVerticalScrollIndicator={false}
              >
                <View style={[styles.detailsCard, { backgroundColor: `${colors.primary}15`, borderColor: colors.border }]}>
                  {/* Event Name */}
                  <View style={styles.detailSection}>
                    <Text style={[styles.sectionLabel, { color: colors.textTertiary }]}>Event Name</Text>
                    <Text style={[styles.sectionValue, { color: colors.text }]}>
                      {selectedEvent.eventName}
                    </Text>
                  </View>

                  {/* Event Type */}
                  <View style={styles.detailSection}>
                    <Text style={[styles.sectionLabel, { color: colors.textTertiary }]}>Event Type</Text>
                    <Text style={[styles.sectionValue, { color: colors.text }]}>
                      {selectedEvent.eventType?.charAt(0).toUpperCase() + selectedEvent.eventType?.slice(1)}
                    </Text>
                  </View>

                  {/* Venue */}
                  <View style={styles.detailSection}>
                    <Text style={[styles.sectionLabel, { color: colors.textTertiary }]}>Location</Text>
                    <Text style={[styles.sectionValue, { color: colors.text }]}>
                      {selectedEvent.venue}
                    </Text>
                  </View>

                  {/* Date & Time */}
                  <View style={styles.rowSection}>
                    <View style={styles.halfSection}>
                      <Text style={[styles.sectionLabel, { color: colors.textTertiary }]}>Date</Text>
                      <Text style={[styles.sectionValue, { color: colors.text }]}>
                        {selectedEvent.date}
                      </Text>
                    </View>
                    <View style={styles.halfSection}>
                      <Text style={[styles.sectionLabel, { color: colors.textTertiary }]}>Time</Text>
                      <Text style={[styles.sectionValue, { color: colors.text }]}>
                        {selectedEvent.time}
                      </Text>
                    </View>
                  </View>

                  {/* Duration */}
                  {selectedEvent.duration && (
                    <View style={styles.detailSection}>
                      <Text style={[styles.sectionLabel, { color: colors.textTertiary }]}>Duration</Text>
                      <Text style={[styles.sectionValue, { color: colors.text }]}>
                        {selectedEvent.duration}
                      </Text>
                    </View>
                  )}

                  {/* Guest Count & Budget */}
                  <View style={styles.rowSection}>
                    <View style={styles.halfSection}>
                      <Text style={[styles.sectionLabel, { color: colors.textTertiary }]}>Guests</Text>
                      <Text style={[styles.sectionValue, { color: colors.text }]}>
                        {selectedEvent.guestCount}
                      </Text>
                    </View>
                    <View style={styles.halfSection}>
                      <Text style={[styles.sectionLabel, { color: colors.textTertiary }]}>Budget</Text>
                      <Text style={[styles.sectionValue, { color: colors.text }]}>
                        {selectedEvent.budget}
                      </Text>
                    </View>
                  </View>

                  {/* Decor Preferences */}
                  <View style={styles.detailSection}>
                    <Text style={[styles.sectionLabel, { color: colors.textTertiary }]}>Decor Preferences</Text>
                    <Text style={[styles.sectionValue, { color: colors.text }]}>
                      {selectedEvent.decorPreferences}
                    </Text>
                  </View>

                  {/* Selected Decor */}
                  {selectedEvent.selectedDecor && (
                    <View style={styles.detailSection}>
                      <Text style={[styles.sectionLabel, { color: colors.textTertiary }]}>Selected Decor</Text>
                      <View style={[styles.decorBox, { borderColor: colors.primary }]}>
                        <Text style={[styles.decorBoxTitle, { color: colors.text }]}>
                          {selectedEvent.selectedDecor.title}
                        </Text>
                        <Text style={[styles.decorBoxDescription, { color: colors.textSecondary }]}>
                          {selectedEvent.selectedDecor.description}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              </ScrollView>

              {/* Action Buttons */}
              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={[styles.rejectButton, { borderColor: colors.primary }]}
                  onPress={handleRejectEvent}
                  disabled={actionLoading}
                >
                  {actionLoading ? (
                    <ActivityIndicator color={colors.primary} />
                  ) : (
                    <Text style={[styles.rejectButtonText, { color: colors.primary }]}>Close</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.acceptButton, { backgroundColor: colors.primary }]}
                  onPress={handleAcceptEvent}
                  disabled={actionLoading}
                >
                  {actionLoading ? (
                    <ActivityIndicator color={colors.text} />
                  ) : (
                    <Text style={[styles.acceptButtonText, { color: colors.text }]}>Accept Proposal</Text>
                  )}
                </TouchableOpacity>
              </View>
            </>
          )}
        </LinearGradient>
      </Modal>

      {/* Success Modal */}
      <SuccessModal
        visible={successModal.visible}
        title={successModal.title}
        message={successModal.message}
        primaryButton={successModal.primaryButton}
        onClose={() => setSuccessModal({ ...successModal, visible: false })}
      />

      {/* Error Modal */}
      <ErrorModal
        visible={errorModal.visible}
        title={errorModal.title}
        message={errorModal.message}
        primaryButton={errorModal.primaryButton}
        onClose={() => setErrorModal({ ...errorModal, visible: false })}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    marginRight: 15,
  },
  backIcon: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  headerSubtitle: {
    fontSize: 12,
    marginTop: 4,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  eventCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  eventInfo: {
    flex: 1,
    marginRight: 10,
  },
  eventName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  eventMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventType: {
    fontSize: 12,
    marginRight: 6,
  },
  badge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 18,
  },
  cardDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 12,
    flex: 1,
    textAlign: 'right',
  },
  viewDetailsButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewDetailsText: {
    fontSize: 12,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  closeIcon: {
    fontSize: 28,
    fontWeight: '600',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
  },
  modalScrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  detailsCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    marginBottom: 20,
  },
  detailSection: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionValue: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
  },
  rowSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  halfSection: {
    width: '48%',
  },
  decorBox: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
  },
  decorBoxTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  decorBoxDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 30,
    gap: 12,
  },
  rejectButton: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 2,
    paddingVertical: 15,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  rejectButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  acceptButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
  },
  acceptButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
