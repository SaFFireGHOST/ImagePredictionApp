import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

// Sample questions (replace with actual questions or import from constants)
const questions = [
  "How simple was the registration and login process?",
  "How easy is it to navigate the app?",
  "How smooth was the image uploading process?",
  "How satisfied are you with the features available in the app?",
  "How would you rate the app's performance (speed, responsiveness)?",
  "How would you rate your overall experience with the app?",
];

const ratingLabels = ["Excellent", "Good", "Poor"]; // Updated options

const FeedbackFormScreen = ({ navigation, API_URL }) => {
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const [textFeedback, setTextFeedback] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Check if all required fields are filled
    const allRequiredFieldsFilled = answers.every(answer => answer !== null);
    setIsComplete(allRequiredFieldsFilled);
  }, [answers]);

  const handleSubmit = async () => {
    if (submitted) {
      Alert.alert('Already Submitted', 'You have already submitted feedback.');
      return;
    }

    if (!isComplete) {
      Alert.alert('Incomplete', 'Please rate all questions before submitting.');
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
        body: JSON.stringify({ answers, textFeedback }),
        mode: 'cors'
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

  // Count how many questions have been answered
  const answeredCount = answers.filter(answer => answer !== null).length;

  return (
    <ScrollView
      style={styles.container}
      keyboardShouldPersistTaps='handled'
      contentContainerStyle={{ paddingBottom: 80 }}
    >
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#007bff" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>App Feedback Form</Text>
      
      <View style={styles.requirementNote}>
        <Text style={styles.noteText}>
          <Text style={styles.requiredText}>*</Text> Please answer all required questions ({answeredCount}/{questions.length} completed)
        </Text>
        <Text style={styles.noteText}>
          Submit button will be enabled once all required fields are filled
        </Text>
      </View>

      {questions.map((q, index) => (
        <View key={index} style={styles.questionBlock}>
          <Text style={styles.question}>
            <Text style={styles.requiredText}>*</Text> {index + 1}. {q}
          </Text>
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
                <Text
                  style={[
                    styles.ratingText,
                    answers[index] === i + 1 ? styles.selectedText : null
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      <Text style={styles.optionalLabel}>Additional Comments (optional)</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Write your suggestions or comments here..."
        value={textFeedback}
        onChangeText={setTextFeedback}
        multiline
        numberOfLines={4}
      />

      {!submitted && (
        <TouchableOpacity 
          style={[
            styles.submitButton, 
            !isComplete && styles.disabledButton
          ]} 
          onPress={handleSubmit}
          disabled={!isComplete}
        >
          <Text style={styles.submitButtonText}>Submit Feedback</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  backText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#007bff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  requirementNote: {
    backgroundColor: '#f0f7ff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  noteText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  requiredText: {
    color: '#ff3b30',
    fontWeight: 'bold',
  },
  questionBlock: {
    marginBottom: 20,
  },
  question: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  ratingOption: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  selectedOption: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  ratingText: {
    color: '#333',
    fontSize: 14,
  },
  selectedText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  optionalLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  textInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    textAlignVertical: 'top',
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  submitButton: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#8BC34A',
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FeedbackFormScreen;