import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function FAQScreen({ navigation }) {
  const { colors } = useTheme();
  const [expandedItem, setExpandedItem] = useState(null);

  const faqData = [
    {
      id: 1,
      category: 'Getting Started',
      question: 'How do I set up my venue on Eventify?',
      answer: 'Create an account with your email and password. During registration, provide your venue details including venue name, capacity, location/area, full address, and phone number. You can also add your Google Maps link for easy access. Once registered, your venue profile is ready to receive event proposals.'
    },
    {
      id: 2,
      category: 'Account',
      question: 'How do I update my venue information?',
      answer: 'Go to Profile > Edit Profile to update your venue details. You can change your name, gender, and password. For venue-specific information like capacity, address, or phone number, these details are stored in your initial registration. Contact support if you need to update these critical fields.'
    },
    {
      id: 3,
      category: 'Event Proposals',
      question: 'How do I receive event proposals from organizers?',
      answer: 'Event organizers submit proposals for events happening in your area. These proposals automatically appear in your "Event Proposals" section (accessible from the home screen). You\'ll see a list of pending proposals with key details like event type, date, guest count, and budget. The app filters proposals by your venue location.'
    },
    {
      id: 4,
      category: 'Event Proposals',
      question: 'What information is included in an event proposal?',
      answer: 'Each proposal includes: event name, event type (birthday, wedding, corporate, etc.), date, time, duration, guest count, budget, venue location, decoration preferences, and the selected decoration theme. You can review all this information before deciding to accept or reject the proposal.'
    },
    {
      id: 5,
      category: 'Booking Management',
      question: 'How do I accept or reject an event proposal?',
      answer: 'Tap on any proposal to view full details. At the bottom of the details screen, you\'ll find two buttons: "Reject" and "Accept Proposal". Choose one to make your decision. Once submitted, the event organizer will be notified of your decision immediately.'
    },
    {
      id: 6,
      category: 'Booking Management',
      question: 'What happens after I accept a proposal?',
      answer: 'After accepting a proposal, the event status changes to "Accepted" and the event organizer is notified. The event then appears in your "My Events" section showing all your confirmed bookings. You can view the organizer\'s details and contact them using the contact button for further coordination.'
    },
    {
      id: 7,
      category: 'Bookings',
      question: 'Where can I see all my bookings and confirmed events?',
      answer: 'Navigate to the "My Events" section from the bottom navigation menu. This displays all your confirmed bookings and accepted events. Each event card shows the event name, type, date, time, venue, and decoration details. Tap any event to view full details including organizer information.'
    },
    {
      id: 8,
      category: 'Bookings',
      question: 'Can I contact the event organizer?',
      answer: 'Yes! In the event details modal, you\'ll find a "Contact" button. Tap it to call the organizer directly. The app retrieves their phone number from their profile. If the phone number is not available, you\'ll see a notification and won\'t be able to dial.'
    },
    {
      id: 9,
      category: 'Dashboard',
      question: 'What information does the home dashboard show?',
      answer: 'The dashboard displays quick statistics including: Total Bookings (all proposals received), Confirmed bookings (accepted proposals), and Upcoming events (events scheduled for future dates). You can also see a summary of your most recent bookings with quick view access to their details.'
    },
    {
      id: 10,
      category: 'Dashboard',
      question: 'What do the different event statuses mean?',
      answer: 'Pending: Awaiting your decision. Accepted: You\'ve confirmed this booking. Rejected: You\'ve declined this proposal. Planned: Event is confirmed and ready. The status helps you track where each event stands in the booking workflow.'
    },
    {
      id: 11,
      category: 'Features',
      question: 'Can I delete a booking?',
      answer: 'Yes, you can delete an event from your "My Events" list. Swipe or long-press on an event to access the delete option. Confirm the deletion. Note: Deleting is permanent and cannot be undone. Use this only when necessary.'
    },
    {
      id: 12,
      category: 'Features',
      question: 'Can I edit event details after accepting?',
      answer: 'Event editing will be available in an upcoming update. Currently, if you need to modify accepted event details, you can contact the event organizer directly to discuss changes or delete and re-negotiate the booking.'
    },
    {
      id: 13,
      category: 'Features',
      question: 'What is the decoration selection in event proposals?',
      answer: 'Event organizers choose decoration themes AI-generated based on their event type and preferences. This selected decoration is displayed in the proposal details so you can understand the organizer\'s event vision. The decoration includes theme, color scheme, and setup instructions.'
    },
    {
      id: 14,
      category: 'Appearance',
      question: 'How do I switch between dark and light mode?',
      answer: 'Go to Profile > Appearance to toggle between dark mode and light mode. Your preference is saved, so the app will open in your chosen theme next time. This helps with comfortable viewing in different lighting conditions.'
    },
    {
      id: 15,
      category: 'Technical',
      question: 'Do I need internet connection to use the app?',
      answer: 'Yes, you need an active internet connection for receiving proposals, accepting/rejecting bookings, and syncing data. However, you can view previously loaded event details offline. Make sure you\'re connected for all critical actions.'
    },
    {
      id: 16,
      category: 'Privacy & Security',
      question: 'Is my venue information secure?',
      answer: 'Yes, your privacy is our priority. All venue and booking data is encrypted and stored securely in Firebase. Your phone number is only visible to event organizers after you accept their proposal. We do not share your information with third parties.'
    },
    {
      id: 17,
      category: 'Privacy & Security',
      question: 'What data do event organizers see about my venue?',
      answer: 'Event organizers can see your venue location/area during the proposal process. After you accept a proposal, they can view your venue name, capacity, and phone number. Your email and full address are kept private for security.'
    },
    {
      id: 18,
      category: 'Account Management',
      question: 'How do I change my password?',
      answer: 'Go to Profile > Edit Profile. Scroll down to "Change Password (Optional)". Enter your current password, then your new password twice to confirm. Click "Save Changes". Your password must be at least 6 characters long.'
    },
    {
      id: 19,
      category: 'Account Management',
      question: 'What do I do if I forgot my password?',
      answer: 'On the login screen, tap "Forgot Password?". Enter your email address. You\'ll receive a password reset link in your email. Click the link to set a new password. If you don\'t receive the email, check your spam folder or contact support.'
    },
    {
      id: 20,
      category: 'Account Management',
      question: 'How do I logout from the app?',
      answer: 'Go to Profile and tap the "Logout" button at the bottom. A confirmation dialog will appear asking if you\'re sure. Confirm to logout. You\'ll be returned to the login screen and can log back in with your credentials anytime.'
    },
    {
      id: 21,
      category: 'Troubleshooting',
      question: 'Why am I not seeing any event proposals?',
      answer: 'Make sure: 1) Your venue area is set correctly during registration, 2) Event organizers are submitting events for your area, 3) You have an active internet connection, 4) Try refreshing the screen by pulling down. If still no proposals appear, contact support with your venue details.'
    },
    {
      id: 22,
      category: 'Troubleshooting',
      question: 'What should I do if I can\'t contact an organizer?',
      answer: 'Ensure the organizer has provided a valid phone number. If the contact button shows "No Phone Number", ask the organizer to update their profile. If calling doesn\'t work, check your phone settings. For recurring issues, contact support.'
    },
    {
      id: 23,
      category: 'Troubleshooting',
      question: 'The app keeps showing loading state. What should I do?',
      answer: 'Check your internet connection. If connected, try: 1) Pull down to refresh, 2) Close and reopen the app, 3) Log out and log back in, 4) Clear app cache from your phone settings. If the issue persists, contact support with your email.'
    },
    {
      id: 24,
      category: 'Information',
      question: 'Where can I find app version and creator information?',
      answer: 'Go to Profile > About to view the app version, release notes, and creator information. This page also contains links to support channels and important documentation.'
    },
    {
      id: 25,
      category: 'Support',
      question: 'How can I get help or report an issue?',
      answer: 'From the FAQ screen, tap "Email Support" to send a message to our support team directly. Include details about your issue and any error messages. You can also access the tutorial/documentation from the same section. Our team typically responds within 24 hours.'
    }
  ];

  const toggleExpanded = (id) => {
    LayoutAnimation.configureNext({
      duration: 300,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      update: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.scaleY,
      },
    });
    setExpandedItem(expandedItem === id ? null : id);
  };

  const handleEmailSupport = () => {
    Linking.openURL('mailto:support@eventify.com?subject=Eventify Venue App Support&body=Hello Eventify Team,%0D%0A%0D%0AI need help with:%0D%0A%0D%0APlease describe your issue here...');
  };

  const getCategoryColor = (category) => {
    const categoryColors = {
      'Getting Started': '#4CAF50',
      'Event Proposals': '#2196F3',
      'Account Management': '#FF9800',
      'Booking Management': '#9C27B0',
      'Bookings': '#00BCD4',
      'Dashboard': '#607D8B',
      'Technical': '#FF6F00',
      'Troubleshooting': '#795548',
      'Features': '#3F51B5',
      'Privacy & Security': '#F44336',
      'Account': '#E91E63',
      'Information': '#8BC34A',
      'Appearance': '#009688',
      'Support': '#673AB7',
    };
    return categoryColors[category] || colors.primary;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Enhanced background pattern */}
      <View style={styles.backgroundPattern}>
        {[...Array(50)].map((_, i) => (
          <View
            key={i}
            style={[
              styles.backgroundElement,
              {
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.1 + 0.02,
                backgroundColor: colors.primary,
                transform: [
                  { rotate: `${Math.random() * 360}deg` },
                  { scale: Math.random() * 0.5 + 0.5 }
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
          <Text style={[styles.headerTitle, { color: colors.text }]}>Help Center</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>Find answers to common questions</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* FAQ Items */}
          {faqData.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.faqItem,
                { 
                  backgroundColor: colors.cardBackground,
                  borderColor: expandedItem === item.id ? getCategoryColor(item.category) : colors.border + '40',
                  shadowColor: colors.text,
                  transform: [{ scale: expandedItem === item.id ? 1.02 : 1 }],
                }
              ]}
              onPress={() => toggleExpanded(item.id)}
              activeOpacity={0.9}
            >
              <View style={styles.faqHeader}>
                <View style={styles.faqContent}>
                  <View style={styles.categoryContainer}>
                    <View style={[styles.categoryIndicator, { backgroundColor: getCategoryColor(item.category) }]} />
                    <Text style={[styles.categoryText, { color: getCategoryColor(item.category) }]}>
                      {item.category}
                    </Text>
                  </View>
                  <Text style={[styles.question, { color: colors.text }]}>{item.question}</Text>
                </View>
                <View style={[
                  styles.expandButton,
                  { 
                    backgroundColor: expandedItem === item.id ? getCategoryColor(item.category) : colors.border + '40',
                    transform: [{ rotate: expandedItem === item.id ? '45deg' : '0deg' }]
                  }
                ]}>
                  <Text style={[
                    styles.expandIcon,
                    { color: expandedItem === item.id ? '#FFFFFF' : colors.textSecondary }
                  ]}>
                    +
                  </Text>
                </View>
              </View>
              
              {expandedItem === item.id && (
                <View style={[styles.answerContainer, { borderTopColor: getCategoryColor(item.category) + '20' }]}>
                  <Text style={[styles.answer, { color: colors.textSecondary }]}>{item.answer}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}

          {/* Enhanced Contact Support */}
          <View style={[styles.supportSection, { backgroundColor: colors.cardBackground, borderColor: colors.primary + '40' }]}>
            <View style={styles.supportHeader}>
              <View style={[styles.supportIconContainer, { backgroundColor: colors.primary + '20' }]}>
                <Text style={[styles.supportIcon, { color: colors.primary }]}>?</Text>
              </View>
              <View style={styles.supportContent}>
                <Text style={[styles.supportTitle, { color: colors.text }]}>Still need assistance?</Text>
                <Text style={[styles.supportSubtitle, { color: colors.textSecondary }]}>
                  Our support team is here to help you with any questions about Eventify
                </Text>
              </View>
            </View>
            
            <View style={styles.supportActions}>
              <TouchableOpacity
                style={[styles.supportButton, styles.primaryButton, { backgroundColor: colors.primary }]}
                onPress={handleEmailSupport}
                activeOpacity={0.8}
              >
                <Text style={styles.supportButtonText}>Email Support</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.supportButton, styles.secondaryButton, { borderColor: colors.primary }]}
                onPress={() => {/* Add link to documentation or tutorial */}}
                activeOpacity={0.8}
              >
                <Text style={[styles.secondaryButtonText, { color: colors.primary }]}>View Tutorial</Text>
              </TouchableOpacity>
            </View>
          </View>
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
    width: 8,
    height: 8,
    borderRadius: 4,
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
    fontSize: 22,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  placeholder: {
    width: 44,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  faqItem: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  faqContent: {
    flex: 1,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryIndicator: {
    width: 3,
    height: 16,
    borderRadius: 2,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  question: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  expandButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  expandIcon: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  answerContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  answer: {
    fontSize: 15,
    lineHeight: 22,
  },
  supportSection: {
    borderRadius: 20,
    padding: 24,
    marginTop: 16,
    marginBottom: 24,
    borderWidth: 2,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  supportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  supportIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  supportIcon: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  supportContent: {
    flex: 1,
  },
  supportTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  supportSubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  supportActions: {
    flexDirection: 'row',
    gap: 12,
  },
  supportButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButton: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  secondaryButton: {
    borderWidth: 2,
    backgroundColor: 'transparent',
  },
  supportButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 40,
  },
});