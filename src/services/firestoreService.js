import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  setDoc
} from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

// Events collection operations
export const eventsService = {
  // Create a new event
  async createEvent(eventData) {
    try {
      const docRef = await addDoc(collection(db, 'events'), {
        ...eventData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log('Event created with ID: ', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error adding event: ', error);
      throw error;
    }
  },

  // Get all events
  async getAllEvents() {
    try {
      const querySnapshot = await getDocs(collection(db, 'events'));
      const events = [];
      querySnapshot.forEach((doc) => {
        events.push({ id: doc.id, ...doc.data() });
      });
      return events;
    } catch (error) {
      console.error('Error getting events: ', error);
      throw error;
    }
  },

  // Get events by user ID
  async getUserEvents(userId) {
    try {
      const q = query(collection(db, 'events'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      const events = [];
      querySnapshot.forEach((doc) => {
        events.push({ id: doc.id, ...doc.data() });
      });
      return events;
    } catch (error) {
      console.error('Error getting user events: ', error);
      throw error;
    }
  },

  // Get events by assigned venue ID
  async getAssignedVenueEvents(venueId) {
    try {
      const q = query(collection(db, 'events'), where('assignedVenueId', '==', venueId));
      const querySnapshot = await getDocs(q);
      const events = [];
      querySnapshot.forEach((doc) => {
        events.push({ id: doc.id, ...doc.data() });
      });
      return events;
    } catch (error) {
      console.error('Error getting assigned venue events: ', error);
      throw error;
    }
  },

  // Get a specific event
  async getEvent(eventId) {
    try {
      const docRef = doc(db, 'events', eventId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        console.log('No such event!');
        return null;
      }
    } catch (error) {
      console.error('Error getting event: ', error);
      throw error;
    }
  },

  // Update an event
  async updateEvent(eventId, updateData) {
    try {
      const docRef = doc(db, 'events', eventId);
      await updateDoc(docRef, {
        ...updateData,
        updatedAt: new Date()
      });
      console.log('Event updated successfully');
    } catch (error) {
      console.error('Error updating event: ', error);
      throw error;
    }
  },

  // Delete an event
  async deleteEvent(eventId) {
    try {
      const docRef = doc(db, 'events', eventId);
      await deleteDoc(docRef);
      console.log('Event deleted successfully');
    } catch (error) {
      console.error('Error deleting event: ', error);
      throw error;
    }
  },

  // Listen to events in real-time
  subscribeToEvents(callback) {
    const unsubscribe = onSnapshot(collection(db, 'events'), (querySnapshot) => {
      const events = [];
      querySnapshot.forEach((doc) => {
        events.push({ id: doc.id, ...doc.data() });
      });
      callback(events);
    }, (error) => {
      console.error('Error listening to events: ', error);
    });
    return unsubscribe;
  }
};

// User profiles collection operations
export const userService = {
  // Create or update user profile
  async updateUserProfile(userId, profileData) {
    try {
      const docRef = doc(db, 'venues', userId);
      await updateDoc(docRef, {
        ...profileData,
        updatedAt: new Date()
      });
      console.log('User profile updated successfully');
    } catch (error) {
      console.error('Error updating user profile: ', error);
      throw error;
    }
  },

  // Get user profile
  async getUserProfile(userId) {
    try {
      const docRef = doc(db, 'venues', userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        console.log('No user profile found!');
        return null;
      }
    } catch (error) {
      console.error('Error getting user profile: ', error);
      throw error;
    }
  },

  // Create user profile
  async createUserProfile(userId, profileData) {
    try {
      const docRef = doc(db, 'venues', userId);
      await updateDoc(docRef, {
        ...profileData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log('User profile created successfully');
    } catch (error) {
      console.error('Error creating user profile: ', error);
      throw error;
    }
  },

  // Get user data (name and phone) from users collection
  async getUserData(userId) {
    try {
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          name: data.name || data.fullName || 'Unknown',
          phoneNumber: data.phoneNumber || null,
          ...data
        };
      } else {
        console.log('No user found in users collection!');
        return null;
      }
    } catch (error) {
      console.error('Error getting user data: ', error);
      throw error;
    }
  }
};

// Locations collection operations
export const locationsService = {
  // Update or create location count
  async updateLocationCount(city, area) {
    try {
      // Create a document ID based on city and area
      const locationId = `${city}_${area}`.replace(/\s+/g, '_').toLowerCase();
      const docRef = doc(db, 'locations', locationId);
      
      // Try to get the existing document
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        // If location exists, increment the count
        await updateDoc(docRef, {
          count: docSnap.data().count + 1,
          updatedAt: new Date()
        });
        console.log(`Location count updated for ${city} - ${area}`);
      } else {
        // If location doesn't exist, create a new record
        await setDoc(docRef, {
          city: city,
          area: area,
          count: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        console.log(`New location record created for ${city} - ${area}`);
      }
    } catch (error) {
      console.error('Error updating location count: ', error);
      throw error;
    }
  },

  // Get all locations
  async getAllLocations() {
    try {
      const querySnapshot = await getDocs(collection(db, 'locations'));
      const locations = [];
      querySnapshot.forEach((doc) => {
        locations.push({ id: doc.id, ...doc.data() });
      });
      return locations;
    } catch (error) {
      console.error('Error getting locations: ', error);
      throw error;
    }
  },

  // Get locations by city
  async getLocationsByCity(city) {
    try {
      const q = query(collection(db, 'locations'), where('city', '==', city));
      const querySnapshot = await getDocs(q);
      const locations = [];
      querySnapshot.forEach((doc) => {
        locations.push({ id: doc.id, ...doc.data() });
      });
      return locations;
    } catch (error) {
      console.error('Error getting locations by city: ', error);
      throw error;
    }
  },

  // Get a specific location
  async getLocation(city, area) {
    try {
      const locationId = `${city}_${area}`.replace(/\s+/g, '_').toLowerCase();
      const docRef = doc(db, 'locations', locationId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting location: ', error);
      throw error;
    }
  }
};

// Proposals service for fetching pending proposals
export const proposalsService = {
  // Get pending proposals for a venue area
  async getPendingProposalsForVenue(venueArea) {
    try {
      const q = query(
        collection(db, 'events'),
        where('venue', '==', venueArea),
        where('status', '==', 'pending')
      );
      const querySnapshot = await getDocs(q);
      const proposals = [];
      querySnapshot.forEach((doc) => {
        proposals.push({ id: doc.id, ...doc.data() });
      });
      // Sort by creation date, newest first
      return proposals.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateB - dateA;
      });
    } catch (error) {
      console.error('Error getting pending proposals:', error);
      throw error;
    }
  },

  // Get first unread pending proposal
  async getFirstPendingProposal(venueArea) {
    try {
      const proposals = await this.getPendingProposalsForVenue(venueArea);
      return proposals.length > 0 ? proposals[0] : null;
    } catch (error) {
      console.error('Error getting first pending proposal:', error);
      return null;
    }
  },

  // Get first unread pending proposal that is not dismissed
  async getFirstUnreadProposal(venueId, venueArea) {
    try {
      const proposals = await this.getPendingProposalsForVenue(venueArea);
      
      // Get the dismissed proposals list from the venue document
      const dismissedProposals = await this.getDismissedProposalsForVenue(venueId);
      
      // Find the first proposal that is not in the dismissed list
      const unreadProposal = proposals.find(proposal => !dismissedProposals.includes(proposal.id));
      
      return unreadProposal || null;
    } catch (error) {
      console.error('Error getting first unread proposal:', error);
      return null;
    }
  },

  // Get dismissed proposals list for a venue
  async getDismissedProposalsForVenue(venueId) {
    try {
      const docRef = doc(db, 'venues', venueId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return data.dismissedPopup || [];
      } else {
        return [];
      }
    } catch (error) {
      console.error('Error getting dismissed proposals:', error);
      return [];
    }
  },

  // Add proposal to dismissed list
  async addToDismissedProposals(venueId, proposalId) {
    try {
      const docRef = doc(db, 'venues', venueId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const dismissedList = docSnap.data().dismissedPopup || [];
        
        // Only add if not already in the list
        if (!dismissedList.includes(proposalId)) {
          dismissedList.push(proposalId);
          await updateDoc(docRef, {
            dismissedPopup: dismissedList,
            updatedAt: new Date()
          });
          console.log('Proposal added to dismissed list:', proposalId);
        }
      } else {
        // If venue document doesn't exist, create it with dismissedPopup
        await setDoc(docRef, {
          dismissedPopup: [proposalId],
          updatedAt: new Date()
        });
        console.log('Created venue document with dismissed proposal:', proposalId);
      }
    } catch (error) {
      console.error('Error adding to dismissed proposals:', error);
      throw error;
    }
  }
};