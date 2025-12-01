import './asset-registry-polyfill';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from './src/context/ThemeContext';
import { SessionProvider, useSession } from './src/context/AuthContext';
import SplashScreen from './src/screens/SplashScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import HomeScreen from './src/screens/HomeScreen';
import MyEventsScreen from './src/screens/MyEventsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import EditProfileScreen from './src/screens/EditProfileScreen';
import AboutScreen from './src/screens/AboutScreen';
import FAQScreen from './src/screens/FAQScreen';
import EventProposalScreen from './src/screens/FormScreen';
import ResultsScreen from './src/screens/ResultsScreen';
import ProposalNotificationModal from './src/components/ProposalNotificationModal';
import { proposalsService } from './src/services/firestoreService';

const Stack = createStackNavigator();

// Auth Navigator for login/signup screens
function AuthNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#1F1B24' },
        cardStyleInterpolator: CardStyleInterpolators.forNoAnimation,
        transitionSpec: {
          open: {
            animation: 'timing',
            config: {
              duration: 0,
            },
          },
          close: {
            animation: 'timing',
            config: {
              duration: 0,
            },
          },
        },
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
  );
}

// App Navigator for main app screens
function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#1F1B24' },
        cardStyleInterpolator: CardStyleInterpolators.forNoAnimation,
        transitionSpec: {
          open: {
            animation: 'timing',
            config: {
              duration: 0,
            },
          },
          close: {
            animation: 'timing',
            config: {
              duration: 0,
            },
          },
        },
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="MyEvents" component={MyEventsScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="About" component={AboutScreen} />
      <Stack.Screen name="FAQ" component={FAQScreen} />
      <Stack.Screen name="EventProposals" component={EventProposalScreen} />
      <Stack.Screen name="Results" component={ResultsScreen} />
    </Stack.Navigator>
  );
}

// Main App Content with Authentication Logic and Proposal Checking
function AppContent() {
  const { user, isFullyLoaded, userProfile } = useSession();
  const [showSplash, setShowSplash] = useState(true);
  const [proposalModalVisible, setProposalModalVisible] = useState(false);
  const [currentProposal, setCurrentProposal] = useState(null);
  const [navigationRef, setNavigationRef] = useState(null);

  // Add a timeout for splash screen to prevent infinite loading
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log("Splash screen timeout reached, forcing navigation");
      setShowSplash(false);
    }, 8000); // Increased timeout to 8 seconds for data loading

    return () => clearTimeout(timer);
  }, []);

  // Check for pending proposals every minute when user is logged in
  useEffect(() => {
    let proposalCheckInterval;

    const checkForProposals = async () => {
      if (user?.uid && userProfile?.area) {
        try {
          const proposal = await proposalsService.getFirstUnreadProposal(user.uid, userProfile.area);
          if (proposal) {
            setCurrentProposal(proposal);
            setProposalModalVisible(true);
            console.log('New unread proposal found:', proposal.eventName);
          }
        } catch (error) {
          console.error('Error checking for proposals:', error);
        }
      }
    };

    // Check immediately when user logs in
    if (user?.uid && userProfile?.area && isFullyLoaded) {
      checkForProposals();
      
      // Then set up interval to check every minute (60000 ms)
      proposalCheckInterval = setInterval(checkForProposals, 60000);
    }

    return () => {
      if (proposalCheckInterval) {
        clearInterval(proposalCheckInterval);
      }
    };
  }, [user?.uid, userProfile?.area, isFullyLoaded]);

  const handleViewProposal = async () => {
    if (currentProposal && user?.uid) {
      try {
        // Add proposal to dismissed list before navigating
        await proposalsService.addToDismissedProposals(user.uid, currentProposal.id);
      } catch (error) {
        console.error('Error dismissing proposal:', error);
      }
    }
    setProposalModalVisible(false);
    // Navigate to EventProposals screen
    if (navigationRef) {
      navigationRef.navigate('EventProposals');
    }
  };

  const handleCloseProposal = async () => {
    if (currentProposal && user?.uid) {
      try {
        // Add proposal to dismissed list when closed
        await proposalsService.addToDismissedProposals(user.uid, currentProposal.id);
      } catch (error) {
        console.error('Error dismissing proposal:', error);
      }
    }
    setProposalModalVisible(false);
    setCurrentProposal(null);
  };

  console.log("AppContent render - isFullyLoaded:", isFullyLoaded, "user:", !!user, "showSplash:", showSplash);

  // Show splash screen until all data is loaded or timeout
  if (showSplash && !isFullyLoaded) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  console.log("Rendering navigator - user authenticated:", !!user);

  return (
    <NavigationContainer ref={setNavigationRef}>
      <StatusBar style="light" />
      {user ? (
        <>
          <AppNavigator />
          <ProposalNotificationModal
            visible={proposalModalVisible}
            proposal={currentProposal}
            onClose={handleCloseProposal}
            onViewProposal={handleViewProposal}
          />
        </>
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <SessionProvider>
        <AppContent />
      </SessionProvider>
    </ThemeProvider>
  );
}
