import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
  Share,
  Platform,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TextInput } from 'react-native';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const FormDetailsScreen = ({ route, navigation,API_URL }) => {
  // const API_URL = 'http://localhost:8080/add-comment';
  // const API_URL = 'http://10.0.2.2:8080/add-comment';

  // const API_URL_2 = 'http://localhost:8080/get-comments';
  // const API_URL_2 = 'http://10.0.2.2:8080/get_comments';




  const { submission } = route.params || {};
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [comments, setComments] = useState([]); // to hold the list of comments
  const [newComment, setNewComment] = useState(''); // to hold input value
  const [editingIndex, setEditingIndex] = useState(null);
  const [editText, setEditText] = useState('');

  const fetchComments = async () => {
    try {
      const response = await fetch(`${API_URL}/get-comments/${submission.smitaId}`, { mode: 'cors' });
      const data = await response.json();
      setComments(data.comments); // expects: [{ username: 'abc', comment: 'xyz' }, ...]
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  useEffect(() => {
    // if (submission?.id) {
    fetchComments();
    // }
  }, []);

  const editComment = async (smitaId, commentIndex, newComment) => {
    try {
      const response = await fetch(`${API_URL}/edit-comment/${smitaId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Ensure JWT token is sent
        },
        body: JSON.stringify({
          comment_index: commentIndex,
          new_comment: newComment
        })
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Comment updated successfully:', data.updated_comment);
        return data.updated_comment; // Return updated comment for UI update
      } else {
        console.error('Error updating comment:', data.message);
        return null;
      }
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  };


  const handleEditComment = async (smitaId, index, updatedText) => {
    const updatedComment = await editComment(smitaId, index, updatedText);
    if (updatedComment) {
      // Update the comment in the UI (assuming `comments` is stored in state)
      setComments(prevComments => {
        const newComments = [...prevComments];
        newComments[index].comment = updatedText;
        newComments[index].edited_timestamp = new Date().toISOString(); // Update timestamp
        return newComments;
      });
    }
  };

  const startEditing = (index) => {
    setEditingIndex(index);
    setEditText(comments[index].comment);
  };

  const saveEdit = async () => {
    if (editText.trim() === '') return;
    const updatedComment = await editComment(submission.smitaId, editingIndex, editText);
    if (updatedComment) {
      const updatedComments = [...comments];
      updatedComments[editingIndex] = {
        ...updatedComments[editingIndex],
        comment: editText
      };

      setComments(updatedComments);
      setEditingIndex(null);
      setEditText('');
    }

  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditText('');
  };



  // Get prediction color based on result
  const getPredictionColor = (prediction) => {
    if (!prediction) return '#666';
    return prediction.toLowerCase() === 'normal' ? '#2e7d32' : '#c62828';
  };

  // Format date string
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const handleCommentSubmit = async () => {

    if (newComment.trim()) {
      const formData = new FormData();
      formData.append("Name", "admin1");
      formData.append("smitaId", submission.smitaId);

      formData.append("comment", newComment.trim());
      console.log(newComment);
      console.log("smita id is ", submission.smitaId);
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        setLoading(false);
        Alert.alert("Unauthorized", "You are not logged in.");
        return;
      }
      try {
        const response = await fetch(`${API_URL}/add-comment`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
          mode: 'cors',
          credentials: 'omit',
        });

        if (!response.ok) {
          throw new Error('Failed to submit comment');
        }

        const result = await response.json();
        setComments((prev) => [...prev, result.comment]); // result.comment should be: { username, comment }
        setNewComment('');
      } catch (error) {
        Alert.alert('Error', 'Unable to submit comment.');
        console.error(error);
      }
    } else {
      Alert.alert('Empty Comment', 'Please write something before submitting.');
    }

  }

  // Share submission details
  const handleShare = async () => {
    try {
      const message = `
SMITA App Report:
Patient: ${submission.prefix || ''} ${submission.firstName || ''} ${submission.lastName || ''}
SMITA ID: ${submission.smitaId || 'N/A'}
Prediction: ${submission.prediction || 'N/A'} (${submission.confidence || 'N/A'})
Date: ${formatDate(submission.date)}
      `;

      await Share.share({
        message,
        title: 'Patient Report Details',
      });
    } catch (error) {
      Alert.alert('Error', 'Unable to share the information');
    }
  };

  // Group form fields for better organization
  const personalInfo = [
    { label: 'First Name', value: submission?.firstName || 'N/A' },
    { label: 'Last Name', value: submission?.lastName || 'N/A' },
    { label: 'Prefix', value: submission?.prefix || 'N/A' },
    { label: 'SMITA ID', value: submission?.smitaId || 'N/A' },
    { label: 'Age', value: submission?.age || 'N/A' },
    { label: 'Sex', value: submission?.sex || 'N/A' },
  ];

  const contactInfo = [
    { label: 'Phone Number', value: submission?.phoneNumber || 'N/A' },
    { label: 'Address', value: submission?.address || 'N/A' },
  ];

  const backgroundInfo = [
    { label: 'Religion', value: submission?.religion || 'N/A' },
    { label: 'Marital Status', value: submission?.maritalStatus || 'N/A' },
    { label: 'Education', value: submission?.education || 'N/A' },
    { label: 'Occupation', value: submission?.occupation || 'N/A' },
    { label: 'Income', value: submission?.income || 'N/A' },
  ];

  const diagnosisInfo = [
    {label:'Region',value:submission?.type || 'N/A'},
    { label: 'Prediction', value: submission?.prediction || 'N/A' },
    { label: 'Confidence', value: submission?.confidence || 'N/A' },
    { label: 'Date', value: formatDate(submission?.date) },
  ];

  // If no submission data is provided
  if (!submission) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>No data available</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#007bff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Patient Details</Text>
        <TouchableOpacity
          style={styles.shareButton}
          onPress={handleShare}>
          <Ionicons name="share-outline" size={24} color="#007bff" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Patient Name and ID Banner */}
        <View style={styles.patientBanner}>
          <Text style={styles.patientName}>
            {submission.prefix || ''} {submission.firstName || ''} {submission.lastName || ''}
          </Text>
          <Text style={styles.patientId}>ID: {submission.smitaId || 'N/A'}</Text>
        </View>

        {/* Prediction Result */}
        <View style={[styles.predictionContainer, { borderLeftColor: getPredictionColor(submission.prediction) }]}>
          <Text style={styles.predictionLabel}>Diagnosis Result:</Text>
          <View style={styles.predictionInfo}>
            <Text style={[styles.predictionValue, { color: getPredictionColor(submission.prediction) }]}>
              {submission.prediction || 'N/A'}
            </Text>
            <Text style={styles.confidenceValue}>
              Confidence: {submission.confidence || 'N/A'}
            </Text>
          </View>
        </View>

        {/* Personal Information Section */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.infoCard}>
            {personalInfo.map((item, index) => (
              <View key={index} style={[
                styles.infoRow,
                index === personalInfo.length - 1 ? null : styles.infoRowBorder
              ]}>
                <Text style={styles.infoLabel}>{item.label}</Text>
                <Text style={styles.infoValue}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Contact Information Section */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.infoCard}>
            {contactInfo.map((item, index) => (
              <View key={index} style={[
                styles.infoRow,
                index === contactInfo.length - 1 ? null : styles.infoRowBorder
              ]}>
                <Text style={styles.infoLabel}>{item.label}</Text>
                <Text style={styles.infoValue}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Background Information Section */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Background Information</Text>
          <View style={styles.infoCard}>
            {backgroundInfo.map((item, index) => (
              <View key={index} style={[
                styles.infoRow,
                index === backgroundInfo.length - 1 ? null : styles.infoRowBorder
              ]}>
                <Text style={styles.infoLabel}>{item.label}</Text>
                <Text style={styles.infoValue}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Diagnosis Information Section */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Diagnosis Information</Text>
          <View style={styles.infoCard}>
            {diagnosisInfo.map((item, index) => (
              <View key={index} style={[
                styles.infoRow,
                index === diagnosisInfo.length - 1 ? null : styles.infoRowBorder
              ]}>
                <Text style={styles.infoLabel}>{item.label}</Text>
                <Text style={[
                  styles.infoValue,
                  item.label === 'Prediction' ? { color: getPredictionColor(item.value) } : null
                ]}>
                  {item.value}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Image Section - Now displayed after all other information */}
        {submission.image_url && (
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Image</Text>
            <TouchableOpacity
              style={styles.imageContainer}
              onPress={() => setImageModalVisible(true)}
              activeOpacity={0.9}>
              {isLoading && (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#007bff" />
                </View>
              )}
              {imageError ? (
                <View style={styles.errorImageContainer}>
                  <Ionicons name="image-outline" size={50} color="#bdbdbd" />
                  <Text style={styles.errorImageText}>Image could not be loaded</Text>
                </View>
              ) : (
                <>
                  <Image
                    source={{ uri: submission.image_url }}
                    style={styles.image}
                    onLoadStart={() => setIsLoading(true)}
                    onLoadEnd={() => setIsLoading(false)}
                    onError={() => {
                      setIsLoading(false);
                      setImageError(true);
                    }}
                    resizeMode="contain"
                  />
                  <View style={styles.imageOverlay}>
                    <Ionicons name="expand-outline" size={24} color="#fff" />
                    <Text style={styles.imageOverlayText}>View Full Image</Text>
                  </View>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Comments</Text>

          {/* Existing Comments */}
          <View style={styles.commentsCard}>
            {comments.length === 0 ? (
              <Text style={styles.noCommentsText}>No comments yet</Text>
            ) : (
              comments.map((comment, index) => (
                <View key={index} style={styles.commentItem}>
                  <Ionicons name="chatbox-ellipses-outline" size={16} color="#007bff" style={{ marginRight: 8 }} />
                  <View style={styles.commentContent}>
                    <Text style={{ fontWeight: 'bold', color: '#007bff' }}>{comment.username}</Text>

                    {editingIndex === index ? (
                      <View style={styles.editContainer}>
                        <TextInput
                          style={styles.editInput}
                          value={editText}
                          onChangeText={setEditText}
                          multiline
                          autoFocus
                        />
                        <View style={styles.editActions}>
                          <TouchableOpacity onPress={saveEdit} style={styles.editButton}>
                            <Text style={styles.editButtonText}>Save</Text>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={cancelEdit} style={[styles.editButton, styles.cancelButton]}>
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ) : (
                      <Text style={styles.commentText}>{comment.comment}</Text>
                    )}
                  </View>

                  {editingIndex !== index && (
                    <TouchableOpacity
                      style={styles.editOption}
                      onPress={() => startEditing(index)}
                    >
                      <Ionicons name="pencil" size={16} color="#666" />
                      <Text style={styles.editText}>Edit</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))
            )}
          </View>

          {/* Add New Comment */}
          <View style={styles.commentInputContainer}>
            <TextInput
              style={styles.commentInput}
              placeholder="Write a comment..."
              value={newComment}
              onChangeText={setNewComment}
              multiline
            />
            <TouchableOpacity
              style={styles.commentButton}
              onPress={handleCommentSubmit}
            >
              <Ionicons name="send" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>


        {/* Bottom margin for better scrolling */}
        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Full Image Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={imageModalVisible}
        onRequestClose={() => setImageModalVisible(false)}>
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={() => setImageModalVisible(false)}>
            <Ionicons name="close-circle" size={36} color="#fff" />
          </TouchableOpacity>
          <Image
            source={{ uri: submission.image_url }}
            style={styles.modalImage}
            resizeMode="contain"
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  editOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
    padding: 4,
  },
  editText: {
    color: '#666',
    fontSize: 12,
    marginLeft: 2,
  },
  editContainer: {
    marginTop: 4,
  },
  editInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
    padding: 8,
    fontSize: 14,
    backgroundColor: '#f9f9f9',
    minHeight: 40,
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  editButton: {
    backgroundColor: '#007bff',
    padding: 6,
    borderRadius: 4,
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: '#f1f1f1',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 12,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
  },
  shareButton: {
    padding: 4,
  },
  patientBanner: {
    backgroundColor: '#e3f2fd',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  patientName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0d47a1',
  },
  patientId: {
    fontSize: 14,
    color: '#1976d2',
    marginTop: 4,
  },
  predictionContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  predictionLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#424242',
    marginBottom: 8,
  },
  predictionInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  predictionValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  confidenceValue: {
    fontSize: 14,
    color: '#616161',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  predictionLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#424242',
    marginBottom: 8,
  },
  predictionInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  predictionValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  confidenceValue: {
    fontSize: 14,
    color: '#616161',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  predictionLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#424242',
    marginBottom: 8,
  },
  predictionInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  predictionValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  confidenceValue: {
    fontSize: 14,
    color: '#616161',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageOverlayText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 245, 245, 0.7)',
  },
  errorImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorImageText: {
    marginTop: 10,
    color: '#757575',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 12,
  },
  infoSection: {
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  infoRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 15,
    color: '#757575',
    flex: 1,
  },
  infoValue: {
    fontSize: 15,
    color: '#212121',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: width * 0.9,
    height: height * 0.7,
  },
  modalCloseButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#616161',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  commentsCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  noCommentsText: {
    color: '#757575',
    fontStyle: 'italic',
  },
  commentItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  commentText: {
    color: '#212121',
    fontSize: 14,
    flex: 1,
    flexWrap: 'wrap',
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  commentInput: {
    flex: 1,
    fontSize: 14,
    minHeight: 40,
    maxHeight: 100,
  },
  commentButton: {
    backgroundColor: '#007bff',
    padding: 8,
    borderRadius: 20,
    marginLeft: 8,
  },

});

export default FormDetailsScreen;