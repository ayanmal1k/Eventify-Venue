import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { getCurrentUser, login, logout, register } from "../services/authService";
import { auth } from "../config/firebaseConfig";
import { userService, eventsService } from "../services/firestoreService";

// Authentication context interface
const AuthContext = createContext({});

// Custom hook to access authentication context
export function useSession() {
  const value = useContext(AuthContext);
  
  if (!value) {
    throw new Error("useSession must be wrapped in a <SessionProvider />");
  }
  
  return value;
}

// SessionProvider component that manages authentication state and preloads data
export function SessionProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [userEvents, setUserEvents] = useState([]);

  // Function to load user data
  const loadUserData = async (userId) => {
    if (!userId) {
      setUserProfile(null);
      setUserEvents([]);
      setIsDataLoading(false);
      return;
    }

    try {
      console.log("Loading user data for:", userId);
      setIsDataLoading(true);
      
      // Load user profile first
      const profile = await userService.getUserProfile(userId);
      setUserProfile(profile);
      
      // For venues, fetch events assigned to this venue
      // For organizers, fetch events they created
      let events = [];
      if (profile && profile.venueId) {
        // This is a venue user - fetch assigned events
        events = await eventsService.getAssignedVenueEvents(userId);
      } else {
        // This is an organizer user - fetch their created events
        events = await eventsService.getUserEvents(userId);
      }
      
      console.log("User data loaded successfully");
      
      // Sort events by date (upcoming first)
      const sortedEvents = events.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA - dateB;
      });
      
      setUserEvents(sortedEvents);
    } catch (error) {
      console.error('Error loading user data:', error);
      setUserProfile(null);
      setUserEvents([]);
    } finally {
      setIsDataLoading(false);
    }
  };

  // Set up Firebase authentication state listener
  useEffect(() => {
    console.log("Setting up Firebase auth listener...");
    
    try {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        console.log("Auth state changed:", user ? "User logged in" : "No user");
        setUser(user);
        setIsLoading(false);
        
        // Load user data when authenticated
        if (user) {
          await loadUserData(user.uid);
        } else {
          setUserProfile(null);
          setUserEvents([]);
          setIsDataLoading(false);
        }
      }, (error) => {
        console.error("Auth state change error:", error);
        setIsLoading(false);
        setIsDataLoading(false);
      });

      // Cleanup subscription on unmount
      return () => {
        console.log("Cleaning up auth listener");
        unsubscribe();
      };
    } catch (error) {
      console.error("Error setting up auth listener:", error);
      setIsLoading(false);
      setIsDataLoading(false);
    }
  }, []);

  // Handle user sign-in process
  const handleSignIn = async (email, password) => {
    try {
      const response = await login(email, password);
      return response?.user;
    } catch (error) {
      console.error("[handleSignIn error] ==>", error);
      throw error;
    }
  };

  // Handle new user registration process
  const handleSignUp = async (email, password, name, venueName, capacity, city, area, fullAddress, phoneNumber, googleMapsLink) => {
    try {
      const response = await register(email, password, name, venueName, capacity, city, area, fullAddress, phoneNumber, googleMapsLink);
      return response?.user;
    } catch (error) {
      console.error("[handleSignUp error] ==>", error);
      throw error;
    }
  };

  // Handle user sign-out process
  const handleSignOut = async () => {
    try {
      await logout();
      setUser(null);
      setUserProfile(null);
      setUserEvents([]);
    } catch (error) {
      console.error("[handleSignOut error] ==>", error);
      throw error;
    }
  };

  // Function to refresh user data
  const refreshUserData = async () => {
    if (user?.uid) {
      await loadUserData(user.uid);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        signIn: handleSignIn,
        signUp: handleSignUp,
        signOut: handleSignOut,
        refreshUserData,
        user,
        userProfile,
        userEvents,
        isLoading,
        isDataLoading,
        isFullyLoaded: !isLoading && !isDataLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}