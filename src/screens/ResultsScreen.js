import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
  ActivityIndicator,
  Platform,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
// import { Ionicons } from '@expo/vector-icons'; // Temporarily commented out
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import ViewShot from 'react-native-view-shot';
import { generateDecorSuggestions } from '../services/aiService';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 80;

export default function ResultsScreen({ route, navigation }) {
  const { colors } = useTheme();
  const { decorSuggestions: initialSuggestions, eventData } = route.params;
  const [decorSuggestions, setDecorSuggestions] = useState(initialSuggestions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [regenerating, setRegenerating] = useState(null);
  const scrollViewRef = useRef(null);
  const viewShotRefs = useRef([]);

  const handleScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / CARD_WIDTH);
    setCurrentIndex(index);
  };

  const scrollToIndex = (index) => {
    scrollViewRef.current?.scrollTo({
      x: index * CARD_WIDTH,
      animated: true,
    });
    setCurrentIndex(index);
  };

  const handleRegenerate = async (index) => {
    setRegenerating(index);
    try {
      const newSuggestions = await generateDecorSuggestions(eventData);
      const key = index === 0 ? 'suggestion1' : 'suggestion2';
      setDecorSuggestions((prev) => ({
        ...prev,
        [key]: newSuggestions[key],
      }));
      Alert.alert('Success', 'Decor suggestions regenerated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to regenerate suggestions. Please try again.');
      console.error(error);
    } finally {
      setRegenerating(null);
    }
  };

  const handleRegenerateAll = async () => {
    setRegenerating('all');
    try {
      const newSuggestions = await generateDecorSuggestions(eventData);
      setDecorSuggestions(newSuggestions);
      Alert.alert('Success', 'All decor suggestions regenerated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to regenerate suggestions. Please try again.');
      console.error(error);
    } finally {
      setRegenerating(null);
    }
  };

  const captureCard = async (index) => {
    try {
      const uri = await viewShotRefs.current[index].capture();
      return uri;
    } catch (error) {
      console.error('Error capturing card:', error);
      throw error;
    }
  };

  const handleShare = async () => {
    try {
      const uri = await captureCard(currentIndex);
      
      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert('Error', 'Sharing is not available on this device');
        return;
      }

      await Sharing.shareAsync(uri, {
        mimeType: 'image/png',
        dialogTitle: 'Share Decor Ideas',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share decor suggestions');
      console.error(error);
    }
  };

  const handleSaveEvent = async () => {
    try {
      // TODO: Implement save event to user's events list
      Alert.alert('Success', 'Event saved to My Events!', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('MyEvents')
        }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to save event');
      console.error(error);
    }
  };

  const renderDecorCard = (suggestion, index) => {
    const key = index === 0 ? 'suggestion1' : 'suggestion2';
    const data = decorSuggestions[key];

    return (
      <View key={index} style={styles.cardContainer}>
        <ViewShot
          ref={(ref) => (viewShotRefs.current[index] = ref)}
          options={{ format: 'png', quality: 1 }}
          style={styles.cardWrapper}
        >
          <LinearGradient
            colors={['#FDE8E9', '#E9D5FF', '#DBEAFE']}
            style={styles.decorCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.cardContent}>
              {/* Event Header */}
              <View style={styles.eventHeader}>
                <Text style={styles.eventName}>{eventData.eventName}</Text>
                <Text style={styles.eventSubtitle}>{eventData.eventType} Event</Text>
              </View>

              <View style={styles.divider} />

              {/* Decor Theme */}
              <View style={styles.decorSection}>
                <Text style={styles.sectionTitle}>🎨 Theme & Colors</Text>
                <Text style={styles.decorText}>{data?.theme || 'Elegant & Sophisticated'}</Text>
              </View>

              {/* Decoration Ideas */}
              <View style={styles.decorSection}>
                <Text style={styles.sectionTitle}>✨ Decoration Ideas</Text>
                <Text style={styles.decorText}>{data?.decorations || 'Floral arrangements, soft lighting, elegant table settings'}</Text>
              </View>

              {/* Venue Setup */}
              <View style={styles.decorSection}>
                <Text style={styles.sectionTitle}>🏛️ Venue Setup</Text>
                <Text style={styles.decorText}>{data?.setup || 'Circular seating arrangement with central dance floor'}</Text>
              </View>

              {/* Event Details */}
              <View style={styles.eventInfo}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailIcon}>📍</Text>
                  <Text style={styles.detailText}>{eventData.venue}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailIcon}>📅</Text>
                  <Text style={styles.detailText}>{eventData.date}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailIcon}>⏰</Text>
                  <Text style={styles.detailText}>{eventData.time}</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </ViewShot>

        <Text style={styles.optionLabel}>Decor Option {index + 1}</Text>

        {/* Regenerate single button */}
        <TouchableOpacity
          style={styles.regenerateSingleButton}
          onPress={() => handleRegenerate(index)}
          disabled={regenerating !== null}
        >
          {regenerating === index ? (
            <ActivityIndicator color="#A78BFA" size="small" />
          ) : (
            <>
              <Text style={styles.refreshIcon}>🔄</Text>
              <Text style={styles.regenerateSingleText}>New Ideas</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    );
  };

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
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={[styles.backIcon, { color: colors.text }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Decor Suggestions</Text>
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Choose your decor style</Text>

        {/* Carousel */}
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          snapToInterval={CARD_WIDTH}
          decelerationRate="fast"
          contentContainerStyle={styles.carousel}
        >
          {renderDecorCard(decorSuggestions.suggestion1, 0)}
          {renderDecorCard(decorSuggestions.suggestion2, 1)}
        </ScrollView>

        {/* Custom Slider Indicator */}
        <View style={styles.sliderContainer}>
          <View style={styles.sliderTrack}>
            <View
              style={[
                styles.sliderIndicator,
                { left: currentIndex === 0 ? '0%' : '50%' },
              ]}
            />
          </View>
          <View style={styles.sliderDots}>
            {[0, 1].map((index) => (
              <TouchableOpacity
                key={index}
                onPress={() => scrollToIndex(index)}
                style={styles.dotButton}
              >
                <View
                  style={[
                    styles.dot,
                    currentIndex === index && styles.dotActive,
                  ]}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <LinearGradient
              colors={['#8b5cf6', '#7c3aed']}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={[styles.shareIcon, { color: colors.text }]}>📤</Text>
              <Text style={[styles.buttonText, { color: colors.text }]}>Share Ideas</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.downloadButton} onPress={handleSaveEvent}>
            <View style={styles.outlineButton}>
              <Text style={[styles.saveIcon, { color: colors.text }]}>📝</Text>
              <Text style={[styles.outlineButtonText, { color: colors.text }]}>Save Event</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Regenerate All Button */}
        <TouchableOpacity
          style={styles.regenerateButton}
          onPress={handleRegenerateAll}
          disabled={regenerating !== null}
        >
          {regenerating === 'all' ? (
            <ActivityIndicator color="#A78BFA" />
          ) : (
            <>
              <Text style={styles.refreshIcon}>🔄</Text>
              <Text style={styles.regenerateText}>Get New Ideas</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Go to Home Button */}
        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => navigation.navigate('MyEvents')}
        >
          <LinearGradient
            colors={['#8b5cf6', '#7c3aed']}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={[styles.homeIcon, { color: colors.text }]}>🏠</Text>
            <Text style={[styles.homeButtonText, { color: colors.text }]}>My Events</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
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
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  carousel: {
    paddingHorizontal: 40,
  },
  cardContainer: {
    width: CARD_WIDTH,
    alignItems: 'center',
    marginRight: 0,
  },
  cardWrapper: {
    width: '100%',
    aspectRatio: 0.7,
    borderRadius: 20,
    overflow: 'hidden',
  },
  decorCard: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    padding: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    overflow: 'hidden',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  eventHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  eventName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 20,
  },
  eventSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#D1D5DB',
    marginVertical: 20,
  },
  decorSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 8,
  },
  decorText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  eventInfo: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#D1D5DB',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  detailIcon: {
    fontSize: 20,
    color: '#6B7280',
    width: 24,
  },
  detailText: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 12,
    flex: 1,
  },
  optionLabel: {
    fontSize: 14,
    color: '#E9D5FF',
    marginTop: 15,
    fontWeight: '600',
  },
  regenerateSingleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(167, 139, 250, 0.2)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(167, 139, 250, 0.4)',
  },
  refreshIcon: {
    fontSize: 18,
    color: '#A78BFA',
  },
  regenerateSingleText: {
    fontSize: 13,
    color: '#E9D5FF',
    marginLeft: 6,
    fontWeight: '500',
  },
  sliderContainer: {
    marginTop: 30,
    marginBottom: 20,
    paddingHorizontal: 40,
  },
  sliderTrack: {
    height: 4,
    backgroundColor: 'rgba(167, 139, 250, 0.3)',
    borderRadius: 2,
    position: 'relative',
  },
  sliderIndicator: {
    position: 'absolute',
    width: '50%',
    height: '100%',
    backgroundColor: '#A78BFA',
    borderRadius: 2,
    transition: 'left 0.3s ease',
  },
  sliderDots: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -8,
  },
  dotButton: {
    padding: 8,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(167, 139, 250, 0.4)',
  },
  dotActive: {
    backgroundColor: '#A78BFA',
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: 40,
    marginBottom: 15,
  },
  shareButton: {
    flex: 1,
    marginRight: 10,
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareIcon: {
    fontSize: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  downloadButton: {
    flex: 1,
    marginLeft: 10,
  },
  outlineButton: {
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 12,
  },
  saveIcon: {
    fontSize: 20,
  },
  outlineButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  regenerateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingVertical: 12,
    marginHorizontal: 40,
    backgroundColor: 'rgba(167, 139, 250, 0.2)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(167, 139, 250, 0.4)',
  },
  regenerateText: {
    fontSize: 16,
    color: '#E9D5FF',
    marginLeft: 8,
    fontWeight: '600',
  },
  homeButton: {
    marginTop: 12,
    marginHorizontal: 40,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    marginBottom: 20,
  },
  homeIcon: {
    fontSize: 20,
  },
  homeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
