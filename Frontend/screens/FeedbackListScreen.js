import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingOverlay from './LoadingOverlay'; // Adjust the import path as needed

const FeedbackListScreen = ({ navigation, route, API_URL }) => {
  const [userFeedbacks, setUserFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [isResetting, setIsResetting] = useState(false); // For LoadingOverlay

  // If a specific userId is passed in route params, only show that user's feedback
  const specificUserId = route.params?.userId;

  const fetchFeedbacks = async () => {
    const token = await AsyncStorage.getItem('authToken');
    try {
      const endpoint = specificUserId
        ? `${API_URL}/admin/feedbacks?userId=${specificUserId}`
        : `${API_URL}/admin/feedbacks`;

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setUserFeedbacks(data);
      } else {
        setError(data.message || 'Failed to fetch feedback data');
      }
    } catch (err) {
      console.error('Error fetching feedback:', err);
      setError('Something went wrong while retrieving feedback');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, [specificUserId]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchFeedbacks();
  };

  // Map rating numbers (1-5) to rating labels
  const getRatingLabel = (rating) => {
    const labels = ["Poor", "Fair", "Good", "Very Good", "Excellent"];
    return labels[rating - 1] || 'N/A';
  };

  // Questions from your feedback form
  const questions = [
    "How simple was the registration and login process?",
    "How easy is it to navigate the app?",
    "How smooth was the image uploading process?",
    "How satisfied are you with the features available in the app?",
    "How would you rate the app's performance (speed, responsiveness)?",
    "How would you rate your overall experience with the app?",
  ];

  const calculateAverageRating = (feedback) => {
    if (!feedback.answers || feedback.answers.length === 0) return 0;
    const sum = feedback.answers.reduce((total, rating) => total + rating, 0);
    return (sum / feedback.answers.length).toFixed(1);
  };

  const renderFeedbackItem = ({ item }) => (
    <View style={styles.feedbackContainer}>
      <View style={styles.feedbackHeader}>
        <Text style={styles.userIdentifier}>User: {item.username || item.userId}</Text>
        <View style={styles.averageRatingContainer}>
          <Text style={styles.averageRatingText}>
            Avg. Rating: {calculateAverageRating(item)}
          </Text>
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Ionicons
                key={star}
                name={calculateAverageRating(item) >= star ? "star" : "star-outline"}
                size={16}
                color="#FFD700"
              />
            ))}
          </View>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.answersContainer}>
        {item.answers && item.answers.map((answer, index) => (
          <View key={index} style={styles.answerItem}>
            <Text style={styles.questionText}>{questions[index]}</Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingText}>{getRatingLabel(answer)}</Text>
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingNumber}>{answer}/5</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
      
      {/* Comment section with conditional rendering for no comments */}
      <View style={styles.commentContainer}>
        <Text style={styles.commentLabel}>Additional Comments:</Text>
        <Text style={styles.commentText}>
          {item.textFeedback ? item.textFeedback : "No additional comments"}
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loaderText}>Loading feedback data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.error}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchFeedbacks}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleResetFeedback = async () => {
    setIsResetting(true); // Show loading overlay
    try {
      // Retrieve token from AsyncStorage
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        setIsResetting(false);
        console.log("Unauthorized", "You are not logged in.");
        return;
      }
      const response = await fetch(`${API_URL}/reset-feedback`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Success', data.message);
        await fetchFeedbacks();
      } else {
        console.log('Error', data.message || 'Failed to reset feedback.');
      }
    } catch (error) {
      console.error('Reset feedback error:', error);
      // Alert.alert('Error', 'An error occurred while resetting feedback.');
    } finally {
      setIsResetting(false); // Hide loading overlay
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Loading overlay */}
      <LoadingOverlay visible={isResetting} message="Resetting feedback data..." />
      
      <TouchableOpacity style={styles.logoutButton} onPress={handleResetFeedback}>
        <Text style={styles.logoutButtonText}>Reset Feedback</Text>
      </TouchableOpacity>
      
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>
          {specificUserId ? "User Feedback" : "All Feedback"}
        </Text>
      </View>

      <FlatList
        data={userFeedbacks}
        renderItem={renderFeedbackItem}
        keyExtractor={(item, index) => `feedback-${item.userId}-${index}`}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#3498db']}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No feedback submitted yet</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa'
  },
  logoutButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#ff4d4d',
    padding: 10,
    borderRadius: 5,
    zIndex: 1,
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  header: {
    backgroundColor: '#3498db',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  backButton: {
    marginRight: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff'
  },
  listContainer: {
    padding: 16,
    paddingBottom: 30
  },
  commentContainer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  commentLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  commentText: {
    fontSize: 14,
    color: '#7f8c8d',
    fontStyle: 'italic',
  },  
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f6fa'
  },
  loaderText: {
    marginTop: 10,
    color: '#555',
    fontSize: 16
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  error: {
    color: '#e74c3c',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20
  },
  retryButton: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  feedbackContainer: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2
  },
  feedbackHeader: {
    padding: 16,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  userIdentifier: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50'
  },
  averageRatingContainer: {
    alignItems: 'flex-end'
  },
  averageRatingText: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 4
  },
  starsContainer: {
    flexDirection: 'row'
  },
  divider: {
    height: 1,
    backgroundColor: '#ecf0f1'
  },
  answersContainer: {
    padding: 16
  },
  answerItem: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 12
  },
  questionText: {
    fontSize: 15,
    color: '#34495e',
    marginBottom: 6
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  ratingText: {
    fontSize: 14,
    color: '#7f8c8d'
  },
  ratingBadge: {
    backgroundColor: '#3498db',
    borderRadius: 12,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  ratingNumber: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold'
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center'
  },
  emptyText: {
    fontSize: 16,
    color: '#7f8c8d',
    fontStyle: 'italic'
  }
});

export default FeedbackListScreen;