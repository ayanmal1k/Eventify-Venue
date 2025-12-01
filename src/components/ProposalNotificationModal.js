import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';

export default function ProposalNotificationModal({
  visible,
  proposal,
  onClose,
  onViewProposal,
}) {
  const { colors } = useTheme();

  if (!proposal) return null;

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

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={[styles.container, { backgroundColor: colors.cardBackground }]}>
          <LinearGradient
            colors={[colors.gradient1, colors.gradient2]}
            style={styles.headerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.header}>
              <Text style={styles.badge}>New Proposal!</Text>
              <TouchableOpacity onPress={onClose}>
                <Text style={styles.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>

          <View style={styles.content}>
            <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
              <Text style={styles.eventIcon}>{getEventIcon(proposal.eventType)}</Text>
            </View>

            <Text style={[styles.eventName, { color: colors.text }]}>
              {proposal.eventName}
            </Text>

            <Text style={[styles.eventType, { color: colors.textSecondary }]}>
              {proposal.eventType.charAt(0).toUpperCase() + proposal.eventType.slice(1)} Event
            </Text>

            <View style={styles.detailsContainer}>
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>📅</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>
                  {proposal.date}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>👥</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>
                  {proposal.guestCount || 'Not specified'} guests
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>💰</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>
                  Rs. {proposal.budget || 'Not specified'}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.dismissBtn, { borderColor: colors.border }]}
              onPress={onClose}
            >
              <Text style={[styles.dismissBtnText, { color: colors.textSecondary }]}>
                Dismiss
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.viewBtn, { backgroundColor: colors.primary }]}
              onPress={onViewProposal}
            >
              <Text style={[styles.viewBtnText, { color: colors.background }]}>
                View Proposal
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    borderRadius: 20,
    overflow: 'hidden',
    maxWidth: '90%',
    width: '100%',
  },
  headerGradient: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  closeBtn: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  eventIcon: {
    fontSize: 40,
  },
  eventName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  eventType: {
    fontSize: 14,
    marginBottom: 20,
    textTransform: 'capitalize',
  },
  detailsContainer: {
    width: '100%',
    paddingVertical: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 18,
    marginRight: 12,
    width: 30,
  },
  detailValue: {
    fontSize: 14,
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dismissBtn: {
    borderWidth: 1.5,
  },
  dismissBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  viewBtn: {
    flex: 1.2,
  },
  viewBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
