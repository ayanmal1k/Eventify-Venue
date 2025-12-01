import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
// import { Ionicons } from '@expo/vector-icons'; // Temporarily commented out
import { useTheme } from '../context/ThemeContext';

export default function BottomNavigation({ navigation, currentRoute }) {
  const { colors } = useTheme();
  
  const navigateTo = (routeName) => {
    if (currentRoute !== routeName) {
      navigation.navigate(routeName);
    }
  };

  return (
    <View style={[styles.bottomNav, { backgroundColor: colors.cardBackground, borderTopColor: colors.border }]}>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigateTo('Home')}
      >
        <Image
          source={require('../../assets/Icons/home.png')}
          style={[
            styles.navIcon,
            { 
              tintColor: currentRoute === 'Home' ? colors.primary : colors.textSecondary,
              opacity: currentRoute === 'Home' ? 1 : 0.7
            }
          ]}
          resizeMode="contain"
        />
        <Text
          style={[
            styles.navText,
            { color: currentRoute === 'Home' ? colors.primary : colors.textSecondary },
            currentRoute === 'Home' && styles.navTextActive
          ]}
        >
          Home
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigateTo('MyEvents')}
      >
        <Image
          source={require('../../assets/Icons/calendar.png')}
          style={[
            styles.navIcon,
            { 
              tintColor: currentRoute === 'MyEvents' ? colors.primary : colors.textSecondary,
              opacity: currentRoute === 'MyEvents' ? 1 : 0.7
            }
          ]}
          resizeMode="contain"
        />
        <Text
          style={[
            styles.navText,
            { color: currentRoute === 'MyEvents' ? colors.primary : colors.textSecondary },
            currentRoute === 'MyEvents' && styles.navTextActive
          ]}
        >
          Events
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigateTo('EventProposals')}
      >
        <Image
          source={require('../../assets/Icons/confetti.png')}
          style={[
            styles.navIcon,
            { 
              tintColor: currentRoute === 'EventProposals' ? colors.primary : colors.textSecondary,
              opacity: currentRoute === 'EventProposals' ? 1 : 0.7
            }
          ]}
          resizeMode="contain"
        />
        <Text
          style={[
            styles.navText,
            { color: currentRoute === 'EventProposals' ? colors.primary : colors.textSecondary },
            currentRoute === 'EventProposals' && styles.navTextActive
          ]}
        >
          Proposals
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigateTo('Profile')}
      >
        <Image
          source={require('../../assets/Icons/user.png')}
          style={[
            styles.navIcon,
            { 
              tintColor: currentRoute === 'Profile' ? colors.primary : colors.textSecondary,
              opacity: currentRoute === 'Profile' ? 1 : 0.7
            }
          ]}
          resizeMode="contain"
        />
        <Text
          style={[
            styles.navText,
            { color: currentRoute === 'Profile' ? colors.primary : colors.textSecondary },
            currentRoute === 'Profile' && styles.navTextActive
          ]}
        >
          Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingBottom: 28,
    borderTopWidth: 1,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIcon: {
    width: 24,
    height: 24,
  },
  navText: {
    fontSize: 11,
    marginTop: 4,
  },
  navTextActive: {
    fontWeight: '600',
  },
  createButtonWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  createIcon: {
    width: 18,
    height: 18,
    tintColor: '#FFFFFF',
  },
});
