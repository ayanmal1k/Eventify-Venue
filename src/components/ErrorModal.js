import React, { useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';

const { width, height } = Dimensions.get('window');

export default function ErrorModal({ visible, onClose, title, message, primaryButton, secondaryButton, errorType }) {
  const { colors } = useTheme();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (visible) {
      // Start animations when modal becomes visible
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Start shake and pulse animations for error icon
        Animated.parallel([
          Animated.sequence([
            Animated.timing(shakeAnim, {
              toValue: 10,
              duration: 50,
              useNativeDriver: true,
            }),
            Animated.timing(shakeAnim, {
              toValue: -10,
              duration: 50,
              useNativeDriver: true,
            }),
            Animated.timing(shakeAnim, {
              toValue: 10,
              duration: 50,
              useNativeDriver: true,
            }),
            Animated.timing(shakeAnim, {
              toValue: 0,
              duration: 50,
              useNativeDriver: true,
            }),
          ]),
          Animated.loop(
            Animated.sequence([
              Animated.timing(pulseAnim, {
                toValue: 1.1,
                duration: 800,
                useNativeDriver: true,
              }),
              Animated.timing(pulseAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
              }),
            ])
          ),
        ]).start();
      });
    } else {
      // Reset animations when modal closes
      scaleAnim.setValue(0);
      fadeAnim.setValue(0);
      shakeAnim.setValue(0);
      pulseAnim.setValue(1);
    }
  }, [visible]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  // Get error icon and color based on error type
  const getErrorIcon = () => {
    switch (errorType) {
      case 'auth':
        return '🔐';
      case 'network':
        return '🌐';
      case 'validation':
        return '⚠️';
      default:
        return '❌';
    }
  };

  const getErrorColor = () => {
    switch (errorType) {
      case 'auth':
        return '#FF6B6B';
      case 'network':
        return '#FFA726';
      case 'validation':
        return '#FFEB3B';
      default:
        return '#F44336';
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <Animated.View 
        style={[styles.overlay, { opacity: fadeAnim }]}
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.4)', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0.9)']}
          style={styles.overlayGradient}
        />
        
        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [
                { scale: scaleAnim },
                {
                  translateY: scaleAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <LinearGradient
            colors={[colors.gradient1, colors.gradient2, colors.gradient3]}
            style={styles.modalContent}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {/* Error Icon */}
            <View style={[styles.iconContainer, { backgroundColor: getErrorColor() + '20' }]}>
              <Animated.View
                style={[
                  styles.errorIconContainer,
                  {
                    transform: [
                      { translateX: shakeAnim },
                      { scale: pulseAnim },
                    ],
                  },
                ]}
              >
                <Text style={[styles.errorIcon, { color: getErrorColor() }]}>
                  {getErrorIcon()}
                </Text>
              </Animated.View>
            </View>

            {/* Title */}
            <Text style={[styles.title, { color: colors.text }]}>{title}</Text>

            {/* Message */}
            <Text style={[styles.message, { color: colors.textSecondary }]}>{message}</Text>

            {/* Error Tips for Auth Errors */}
            {errorType === 'auth' && (
              <View style={[styles.tipsContainer, { backgroundColor: colors.cardBackground + '50' }]}>
                <Text style={[styles.tipsTitle, { color: colors.text }]}>💡 Quick Tips</Text>
                <Text style={[styles.tipsText, { color: colors.textTertiary }]}>
                  • Double-check your email and password{'\n'}
                  • Make sure Caps Lock is off{'\n'}
                  • Try resetting your password if needed
                </Text>
              </View>
            )}

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              {primaryButton && (
                <TouchableOpacity
                  style={[styles.primaryButton, { backgroundColor: getErrorColor() }]}
                  onPress={() => {
                    handleClose();
                    primaryButton.onPress && primaryButton.onPress();
                  }}
                >
                  <Text style={[styles.primaryButtonText, { color: '#FFFFFF' }]}>
                    {primaryButton.text}
                  </Text>
                </TouchableOpacity>
              )}

              {secondaryButton && (
                <TouchableOpacity
                  style={[styles.secondaryButton, { borderColor: colors.border }]}
                  onPress={() => {
                    handleClose();
                    secondaryButton.onPress && secondaryButton.onPress();
                  }}
                >
                  <Text style={[styles.secondaryButtonText, { color: colors.text }]}>
                    {secondaryButton.text}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </LinearGradient>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    width: width * 0.85,
    maxWidth: 400,
  },
  modalContent: {
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  errorIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorIcon: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  tipsContainer: {
    width: '100%',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  tipsText: {
    fontSize: 14,
    lineHeight: 20,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    backgroundColor: 'transparent',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});