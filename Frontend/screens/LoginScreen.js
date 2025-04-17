import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import ErrorPopup from './ErrorPopup'; // Adjust the path as needed
import LoadingOverlay from './LoadingOverlay';

// const API_URL = 'http://localhost:8080/login';
// const API_URL = 'http://10.0.2.2:8080/login';
// const API_URL = 'https://backend-app-t0ym.onrender.com/login';
// const API_URL = 'https://backend-app-t0ym.onrender.com';
const LoginScreen = ({ navigation,setIsAdmin,API_URL }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [popupVisible, setPopupVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const adminEmails = ["admin1@gmail.com", "admin2@gmail.com", "admin3@gmail.com"];

  const handleLogin = async () => {
    let isAdminUser = false;
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        mode:'cors'
      });
  
      const data = await response.json();
      if (response.ok) {
        await AsyncStorage.setItem('authToken', data.token);
        
        if (adminEmails.includes(email.toLowerCase())) {
          isAdminUser = true;
          navigation.navigate('AdminDashboard');
          setIsAdmin(true);
        } else {
          navigation.navigate('UserHomePage');
        }
        await AsyncStorage.setItem('isAdmin', isAdminUser.toString()); // Store as string

      } else {
        setError('Invalid password or username');
        setPopupVisible(true);
      }
    } catch (error) {
      console.log(error);
      setError('Something went wrong');
      setPopupVisible(true);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <View style={styles.container}>
      <LoadingOverlay visible={isLoading} message="Logging in..." />
      <ErrorPopup
        visible={popupVisible}
        message={error}
        onClose={() => setPopupVisible(false)}
      />
      <View style={styles.logoContainer}>
        <Image source={require('../assets/logo2.png')} style={styles.logo} />
      </View>
      <View style={styles.outerBox}>
        <TouchableOpacity style={[styles.innerBox, styles.activeTab]}>
          <Text style={[styles.tabText, styles.activeTabText]}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.innerBox} onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.tabText}>Signup</Text>
        </TouchableOpacity>
      </View>
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
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
          <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color="gray" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
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
  passwordContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#ddd', borderRadius: 5, marginBottom: 15 },
  inputPassword: { flex: 1, padding: 10 },
  eyeIcon: { padding: 10 },
  button: { backgroundColor: 'black', padding: 15, borderRadius: 5, alignItems: 'center' },
  forgotPassword: { textAlign: 'center', marginTop: 15, color: 'blue' },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  logo: { width: 120, height: 120, resizeMode: 'contain' },
  logoContainer: { alignItems: 'center', marginBottom: 30 },
});

export default LoginScreen;
