// Authentication Service
// This service provides methods for user authentication using Firebase Auth

import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebaseConfig';
import { locationsService } from './firestoreService';

// Authentication Services
export const getCurrentUser = async () => {
  try {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe();
        resolve(user ? { user } : null);
      });
    });
  } catch (error) {
    console.error("[error getting user] ==>", error);
    return null;
  }
};

export async function login(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user };
  } catch (e) {
    console.error("[error logging in] ==>", e);
    throw e;
  }
}

export async function logout() {
  try {
    await signOut(auth);
  } catch (e) {
    console.error("[error logging out] ==>", e);
    throw e;
  }
}

export async function register(email, password, name, venueName, capacity, city, area, fullAddress, phoneNumber, googleMapsLink) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    if (name) {
      await updateProfile(user, { displayName: name });
    }

    // Store venue data in Firestore with user ID as document ID (venue ID)
    await setDoc(doc(db, 'venues', user.uid), {
      name: name || '',
      email: email,
      venueName: venueName || '',
      capacity: capacity || '',
      city: city || 'Lahore',
      area: area || '',
      fullAddress: fullAddress || '',
      phoneNumber: phoneNumber || '',
      googleMapsLink: googleMapsLink || '',
      venueId: user.uid,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log('Venue profile created in Firestore with ID:', user.uid);

    // Update location count
    try {
      await locationsService.updateLocationCount(city, area);
      console.log('Location count updated successfully');
    } catch (locationError) {
      console.error('Error updating location count:', locationError);
      // Don't throw - location tracking is not critical to registration
    }
    
    return { user: userCredential.user };
  } catch (e) {
    console.error("[error registering] ==>", e);
    throw e;
  }
}
