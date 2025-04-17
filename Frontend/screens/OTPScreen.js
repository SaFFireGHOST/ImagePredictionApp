import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import LoadingOverlay from './LoadingOverlay'; // adjust the path as needed

// const VERIFY_OTP_API = 'http://localhost:8080/verify-otp';
// const VERIFY_OTP_API = 'https://backend-app-t0ym.onrender.com/verify-otp';

const OTPScreen = ({ route, navigation,API_URL }) => {
  const { email } = route.params; // Get email from SignupScreen
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
    const timer = setInterval(() => {
      setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (index, value) => {
    if (value && !/^\d+$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    setError("");
  };

  const handleKeyDown = (index, key) => {
    if (key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setError("Please enter all digits");
      return;
    }

    setIsVerifying(true); // show overlay during verification
    setError("");

    try {
      const response = await fetch(`${API_URL}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpString }),
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert("Success", "OTP Verified!");
        navigation.navigate("UserHomePage");
      } else {
        setError("Invalid OTP. Please try again.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) return;
    try {
      // simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setResendTimer(30);
      Alert.alert("New OTP sent!", "For demo: OTP is 123456");
    } catch (error) {
      setError("Failed to resend OTP. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <LoadingOverlay visible={isVerifying} message="Verifying OTP..." />
      <Text style={styles.title}>Verify your email</Text>
      <Text style={styles.subtitle}>We've sent a 6-digit code to your email</Text>
      <Text style={styles.otpHeading}>Enter verification code</Text>
      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            style={styles.otpInput}
            keyboardType="numeric"
            maxLength={1}
            value={digit}
            onChangeText={(value) => handleChange(index, value)}
            onKeyPress={({ nativeEvent }) => handleKeyDown(index, nativeEvent.key)}
            ref={(el) => (inputRefs.current[index] = el)}
          />
        ))}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity
        style={[styles.button, otp.join("").length !== 6 ? styles.disabledButton : styles.activeButton]}
        onPress={handleSubmit}
        disabled={otp.join("").length !== 6}
      >
        {/*
          The button content is hidden because when verifying,
          the overlay will cover the view. We keep the button for layout consistency.
        */}
        <Text style={styles.buttonText}>Verify OTP</Text>
      </TouchableOpacity>
      <Text style={styles.resendText}>Didn't receive the code?</Text>
      <TouchableOpacity onPress={handleResendOTP} disabled={resendTimer > 0}>
        <Text style={[styles.resendButton, resendTimer > 0 && styles.resendDisabled]}>
          {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20, backgroundColor: "#f8f9fa" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  subtitle: { fontSize: 16, color: "#6c757d", marginBottom: 20, textAlign: "center" },
  otpHeading: { fontSize: 16, fontWeight: "bold", marginBottom: 10, color: "#333" },
  otpContainer: { flexDirection: "row", gap: 10, marginBottom: 20 },
  otpInput: { width: 50, height: 50, borderWidth: 1, borderColor: "#ced4da", borderRadius: 5, textAlign: "center", fontSize: 20, backgroundColor: "white" },
  error: { color: "red", marginBottom: 10 },
  button: { paddingVertical: 12, paddingHorizontal: 40, borderRadius: 5, alignItems: "center" },
  disabledButton: { backgroundColor: "#888" },
  activeButton: { backgroundColor: "#000000" },
  buttonText: { color: "white", fontSize: 16, fontWeight: "bold" },
  resendText: { marginTop: 20, fontSize: 14, color: "#6c757d" },
  resendButton: { fontSize: 14, color: "#000000", fontWeight: "bold", marginTop: 5 },
  resendDisabled: { color: "#6c757d" },
});

export default OTPScreen;
