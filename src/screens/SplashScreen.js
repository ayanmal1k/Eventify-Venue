import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Animated,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ onFinish }) {
  const { colors } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Fade in and scale animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate after delay
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => onFinish());
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: '#f8f8ec' }]}>
      {/* Decorative dots pattern */}
      <View style={styles.dotsContainer}>
        {[...Array(80)].map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              {
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.4 + 0.1,
                backgroundColor: colors.dot,
              },
            ]}
          />
        ))}
      </View>

      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Logo with Text */}
        <View style={styles.logoWrapper}>
          <Image
            source={require('../../assets/New-logo.jpg')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  logoContainer: {
    alignItems: 'center',
  },
  logoWrapper: {
    marginBottom: 32,
  },
  logo: {
    width: 500, // Increased from 220 to 300
    height: 500, // Increased from 220 to 300
  },
  tagline: {
    fontSize: 18,
    letterSpacing: 1,
    fontWeight: '500',
  },
});
