import React, { useState } from 'react';
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
  Image,
  Modal,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useSession } from '../context/AuthContext';
import { LAHORE_LOCATIONS } from '../data/lahoreLocations';

const CITIES = ['Lahore'];

export default function SignUpScreen({ navigation }) {
  const { colors } = useTheme();
  const { signUp } = useSession();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [venueName, setVenueName] = useState('');
  const [capacity, setCapacity] = useState('');
  const [selectedCity, setSelectedCity] = useState('Lahore');
  const [showCityModal, setShowCityModal] = useState(false);
  const [selectedArea, setSelectedArea] = useState('');
  const [customArea, setCustomArea] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [googleMapsLink, setGoogleMapsLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAreaModal, setShowAreaModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCustomArea, setIsCustomArea] = useState(false);

  // Filter locations based on search query
  const filteredLocations = LAHORE_LOCATIONS.filter(location =>
    location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setShowCityModal(false);
  };

  const handleAreaSelect = (area) => {
    setSelectedArea(area);
    setCustomArea('');
    setIsCustomArea(false);
    setSearchQuery('');
    setShowAreaModal(false);
  };

  const handleCustomAreaAdd = () => {
    if (customArea.trim()) {
      setSelectedArea(customArea);
      setIsCustomArea(true);
      setSearchQuery('');
      setShowAreaModal(false);
    } else {
      Alert.alert('Error', 'Please enter an area name');
    }
  };

  const handleSignUp = async () => {
    if (!name || !email || !password || !confirmPassword || !venueName || !capacity || !selectedCity || !selectedArea || !fullAddress) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password, name, venueName, capacity, selectedCity, selectedArea, fullAddress, phoneNumber, googleMapsLink);
      // Navigation will be handled by the auth state change
    } catch (error) {
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'An account with this email already exists.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please choose a stronger password.';
      }
      
      Alert.alert('Registration Error', errorMessage);
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
          <Image
            source={require('../../assets/Icons/user.png')}
            style={[styles.headerIcon, { tintColor: colors.primary }]}
            resizeMode="contain"
          />
          <Text style={[styles.title, { color: colors.text }]}>Create Venue Account</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Register your venue on Eventify
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
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
              textContentType="name"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Email</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              placeholder="Enter your email"
              placeholderTextColor={colors.textSecondary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              textContentType="emailAddress"
            />
          </View>

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

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Venue Capacity</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              placeholder="e.g., 500"
              placeholderTextColor={colors.textSecondary}
              value={capacity}
              onChangeText={setCapacity}
              keyboardType="numeric"
            />
          </View>

          {/* City Selection */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>City</Text>
            <TouchableOpacity
              style={[
                styles.dropdownButton,
                {
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.primary,
                },
              ]}
              onPress={() => setShowCityModal(true)}
            >
              <Text
                style={[
                  styles.dropdownButtonText,
                  { color: colors.text },
                ]}
              >
                {selectedCity}
              </Text>
              <Text style={[styles.dropdownButtonIcon, { color: colors.textSecondary }]}>
                {showCityModal ? '▲' : '▼'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Area Selection */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Area/Location</Text>
            <TouchableOpacity
              style={[
                styles.areaButton,
                {
                  backgroundColor: colors.cardBackground,
                  borderColor: selectedArea ? colors.primary : colors.border,
                },
              ]}
              onPress={() => setShowAreaModal(true)}
            >
              <Text
                style={[
                  styles.areaButtonText,
                  { color: selectedArea ? colors.text : colors.textSecondary },
                ]}
              >
                {selectedArea || 'Select Area/Location'}
              </Text>
              <Text style={[styles.areaButtonIcon, { color: colors.textSecondary }]}>
                {showAreaModal ? '▲' : '▼'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Full Address */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Full Address</Text>
            <TextInput
              style={[
                styles.input,
                styles.addressInput,
                {
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              placeholder="Enter complete venue address"
              placeholderTextColor={colors.textSecondary}
              value={fullAddress}
              onChangeText={setFullAddress}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          {/* Phone Number (Optional) */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Phone Number <Text style={[styles.optionalLabel, { color: colors.textSecondary }]}>(Optional)</Text></Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              placeholder="Enter your phone number (e.g., +92 300 1234567)"
              placeholderTextColor={colors.textSecondary}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
          </View>

          {/* Google Maps Link (Optional) */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Google Maps Link <Text style={[styles.optionalLabel, { color: colors.textSecondary }]}>(Optional)</Text></Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              placeholder="Paste Google Maps link to your venue"
              placeholderTextColor={colors.textSecondary}
              value={googleMapsLink}
              onChangeText={setGoogleMapsLink}
              keyboardType="url"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Password</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              placeholder="Create a password"
              placeholderTextColor={colors.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              textContentType="newPassword"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Confirm Password</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              placeholder="Confirm your password"
              placeholderTextColor={colors.textSecondary}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              textContentType="newPassword"
            />
          </View>

          <TouchableOpacity
            style={[styles.signUpButton, { backgroundColor: colors.primary }]}
            onPress={handleSignUp}
            disabled={loading}
          >
            <Text style={styles.signUpButtonText}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Sign In Link */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            Already have an account?{' '}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={[styles.signInText, { color: colors.primary }]}>
              Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* City Selection Modal */}
      <Modal
        visible={showCityModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCityModal(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          {/* Modal Header */}
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <TouchableOpacity
              onPress={() => setShowCityModal(false)}
            >
              <Text style={[styles.modalCloseButton, { color: colors.primary }]}>Cancel</Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Select City</Text>
            <View style={{ width: 60 }} />
          </View>

          {/* City List */}
          <FlatList
            data={CITIES}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.cityItem,
                  {
                    backgroundColor: colors.cardBackground,
                    borderBottomColor: colors.border,
                  },
                ]}
                onPress={() => handleCitySelect(item)}
              >
                <Text style={[styles.cityItemText, { color: colors.text }]}>
                  {item}
                </Text>
                {selectedCity === item && (
                  <Text style={[styles.checkmark, { color: colors.primary }]}>✓</Text>
                )}
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item}
            scrollEnabled
            contentContainerStyle={styles.listContent}
          />
        </View>
      </Modal>

      {/* Area Selection Modal */}
      <Modal
        visible={showAreaModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAreaModal(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          {/* Modal Header */}
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <TouchableOpacity
              onPress={() => {
                setShowAreaModal(false);
                setSearchQuery('');
                setCustomArea('');
              }}
            >
              <Text style={[styles.modalCloseButton, { color: colors.primary }]}>Cancel</Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Select Area</Text>
            <View style={{ width: 60 }} />
          </View>

          {/* Search Input */}
          <View style={styles.modalSearchContainer}>
            <TextInput
              style={[
                styles.modalSearchInput,
                {
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              placeholder="Search areas..."
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
          </View>

          {/* Location List */}
          <FlatList
            data={filteredLocations}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.locationItem,
                  {
                    backgroundColor: colors.cardBackground,
                    borderBottomColor: colors.border,
                  },
                ]}
                onPress={() => handleAreaSelect(item)}
              >
                <Text style={[styles.locationText, { color: colors.text }]}>
                  {item}
                </Text>
                {selectedArea === item && (
                  <Text style={[styles.checkmark, { color: colors.primary }]}>✓</Text>
                )}
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item}
            scrollEnabled
            contentContainerStyle={styles.listContent}
          />

          {/* Custom Area Section */}
          <View style={[styles.customAreaSection, { borderTopColor: colors.border }]}>
            <Text style={[styles.customAreaLabel, { color: colors.textSecondary }]}>
              Don't see your area?
            </Text>
            <View style={styles.customAreaInputContainer}>
              <TextInput
                style={[
                  styles.customAreaInput,
                  {
                    backgroundColor: colors.cardBackground,
                    borderColor: colors.border,
                    color: colors.text,
                  },
                ]}
                placeholder="Enter area name"
                placeholderTextColor={colors.textSecondary}
                value={customArea}
                onChangeText={setCustomArea}
              />
              <TouchableOpacity
                style={[styles.customAreaButton, { backgroundColor: colors.primary }]}
                onPress={handleCustomAreaAdd}
              >
                <Text style={[styles.customAreaButtonText, { color: colors.text }]}>
                  Add
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  headerIcon: {
    width: 60,
    height: 60,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  form: {
    width: '100%',
    marginBottom: 30,
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
  addressInput: {
    height: 80,
    paddingVertical: 12,
  },
  dropdownButton: {
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownButtonText: {
    fontSize: 16,
    flex: 1,
  },
  dropdownButtonIcon: {
    fontSize: 12,
    marginLeft: 10,
  },
  areaButton: {
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  areaButtonText: {
    fontSize: 16,
    flex: 1,
  },
  areaButtonIcon: {
    fontSize: 12,
    marginLeft: 10,
  },
  signUpButton: {
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  signUpButtonText: {
    color: '#1F2937',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
  },
  signInText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    paddingTop: 50,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  modalCloseButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalSearchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  modalSearchInput: {
    height: 45,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  listContent: {
    paddingHorizontal: 20,
  },
  cityItem: {
    paddingVertical: 15,
    paddingHorizontal: 12,
    marginVertical: 4,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  cityItemText: {
    fontSize: 16,
    flex: 1,
  },
  locationItem: {
    paddingVertical: 15,
    paddingHorizontal: 12,
    marginVertical: 4,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  locationText: {
    fontSize: 16,
    flex: 1,
  },
  checkmark: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  customAreaSection: {
    borderTopWidth: 1,
    padding: 20,
  },
  customAreaLabel: {
    fontSize: 14,
    marginBottom: 12,
    fontWeight: '500',
  },
  customAreaInputContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  customAreaInput: {
    flex: 1,
    height: 45,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  customAreaButton: {
    width: 60,
    height: 45,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customAreaButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  optionalLabel: {
    fontSize: 14,
    fontWeight: '400',
  },
});