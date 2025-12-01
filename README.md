# 🎉 Eventify - Venue

**Manage your venue, bookings, and events effortlessly**

Eventify - Venue is a comprehensive venue management app designed for venue owners and managers. Manage your venue details, handle bookings, track events, and grow your business with ease.

## ✨ Features

- **🏢 Venue Management**: Complete control over your venue details, capacity, pricing, and amenities
- **📅 Booking Management**: View, accept, and manage event bookings for your venue
- **💰 Revenue Tracking**: Monitor bookings and revenue generation
- **👥 Customer Management**: Track client information and booking history
- **🌙 Dark/Light Mode**: Toggle between themes for comfortable viewing
- **📊 Analytics Dashboard**: Insights on bookings, peak times, and venue performance
- **🎯 Multiple Event Support**: Handle various event types - weddings, corporate events, birthdays, and more

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI: `npm install -g @expo/cli`
- Firebase account for authentication and data storage

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/eventify-venue.git
   cd eventify-venue
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication and choose Email/Password provider
   - Add your Firebase configuration to `src/config/firebaseConfig.js`

4. **Start the development server**
   ```bash
   npx expo start
   ```

5. **Run on device**
   - Scan the QR code with Expo Go app (Android/iOS)
   - Or press `a` for Android emulator, `i` for iOS simulator

## 📱 App Structure

### Authentication Flow
- **Welcome Screen**: Simple authentication entry point for venue managers
- **Sign Up/Login**: Firebase-powered user authentication for venue owners
- **Forgot Password**: Password reset functionality

### Main App Flow
- **Home Dashboard**: Venue overview with upcoming bookings and key metrics
- **Manage Venue**: Edit venue details, capacity, amenities, and pricing
- **Bookings**: View and manage all event bookings for your venue
- **My Events**: Track events scheduled at your venue
- **Profile**: Venue owner settings, theme toggle, and account management

### Navigation
- **Bottom Tab Navigation**: Home, Bookings, Manage, Profile
- **Clean UI**: Emoji icons (no external font dependencies)
- **Responsive Design**: Works on all screen sizes

## 🛠️ Tech Stack

- **Frontend**: React Native with Expo
- **Authentication**: Firebase Auth
- **Navigation**: React Navigation
- **Styling**: StyleSheet with Linear Gradients
- **State Management**: React Context (Auth & Theme)
- **Date/Time**: @react-native-community/datetimepicker
- **Database**: Firestore for venue and booking data
- **Icons**: Emoji-based (no external dependencies)

## 📂 Project Structure

```
src/
├── components/
│   ├── BottomNavigation.js    # Tab navigation
│   └── SettingsModal.js       # Settings overlay
├── context/
│   ├── AuthContext.js         # Authentication state
│   └── ThemeContext.js        # Theme management
├── screens/
│   ├── WelcomeScreen.js       # Authentication entry
│   ├── HomeScreen.js          # Venue dashboard
│   ├── FormScreen.js          # Venue management form
│   ├── MyEventsScreen.js      # Events at your venue
│   ├── BookingsScreen.js      # Booking management
│   └── ProfileScreen.js       # Venue owner profile
├── services/
│   ├── authService.js         # Authentication helpers
│   ├── firestoreService.js    # Firestore operations
│   └── userService.js         # Venue owner data
└── config/
    └── firebaseConfig.js      # Firebase setup
```

## 🎨 Key Features Explained

### Venue Management
- **Venue Details**: Name, location, capacity, contact information
- **Amenities**: List available facilities and services
- **Pricing**: Set rates for different event types and times
- **Operating Hours**: Define availability for bookings

### Booking Management
- **Incoming Requests**: View booking requests from event organizers
- **Approval System**: Accept or decline bookings
- **Calendar View**: Visual representation of booked dates
- **Booking Details**: Complete event information and client contact details

### Dashboard Analytics
- **Occupancy Rate**: Track venue utilization
- **Revenue Overview**: Monitor earnings from bookings
- **Upcoming Events**: Quick view of scheduled events
- **Client History**: Track repeat customers

## 🔧 Configuration

### Firebase Setup
1. Create a new Firebase project
2. Enable Authentication with Email/Password
3. Set up Firestore database for bookings and venue data
4. Get your Firebase config object
5. Update `src/config/firebaseConfig.js`:

```javascript
export const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};
```

### Firestore Setup
Enable Firestore collections for:
- `venues`: Store venue information
- `bookings`: Store booking requests and confirmations
- `users`: Store venue owner profile data

## 🚀 Deployment

### Expo Build
```bash
# Build for Android
npx expo build:android

# Build for iOS
npx expo build:ios
```

### App Store / Play Store
Follow Expo's deployment guides for publishing to app stores.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request


## 🙏 Acknowledgments

- Firebase for authentication and backend services
- Expo for React Native development platform
- React Navigation for smooth navigation
- The React Native community for amazing tools and support

## 📞 Support

For support, email [malikayan575@gmail.com].
---

**Made with ❤️ by Ayan Malik**

*Simplify venue management and grow your business with Eventify - Venue!*
