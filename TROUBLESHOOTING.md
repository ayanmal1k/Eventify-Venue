# Troubleshooting Metro Error

If you see this error:
```
Error [ERR_PACKAGE_PATH_NOT_EXPORTED]: Package subpath './src/lib/TerminalReporter' is not defined by "exports"
```

## Quick Fix:

### Method 1: Use Yarn (Recommended)
```bash
npm install -g yarn
yarn install
yarn start
```

### Method 2: Clean Reinstall with npm
```powershell
# Remove node_modules and lock file
Remove-Item node_modules -Recurse -Force
Remove-Item package-lock.json -Force

# Reinstall with legacy peer deps
npm install --legacy-peer-deps

# Start with clear cache
npx expo start --clear
```

### Method 3: Downgrade Node (if using Node 23+)
The issue might be related to Node.js version. Try using Node.js LTS (v20 or v18):
```bash
# Use nvm to switch Node version
nvm install 20
nvm use 20

# Then reinstall
npm install
npx expo start
```

### Method 4: Create new Expo project and copy files
If all else fails:
```bash
cd ..
npx create-expo-app my-invitation-app
cd my-invitation-app

# Copy these files from the 'native' folder:
# - src/ folder
# - App.js
# - package.json dependencies (merge manually)

npm install @react-navigation/native @react-navigation/stack
npm install react-native-gesture-handler react-native-reanimated react-native-safe-area-context react-native-screens
npm install expo-linear-gradient @react-native-community/datetimepicker
npm install expo-file-system expo-sharing expo-media-library
npm install @google/generative-ai react-native-view-shot

npx expo start
```

## Why This Happens

This is a known issue with:
- Newer Node.js versions (23+) having stricter package exports
- Metro bundler compatibility with certain Expo SDK versions
- Package manager differences (npm vs yarn)

## Best Solution for Production

Use Yarn or ensure you're on Node.js LTS version (v20 or v18) for the best compatibility with Expo SDK 51.
