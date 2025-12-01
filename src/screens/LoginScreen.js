import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image
} from 'react-native';
// import { Ionicons } from '@expo/vector-icons'; // Temporarily commented out
import { useTheme } from '../context/ThemeContext';
import { useSession } from '../context/AuthContext';
import ErrorModal from '../components/ErrorModal';

export default function LoginScreen({ navigation }) {
  const { colors } = useTheme();
  const { signIn } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorDetails, setErrorDetails] = useState({ title: '', message: '', type: 'auth' });

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorDetails({
        title: 'Missing Information',
        message: 'Please enter both your email and password to continue.',
        type: 'validation'
      });
      setShowErrorModal(true);
      return;
    }

    setLoading(true);
    try {
      await signIn(email, password);
      // Navigation will be handled by the auth state change
    } catch (error) {
      let errorTitle = 'Login Failed';
      let errorMessage = 'We couldn\'t sign you in. Please check your credentials and try again.';
      
      if (error.code === 'auth/user-not-found') {
        errorTitle = 'Account Not Found';
        errorMessage = 'No account exists with this email address. Would you like to create a new account?';
      } else if (error.code === 'auth/wrong-password') {
        errorTitle = 'Incorrect Password';
        errorMessage = 'The password you entered is incorrect. Please try again or reset your password.';
      } else if (error.code === 'auth/invalid-email') {
        errorTitle = 'Invalid Email';
        errorMessage = 'Please enter a valid email address.';
      } else if (error.code === 'auth/too-many-requests') {
        errorTitle = 'Too Many Attempts';
        errorMessage = 'Too many failed login attempts. Please wait a few minutes before trying again.';
      } else if (error.code === 'auth/network-request-failed') {
        errorTitle = 'Connection Error';
        errorMessage = 'Please check your internet connection and try again.';
      }
      
      setErrorDetails({
        title: errorTitle,
        message: errorMessage,
        type: 'auth'
      });
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleErrorModalClose = () => {
    setShowErrorModal(false);
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  const handleSignUp = () => {
    navigation.navigate('SignUp');
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
            source={require('../../assets/New Eventify-Icon.png')}
            style={[styles.headerIcon, { tintColor: colors.primary }]}
            resizeMode="contain"
          />
          <Text style={[styles.title, { color: colors.text }]}>Welcome Back</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Sign in to continue to Eventify
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
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
              placeholder="Enter your password"
              placeholderTextColor={colors.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              textContentType="password"
            />
          </View>

          <TouchableOpacity
            style={[styles.loginButton, { backgroundColor: colors.primary }]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.loginButtonText}>
              {loading ? 'Signing In...' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={handleForgotPassword}
          >
            <Text style={[styles.forgotPasswordText, { color: colors.primary }]}>
              Forgot Password?
            </Text>
          </TouchableOpacity>
        </View>

        {/* Sign Up Link */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            Don't have an account?{' '}
          </Text>
          <TouchableOpacity onPress={handleSignUp}>
            <Text style={[styles.signUpText, { color: colors.primary }]}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Error Modal */}
      <ErrorModal
        visible={showErrorModal}
        onClose={handleErrorModalClose}
        title={errorDetails.title}
        message={errorDetails.message}
        errorType={errorDetails.type}
        primaryButton={{
          text: 'Try Again',
          onPress: () => {
            // Clear password field on auth errors for security
            if (errorDetails.type === 'auth') {
              setPassword('');
            }
          }
        }}
        secondaryButton={
          errorDetails.title === 'Account Not Found' ? {
            text: 'Create Account',
            onPress: handleSignUp
          } : (errorDetails.title === 'Incorrect Password' ? {
            text: 'Reset Password',
            onPress: handleForgotPassword
          } : null)
        }
      />
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
  loginButton: {
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: '#1F2937', // Dark text for Golden Field background
    fontSize: 16,
    fontWeight: 'bold',
  },
  forgotPassword: {
    alignItems: 'center',
    marginTop: 15,
  },
  forgotPasswordText: {
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
  },
  signUpText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});