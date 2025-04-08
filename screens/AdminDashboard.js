import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

// const API_URL = 'http://localhost:8080/admin/users';
// const API_URL = 'http://10.0.2.2:8080/admin/users';
// const API_URL = 'https://backend-app-t0ym.onrender.com/admin/users';

const AdminDashboard = ({ navigation,API_URL }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  

  const handleLogout = async () => {
    await AsyncStorage.removeItem('authToken');
    navigation.navigate('LandingPage'); // Redirect to login screen
  };

  const fetchUsers = async () => {
    const token = await AsyncStorage.getItem('authToken');
    try {
      const response = await fetch(`${API_URL}/admin/users`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setUsers(data);
      } else {
        setError(data.message || 'Failed to fetch users');
      }
    } catch (err) {
      setError('Something went wrong');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchUsers();
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loaderText}>Loading users...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.error}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchUsers}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderSubmission = (submission, index, user) => (
    <TouchableOpacity
      key={`${user.email}-submission-${index}`}
      style={styles.submissionContainer}
      onPress={() => navigation.navigate('FormSubmissionDetails', { userEmail: user.email, submission })}
    >
      <View style={styles.submissionHeader}>
        <Text style={styles.submissionTitle}>Submission {index + 1}</Text>
        <Text style={styles.submissionDate}>{submission.date}</Text>
      </View>
      <Text style={styles.submissionPreview}>
        {submission.summary || 'View submission details'}
      </Text>
      <View style={styles.detailButton}>
        <Text style={styles.detailButtonText}>View Details</Text>
      </View>
    </TouchableOpacity>
  );

  const renderUser = ({ item: user }) => (
    <View style={styles.userContainer}>
      <View style={styles.userHeader}>
        <Text style={styles.username}>{user.username}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
      </View>
      <View style={styles.divider} />
      <Text style={styles.submissionsHeader}>Form Submissions:</Text>
      {user.form_submissions && user.form_submissions.length > 0 ? (
        user.form_submissions.map((submission, index) =>
          renderSubmission(submission, index, user)
        )
      ) : (
        <Text style={styles.noSubmission}>No form submissions yet</Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Logout Button (Top Right) */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </TouchableOpacity>
      <View style={styles.header}>
        <Text style={styles.title}>Admin Dashboard</Text>
      </View>
      <FlatList
        data={users}
        renderItem={renderUser}
        keyExtractor={item => item._id}
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
            <Text style={styles.emptyText}>No users found</Text>
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

  logoutText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  header: {
    backgroundColor: '#3498db',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  listContainer: {
    padding: 16,
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff'
  },
  userContainer: {
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
  userHeader: {
    padding: 16,
    backgroundColor: '#fff'
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50'
  },
  userEmail: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 4
  },
  divider: {
    height: 1,
    backgroundColor: '#ecf0f1'
  },
  submissionsHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34495e',
    marginTop: 12,
    marginBottom: 8,
    paddingHorizontal: 16
  },
  submissionContainer: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3498db'
  },
  submissionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  submissionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50'
  },
  submissionDate: {
    fontSize: 14,
    color: '#7f8c8d'
  },
  submissionPreview: {
    fontSize: 14,
    color: '#34495e',
    marginBottom: 12
  },
  detailButton: {
    backgroundColor: '#3498db',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'flex-start'
  },
  detailButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14
  },
  noSubmission: {
    fontStyle: 'italic',
    color: '#95a5a6',
    padding: 16,
    textAlign: 'center'
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

export default AdminDashboard;