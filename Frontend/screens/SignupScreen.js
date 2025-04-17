import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingOverlay from './LoadingOverlay';
import ErrorPopup from './ErrorPopup';

// const API_URL = 'http://localhost:8080/signup';
// const API_URL = 'http://10.0.2.2:8080/signup';
// const API_URL = 'https://backend-app-t0ym.onrender.com/signup';

const SignupScreen = ({ navigation,API_URL }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [popupVisible, setPopupVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        // Success: navigate to OTP verification
        navigation.navigate('OTPVerification', { email });
      } else {
        // For example, if email already exists
        setError(data.message || 'Signup Failed');
        setPopupVisible(true);
      }
    } catch (error) {
      setError('Something went wrong');
      setPopupVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LoadingOverlay visible={isLoading} message="Signing Up..." />
      <ErrorPopup
        visible={popupVisible}
        message={error}
        onClose={() => setPopupVisible(false)}
      />
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image source={require('../assets/logo2.png')} style={styles.logo} />
      </View>
      {/* Tab Switcher */}
      <View style={styles.outerBox}>
        <TouchableOpacity style={styles.innerBox} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.tabText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.innerBox, styles.activeTab]}>
          <Text style={[styles.tabText, styles.activeTabText]}>Signup</Text>
        </TouchableOpacity>
      </View>
      {/* Input Fields */}
      <Text style={styles.label}>Username</Text>
      <TextInput style={styles.input} placeholder="Enter your username" value={username} onChangeText={setUsername} />
      <Text style={styles.label}>Email</Text>
      <TextInput style={styles.input} placeholder="Enter your email" value={email} onChangeText={setEmail} />
      <Text style={styles.label}>Password</Text>
      <View style={styles.passwordContainer}>
        <TextInput 
          style={styles.inputPassword} 
          placeholder="Enter your password" 
          value={password} 
          onChangeText={setPassword} 
          secureTextEntry={!showPassword} 
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color="gray" />
        </TouchableOpacity>
      </View>
      {/* Signup Button */}
      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  outerBox: { flexDirection: 'row', backgroundColor: '#f5f5f5', padding: 5, borderRadius: 10, marginBottom: 20 },
  innerBox: { flex: 1, padding: 12, alignItems: 'center', borderRadius: 5, backgroundColor: '#f5f5f5' },
  activeTab: { backgroundColor: '#fff' },
  tabText: { fontSize: 16, color: 'gray' },
  activeTabText: { fontWeight: 'bold', color: 'black' },
  label: { fontSize: 16, marginBottom: 5 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 10, borderRadius: 5, marginBottom: 15 },
  passwordContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#ddd', paddingHorizontal: 10, borderRadius: 5, marginBottom: 15 },
  inputPassword: { flex: 1, paddingVertical: 10 },
  button: { backgroundColor: 'black', padding: 15, borderRadius: 5, alignItems: 'center' },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  forgotPassword: { textAlign: 'center', marginTop: 15, color: 'blue' },
  logo: { width: 120, height: 120, resizeMode: 'contain' },
  logoContainer: { alignItems: 'center', marginBottom: 30 },
});

export default SignupScreen;
