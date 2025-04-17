import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import UploadImageScreen from './screens/UploadImageScreen';
import OTPScreen from './screens/OTPScreen';
import AgreementScreen from './screens/AgreementScreen';
import CaseRecordForm from './screens/CaseRecordForm';
import { ActivityIndicator, View } from 'react-native';
import LandingPage from './screens/LandingPage';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import AdminDashboard from './screens/AdminDashboard';
import FormSubmissionDetails from './screens/FormSubmissionDetails';
import FeedbackFormScreen from './screens/FeedbackFormScreen'
import FeedbackListScreen from './screens/FeedbackListScreen'
import UserHomePage from './screens/UserHomePage'

const Stack = createStackNavigator();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true); // NEW: Loading state

  // const API_URL = 'http://10.0.2.2:8080';
  const API_URL = 'http://localhost:8080';
  // const API_URL = 'https://backend-app-t0ym.onrender.com';

  useEffect(() => {
    checkLoginStatus();
  }, []);

  useEffect(() => {
    console.log("Updated isAdmin:", isAdmin); // Debugging
  }, [isAdmin]); // Log changes to isAdmin

  const checkLoginStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const adminStatus = await AsyncStorage.getItem('isAdmin');

      setIsAuthenticated(!!token);
      setIsAdmin(adminStatus === 'true'); // Convert stored string to boolean
    } catch (error) {
      console.error('Error reading auth token:', error);
    } finally {
      setLoading(false); // Done checking auth status
    }
  };



  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={isAuthenticated ? (isAdmin ? "AdminDashboard" : "CaseRecord") : "LandingPage"}   >
        <Stack.Screen name="LandingPage" component={LandingPage} />
        <Stack.Screen name="UploadImage" component={UploadImageScreen} />
        <Stack.Screen name="Agreement" component={AgreementScreen} />
        <Stack.Screen name="Login">
          {props => <LoginScreen {...props} setIsAdmin={setIsAdmin} API_URL={API_URL} />}
        </Stack.Screen>
        <Stack.Screen name="Signup">
          {props=><SignupScreen {...props} API_URL={API_URL}    />}
        </Stack.Screen> 
        <Stack.Screen name="ForgotPassword">
          {props=><ForgotPasswordScreen {...props} API_URL={API_URL}    />}
        </Stack.Screen>  
        <Stack.Screen name="CaseRecord">
          {props=><CaseRecordForm {...props} API_URL={API_URL}    />}
        </Stack.Screen> 
        <Stack.Screen name="OTPVerification">
          {props=><OTPScreen {...props} API_URL={API_URL}    />}
        </Stack.Screen> 
      
        <Stack.Screen name="AdminDashboard">
          {props=><AdminDashboard {...props} API_URL={API_URL}    />}
        </Stack.Screen> 
        <Stack.Screen name="FormSubmissionDetails">
          {props=><FormSubmissionDetails {...props} API_URL={API_URL}    />}
        </Stack.Screen> 
        <Stack.Screen name="FeedbackFormScreen">
          {props=><FeedbackFormScreen {...props} API_URL={API_URL}    />}
        </Stack.Screen> 
        <Stack.Screen name="FeedbackList">
          {props=><FeedbackListScreen {...props} API_URL={API_URL}    />}
        </Stack.Screen> 
        <Stack.Screen name="UserHomePage">
          {props=><UserHomePage {...props} API_URL={API_URL}    />}
        </Stack.Screen> 

        
      </Stack.Navigator>
    </NavigationContainer>

  );
};

export default App;
