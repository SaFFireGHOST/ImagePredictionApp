import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const questions = [
  "How easy is it to use the app?",
  "Are you satisfied with the app features?",
  "How accurate do you find the diagnosis?",
  "Was image uploading smooth?",
  "Was registration/login simple?",
  "Do you feel your data is secure?",
  "Would you recommend this app?",
  "Any bugs or issues faced?",
  "How was the overall experience?",
  "Any suggestions to improve?"
];

const ratingLabels = ["Poor", "Fair", "Good", "Very Good", "Excellent"];

const FeedbackFormScreen = ({ navigation,API_URL }) => {
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [submitted, setSubmitted] = useState(false);

  // Update useEffect to check user's feedback status
useEffect(() => {
  const checkFeedback = async () => {
      try {
          const token = await AsyncStorage.getItem('authToken');
          if (!token) return;

          const res = await fetch(`${API_URL}/check_feedback`, {
              method: 'GET',
              headers: {
                  'Authorization': `Bearer ${token}`,
              }
          });

          if (res.ok) {
              const data = await res.json();
              setSubmitted(data.submitted);
          }
      } catch (err) {
          console.error('Error checking feedback status', err);
      }
  };

  checkFeedback();
}, []);
  console.log("hello");
  const handleSubmit = async () => {
    console.log('Submit button pressed');
    if (submitted) {
      Alert.alert('Already Submitted', 'You have already submitted feedback.');
      return;
    }
    console.log("hello");
    const isComplete = answers.every(answer => answer !== null);
    if (!isComplete) {
      Alert.alert('Incomplete', 'Please rate all questions.');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Error', 'You must be logged in to submit feedback.');
        return;
      }
      const response = await fetch(`${API_URL}/submit_feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ answers }),
        mode:'cors'
      });
      const data = await response.json();

      if (response.ok) {
        Alert.alert('Thank you!', 'Your feedback has been submitted.');
        setSubmitted(true);
        navigation.goBack();
      } else {
        Alert.alert('Error', data.message || 'Submission failed');
      }
    } catch (error) {
      console.error('Submission error', error);
      Alert.alert('Error', 'Something went wrong. Try again.');
    }
  };

  return (
    <ScrollView 
    style={styles.container}
    keyboardShouldPersistTaps='handled'
    contentContainerStyle={{ paddingBottom: 50 }}>
      <Text style={styles.title}>App Feedback Form</Text>
      {questions.map((q, index) => (
        <View key={index} style={styles.questionBlock}>
          <Text style={styles.question}>{index + 1}. {q}</Text>
          <View style={styles.ratingContainer}>
            {ratingLabels.map((label, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.ratingOption,
                  answers[index] === i + 1 ? styles.selectedOption : null
                ]}
                onPress={() => {
                  const updated = [...answers];
                  updated[index] = i + 1;
                  setAnswers(updated);
                }}
              >
                <Text style={[
                  styles.ratingText,
                  answers[index] === i + 1 ? styles.selectedText : null
                ]}>
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}
      {!submitted && (
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit Feedback</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  questionBlock: { marginBottom: 24 },
  question: { fontSize: 16, marginBottom: 10 },
  ratingContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  ratingOption: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f0f0f0',
    margin: 4,
    minWidth: 80,
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  ratingText: { color: '#000' },
  selectedText: { color: '#fff', fontWeight: 'bold' },
  submitButton: {
    backgroundColor: '#007bff',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
});

export default FeedbackFormScreen;