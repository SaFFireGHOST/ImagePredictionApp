import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const LoadingOverlay = ({ visible, message }) => {
  if (!visible) return null;
  return (
    <View style={styles.overlay}>
      <LinearGradient
        colors={['#0f2027', '#203a43', '#2c5364']}
        style={styles.loaderContainer}
      >
        <ActivityIndicator size="large" color="#fff" style={styles.spinner} />
        {message ? <Text style={styles.message}>{message}</Text> : null}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', // semi-transparent background
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000, // makes sure the overlay is on top
  },
  loaderContainer: {
    width: 150,
    height: 150,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  spinner: {
    marginBottom: 10,
  },
  message: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default LoadingOverlay;
