import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useSession } from '../context/AuthContext';
import { userService } from '../services/firestoreService';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';

export default function EditProfileScreen({ navigation }) {
  const { colors } = useTheme();
  const { user, userProfile, refreshUserData } = useSession();
  const [loading, setLoading] = useState(false);
  
  // Form state - initialize with preloaded data
  const [name, setName] = useState(userProfile?.name || '');
  const [venueName, setVenueName] = useState(userProfile?.venueName || '');
  const [gender, setGender] = useState(userProfile?.gender || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Update form when preloaded data changes (if user navigates back and forth)
  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name || '');
      setVenueName(userProfile.venueName || '');
      setGender(userProfile.gender || '');
    }
  }, [userProfile]);

  const handleUpdateProfile = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }

    if (!venueName.trim()) {
      Alert.alert('Error', 'Venue name cannot be empty');
      return;
    }

    if (!gender) {
      Alert.alert('Error', 'Please select a gender');
      return;
    }

    // If user wants to update password, validate it
    if (newPassword || currentPassword) {
      if (!currentPassword) {
        Alert.alert('Error', 'Please enter your current password to change it');
        return;
      }
      if (!newPassword) {
        Alert.alert('Error', 'Please enter a new password');
        return;
      }
      if (newPassword !== confirmPassword) {
        Alert.alert('Error', 'New passwords do not match');
        return;
      }
      if (newPassword.length < 6) {
        Alert.alert('Error', 'New password must be at least 6 characters long');
        return;
      }
    }

    setLoading(true);

    try {
      // Update profile in Firestore
      await userService.updateUserProfile(user.uid, {
        name: name.trim(),
        venueName: venueName.trim(),
        gender: gender,
      });

      // Update password if provided
      if (newPassword && currentPassword) {
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword);
      }

      // Refresh user data in context after successful update
      await refreshUserData();

      Alert.alert(
        'Success',
        'Profile updated successfully!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Error updating profile:', error);
      let errorMessage = 'Failed to update profile. Please try again.';
      
      if (error.code === 'auth/wrong-password') {
        errorMessage = 'Current password is incorrect.';
      } else if (error.code === 'auth/requires-recent-login') {
        errorMessage = 'Please log out and log back in to change your password.';
      }
      
      Alert.alert('Update Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={[styles.backIcon, { color: colors.primary }]}>‹</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>Edit Profile</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Name Field */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Full Name</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              placeholder="Enter your full name"
              placeholderTextColor={colors.textSecondary}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </View>

          {/* Venue Name Field */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Venue Name</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              placeholder="Enter your venue name"
              placeholderTextColor={colors.textSecondary}
              value={venueName}
              onChangeText={setVenueName}
              autoCapitalize="words"
            />
          </View>

          {/* Gender Field */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Gender</Text>
            <View style={styles.genderContainer}>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  {
                    backgroundColor: gender === 'male' ? colors.primary : colors.cardBackground,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => setGender('male')}
              >
                <Text style={[
                  styles.genderText,
                  { color: gender === 'male' ? '#1F2937' : colors.text }
                ]}>
                  Male
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  {
                    backgroundColor: gender === 'female' ? colors.primary : colors.cardBackground,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => setGender('female')}
              >
                <Text style={[
                  styles.genderText,
                  { color: gender === 'female' ? '#1F2937' : colors.text }
                ]}>
                  Female
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  {
                    backgroundColor: gender === 'other' ? colors.primary : colors.cardBackground,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => setGender('other')}
              >
                <Text style={[
                  styles.genderText,
                  { color: gender === 'other' ? '#1F2937' : colors.text }
                ]}>
                  Other
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Password Change Section */}
          <View style={styles.passwordSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Change Password (Optional)</Text>
            
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Current Password</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.cardBackground,
                    borderColor: colors.border,
                    color: colors.text,
                  },
                ]}
                placeholder="Enter current password"
                placeholderTextColor={colors.textSecondary}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>New Password</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.cardBackground,
                    borderColor: colors.border,
                    color: colors.text,
                  },
                ]}
                placeholder="Enter new password"
                placeholderTextColor={colors.textSecondary}
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Confirm New Password</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.cardBackground,
                    borderColor: colors.border,
                    color: colors.text,
                  },
                ]}
                placeholder="Confirm new password"
                placeholderTextColor={colors.textSecondary}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: colors.primary }]}
            onPress={handleUpdateProfile}
            disabled={loading}
          >
            <Text style={styles.saveButtonText}>
              {loading ? 'Updating...' : 'Save Changes'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 40,
    marginBottom: 30,
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 48,
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genderButton: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  genderText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  passwordSection: {
    marginTop: 30,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  saveButton: {
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#1F2937',
    fontSize: 16,
    fontWeight: 'bold',
  },
});