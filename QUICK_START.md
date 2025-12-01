# AI Invitation Generator - Quick Start Guide

## 🎉 Project Created Successfully!

Your AI-powered invitation generator React Native app with Expo has been set up with all the features you requested.

## ✨ Features Implemented

### 1. **Home Screen**
- Beautiful purple gradient background matching the screenshot
- Decorative animated dots pattern
- "Generate Invitation" button that leads to the form
- Bottom navigation bar with icons

### 2. **Form Screen**  
- Event name input field
- Venue input field
- Date picker (calendar icon)
- Time picker (clock icon)
- Vibe description textarea for AI prompt
- Validation for required fields
- Loading state during generation

### 3. **Results Screen**
- **Custom Purple Slider**: Horizontal carousel with purple-themed slider indicator
- **Two Invitation Cards**: Displays 2 AI-generated invitation designs
- **Individual Regenerate**: Button under each card to regenerate that specific invitation
- **Regenerate All**: Button to regenerate both invitations at once
- **Share Button**: Share invitations on social media
- **Download Button**: Save invitations to device gallery
- **Option Labels**: "Option 1" and "Option 2" under each card

### 4. **Invitation Card Design**
- Elegant gradient background (peach → purple → blue)
- Event name prominently displayed
- Venue with location icon
- Date with calendar icon
- Time with clock icon
- Decorative leaf elements (top and bottom)
- **NO extra information** (no RSVP, contact info, etc.)

### 5. **AI Integration**
- Google Gemini AI (API key configured)
- Generates creative invitation designs based on vibe description
- Creates 2 unique designs per request
- Properly formats event details

## 📁 Project Structure

```
native/
├── src/
│   ├── screens/
│   │   ├── HomeScreen.js       # Landing page
│   │   ├── FormScreen.js       # Event details input
│   │   └── ResultsScreen.js    # Generated invitations display
│   └── services/
│       └── aiService.js        # Gemini AI integration
├── App.js                      # Navigation setup
├── app.json                    # Expo config
├── package.json                # Dependencies
└── README.md                   # Full documentation
```

## 🚀 Next Steps to Run

### Option 1: After npm install completes

1. Start the development server:
   ```bash
   npx expo start
   ```

2. Choose your platform:
   - Press `a` for Android emulator
   - Press `i` for iOS simulator
   - Scan QR code with Expo Go app on your phone

### Option 2: If you encounter metro errors

If you see the ERR_PACKAGE_PATH_NOT_EXPORTED error, try this:

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npx expo start -c
```

Or use yarn instead:
```bash
yarn install
yarn start
```

## 📱 How to Use the App

1. **Launch**: Tap "Generate Invitation" on the home screen
2. **Fill Form**:
   - Enter event name (e.g., "Sarah's Birthday Party")
   - Enter venue (e.g., "The Grand Ballroom")
   - Select date using the picker
   - Select time using the picker
   - Describe the vibe (e.g., "Elegant and sophisticated with floral elements, soft pastel colors, romantic atmosphere")
3. **Generate**: Click "Generate Invitations" button
4. **Browse**: Swipe left/right to see both invitation options
5. **Customize**: Use "Regenerate" buttons if you want different designs
6. **Share**: Tap "Share" to share on social media
7. **Save**: Tap "Download" to save to your device

## 🎨 Design Features

- **Color Scheme**: Purple gradient theme (#2D1B69 → #5B21B6 → #7C3AED)
- **Custom Slider**: Purple track with animated indicator
- **Elegant Cards**: Soft gradient backgrounds with proper spacing
- **Icons**: Ionicons library for consistent iconography
- **Typography**: Clean, readable fonts with proper hierarchy

## ⚙️ Technical Details

- **Framework**: React Native with Expo SDK 51
- **Navigation**: React Navigation (Stack Navigator)
- **AI**: Google Gemini API
- **Image Handling**: ViewShot for capturing invitation cards
- **Sharing**: Expo Sharing & Media Library
- **Date/Time**: React Native DateTimePicker

## 🔑 API Key

The Gemini AI API key is already configured in `src/services/aiService.js`:
- Key: `AIzaSyCTeqe_JHkCKSFpEvRJEg_9SQkndk-pVZ4`

## 📝 Notes

- Invitations contain ONLY the information you provide (no RSVP, contact, etc.)
- The AI generates visual descriptions based on your vibe input
- Both invitations share the same event data but different designs
- Permissions are requested automatically for saving to gallery

## 🐛 Troubleshooting

If packages show incompatibility warnings:
```bash
npx expo install --fix
```

If metro bundler has issues:
```bash
npx expo start --clear
```

If Android/iOS build fails, ensure emulators are set up properly.

## 💡 Customization Ideas

- Modify colors in each screen's StyleSheet
- Add more invitation templates
- Customize the AI prompts in `aiService.js`
- Add more form fields for additional event details
- Implement invitation preview before generation

---

**Your app is ready to use! Just wait for npm install to complete and then run `npx expo start`** 🎉
