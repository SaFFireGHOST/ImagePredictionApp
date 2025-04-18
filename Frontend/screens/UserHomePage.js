import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions
} from 'react-native';
import { useNavigation } from "@react-navigation/native";
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Feather'; // Using Feather icons similar to Lucide
import AsyncStorage from '@react-native-async-storage/async-storage';
import ErrorPopup from './ErrorPopup';
// DashboardLayout Component
const DashboardLayout = ({ children }) => {
  return (
    <View style={styles.container}>
      <DashboardHeader />
      <View style={styles.contentContainer}>
        <DashboardNav />
        <View style={styles.mainContent}>
          {children}
        </View>
      </View>
    </View>
  );
};

// DashboardHeader Component
const DashboardHeader = () => {
  const navigation = useNavigation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const handleLogout = async () => {
    console.log("helllo");
    await AsyncStorage.removeItem('authToken');
    navigation.navigate('LandingPage'); // Redirect to login screen
  };

  return (
    <SafeAreaView style={styles.headerContainer}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.headerTitle}>
            <Text style={styles.headerTitleText}>Oral Cancer Prediction</Text>
          </TouchableOpacity>
        </View>
        {/* Logout Button (Top Right) */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>

        {/* <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.headerIconButton}
            onPress={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <Icon name="user" size={20} color="#fff" />
          </TouchableOpacity>
          
          {isDropdownOpen && (
            
            <View style={styles.dropdown}>
              <Text style={styles.dropdownLabel}>My Account</Text>
              <View style={styles.dropdownSeparator} />
              
              <TouchableOpacity style={styles.dropdownItem}>
                <Icon name="user" size={16} color="#374151" style={styles.dropdownItemIcon} />
                <Text style={styles.dropdownItemText}>Profile</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.dropdownItem}>
                <Icon name="settings" size={16} color="#374151" style={styles.dropdownItemIcon} />
                <Text style={styles.dropdownItemText}>Settings</Text>
              </TouchableOpacity>
              
              <View style={styles.dropdownSeparator} />
              
              <TouchableOpacity style={styles.dropdownItem}>
                <Icon name="log-out" size={16} color="#374151" style={styles.dropdownItemIcon} />
                <Text style={styles.dropdownItemText}>Log out</Text>
              </TouchableOpacity>
            </View>
          )}
        </View> */}
      </View>
    </SafeAreaView>
  );
};

// DashboardNav Component
const DashboardNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const currentPath = '/dashboard'; // Mock current path for active state

  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: "home",
    },
    {
      title: "Assessment",
      href: "/assessment",
      icon: "file-text",
    },
    {
      title: "History",
      href: "/history",
      icon: "clock",
    },
    {
      title: "Resources",
      href: "/resources",
      icon: "info",
    },
  ];

  return (
    <>
      <TouchableOpacity
        style={styles.sidebarToggle}
        onPress={() => setIsOpen(!isOpen)}
      >
        <Icon name={isOpen ? "x" : "menu"} size={16} color="#fff" />
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.sidebar}>
          <View style={styles.sidebarHeader}>
            <Text style={styles.sidebarHeaderText}>Menu</Text>
            <TouchableOpacity
              style={styles.sidebarCloseButton}
              onPress={() => setIsOpen(false)}
            >
              <Icon name="x" size={16} color="#374151" />
            </TouchableOpacity>
          </View>

          <View style={styles.sidebarNav}>
            {navItems.map((item) => (
              <TouchableOpacity
                key={item.href}
                style={[
                  styles.navLink,
                  currentPath === item.href && styles.navLinkActive
                ]}
                onPress={() => {
                  // Navigation would go here
                  if (Dimensions.get('window').width < 768) {
                    setIsOpen(false);
                  }
                }}
              >
                <Icon
                  name={item.icon}
                  size={16}
                  color={currentPath === item.href ? "#fff" : "#1e3a8a"}
                  style={styles.navLinkIcon}
                />
                <Text
                  style={[
                    styles.navLinkText,
                    currentPath === item.href && styles.navLinkTextActive
                  ]}
                >
                  {item.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </>
  );
};

// Home Page Component
const UserHomePage = ({ navigation, API_URL }) => {
  const [errorPopupVisible, setErrorPopupVisible] = useState(false);
  const [errorPopupMessage, setErrorPopupMessage] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  // Add function to close error popup
  const closeErrorPopup = () => {
    setErrorPopupVisible(false);
  };
  const handleFeedbackPress = async () => {
    try {
      // Get token from AsyncStorage
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert("Unauthorized", "You are not logged in.");
        return;
      }

      // Check if user has already submitted feedback
      const checkResponse = await fetch(`${API_URL}/check_feedback`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        mode: 'cors'
      });

      const checkResult = await checkResponse.json();

      if (checkResponse.ok) {
        if (checkResult.submitted) {
          // Replace console.log with ErrorPopup
          setErrorPopupMessage("You have already submitted your feedback. Thank you!");
          setErrorPopupVisible(true);
        } else {
          // Extract userId from AsyncStorage or get it from the server
          const userId = await AsyncStorage.getItem('userId');
          navigation.navigate('FeedbackFormScreen', { userId });
        }
      } else {
        console.error('Error checking feedback status:', checkResult.message);
        // If there's an error checking status, just proceed to the feedback form
        const userId = await AsyncStorage.getItem('userId');
        navigation.navigate('FeedbackFormScreen', { userId });
      }
    } catch (error) {
      console.error('Error handling feedback press:', error);
      Alert.alert('Error', 'Could not load feedback form');
    }
  };

  return (
    <DashboardLayout>
      <ScrollView style={styles.homeContainer}>
        {/* Add ErrorPopup component */}
        <ErrorPopup
          visible={errorPopupVisible}
          message={errorPopupMessage}
          onClose={closeErrorPopup}
        />

        <View style={styles.dashboardHeader}>
          <Text style={styles.dashboardTitle}>Dashboard</Text>
          {/* <TouchableOpacity style={styles.profileButton}>
            <Icon name="user" size={16} color="#fff" style={styles.profileButtonIcon} />
            <Text style={styles.profileButtonText}>Profile</Text>
          </TouchableOpacity> */}
        </View>

        <View style={styles.tabsContainer}>
          <View style={styles.tabsList}>
            <TouchableOpacity
              style={[styles.tab, activeTab === "overview" && styles.activeTab]}
              onPress={() => setActiveTab("overview")}
            >
              <Text style={[styles.tabText, activeTab === "overview" && styles.activeTabText]}>
                Overview
              </Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
              style={[styles.tab, activeTab === "predictions" && styles.activeTab]}
              onPress={() => setActiveTab("predictions")}
            >
              <Text style={[styles.tabText, activeTab === "predictions" && styles.activeTabText]}>
                Predictions
              </Text>
            </TouchableOpacity> */}
            <TouchableOpacity
              style={[styles.tab, activeTab === "resources" && styles.activeTab]}
              onPress={() => setActiveTab("resources")}
            >
              <Text style={[styles.tabText, activeTab === "resources" && styles.activeTabText]}>
                Resources
              </Text>
            </TouchableOpacity>
          </View>

          {activeTab === "overview" && (
            <View style={styles.tabContent}>
              <View style={styles.cardsGrid}>
                <View style={styles.card}>
                  <View style={styles.cardHeaderBlue}>
                    <Text style={styles.cardTitle}>Risk Assessment</Text>
                    <Icon name="file-text" size={16} color="#6b7280" />
                  </View>
                  <View style={styles.cardContent}>
                    <Text style={styles.cardContentTitle}>Start New</Text>
                    <Text style={styles.cardContentDescription}>
                      Begin a new oral cancer risk assessment
                    </Text>
                  </View>
                  <View style={styles.cardFooter}>
                    <TouchableOpacity style={styles.buttonPrimary} onPress={() => navigation.navigate('Agreement')}>
                      <Text style={styles.buttonPrimaryText}>Start Assessment</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.card}>
                  <View style={styles.cardHeaderBlue}>
                    <Text style={styles.cardTitle}>Feedback</Text>
                    <Icon name="clock" size={16} color="#6b7280" />
                  </View>
                  <View style={styles.cardContent}>
                    <Text style={styles.cardContentTitle}>Submit Feedback</Text>
                    <Text style={styles.cardContentDescription}>
                      Submit a Feedback about your app experience
                    </Text>
                  </View>
                  <View style={styles.cardFooter}>
                    <TouchableOpacity style={styles.buttonPrimary} onPress={handleFeedbackPress}>
                      <Text style={styles.buttonPrimaryText}>Give Feedback</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* <View style={styles.card}>
                  <View style={styles.cardHeaderBlue}>
                    <Text style={styles.cardTitle}>Previous Results</Text>
                    <Icon name="clock" size={16} color="#6b7280" />
                  </View>
                  <View style={styles.cardContent}>
                    <Text style={styles.cardContentTitle}>View History</Text>
                    <Text style={styles.cardContentDescription}>
                      Access your previous assessment results
                    </Text>
                  </View>
                  <View style={styles.cardFooter}>
                    <TouchableOpacity style={styles.buttonOutline} onPress={() => setActiveTab("predictions")}>
                      <Text style={styles.buttonOutlineText}>View History</Text>
                    </TouchableOpacity>
                  </View>
                </View> */}

                <View style={styles.card}>
                  <View style={styles.cardHeaderBlue}>
                    <Text style={styles.cardTitle}>Educational Resources</Text>
                    <Icon name="info" size={16} color="#6b7280" />
                  </View>
                  <View style={styles.cardContent}>
                    <Text style={styles.cardContentTitle}>Learn More</Text>
                    <Text style={styles.cardContentDescription}>
                      Educational materials about oral cancer
                    </Text>
                  </View>
                  <View style={styles.cardFooter}>
                    <TouchableOpacity style={styles.buttonOutline} onPress={() => setActiveTab("resources")}>
                      <Text style={styles.buttonOutlineText}>View Resources</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View style={styles.twoColumnGrid}>
                {/* <View style={styles.card}>
                  <View style={styles.cardHeaderBlue}>
                    <Text style={styles.cardTitle}>Recent Activity</Text>
                    <Text style={styles.cardDescription}>Your recent assessments and activities</Text>
                  </View>
                  <View style={styles.cardContent}>
                    <View style={styles.activityItem}>
                      <Icon name="calendar" size={16} color="#6b7280" style={styles.activityIcon} />
                      <View style={styles.activityDetails}>
                        <Text style={styles.activityTitle}>Risk Assessment Completed</Text>
                        <Text style={styles.activityDate}>April 5, 2025</Text>
                      </View>
                      <Text style={styles.activityStatus}>Low Risk</Text>
                    </View>

                    <View style={styles.activityItem}>
                      <Icon name="calendar" size={16} color="#6b7280" style={styles.activityIcon} />
                      <View style={styles.activityDetails}>
                        <Text style={styles.activityTitle}>Profile Updated</Text>
                        <Text style={styles.activityDate}>March 28, 2025</Text>
                      </View>
                    </View>

                    <View style={styles.activityItem}>
                      <Icon name="calendar" size={16} color="#6b7280" style={styles.activityIcon} />
                      <View style={styles.activityDetails}>
                        <Text style={styles.activityTitle}>Account Created</Text>
                        <Text style={styles.activityDate}>March 25, 2025</Text>
                      </View>
                    </View>
                  </View>
                </View> */}

                <View style={styles.card}>
                  <View style={styles.cardHeaderBlue}>
                    <Text style={styles.cardTitle}>Oral Cancer Awareness</Text>
                    <Text style={styles.cardDescription}>Important information about oral cancer</Text>
                  </View>
                  <View style={styles.cardContent}>
                    <View style={styles.infoBox}>
                      <Text style={styles.infoBoxTitle}>Early Detection Saves Lives</Text>
                      <Text style={styles.infoBoxText}>
                        Oral cancer is highly treatable when detected early. Regular screenings and self-examinations
                        are crucial for early detection.
                      </Text>
                    </View>

                    <View style={styles.infoBox}>
                      <Text style={styles.infoBoxTitle}>Risk Factors</Text>
                      <Text style={styles.infoBoxText}>
                        Common risk factors include tobacco use, excessive alcohol consumption, HPV infection, and
                        prolonged sun exposure to the lips.
                      </Text>
                    </View>

                    <View style={styles.infoBox}>
                      <Text style={styles.infoBoxTitle}>Warning Signs</Text>
                      <Text style={styles.infoBoxText}>
                        Be aware of persistent mouth sores, white or red patches, difficulty swallowing, and
                        unexplained bleeding in the mouth.
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          )}

          {activeTab === "predictions" && (
            <View style={styles.tabContent}>
              <View style={styles.card}>
                <View style={styles.cardHeaderBlue}>
                  <Text style={styles.cardTitle}>Prediction History</Text>
                  <Text style={styles.cardDescription}>View your previous risk assessments and predictions</Text>
                </View>
                <View style={styles.cardContent}>
                  <View style={styles.predictionItem}>
                    <View style={styles.predictionHeader}>
                      <View>
                        <Text style={styles.predictionTitle}>Assessment #1204</Text>
                        <Text style={styles.predictionDate}>April 5, 2025</Text>
                      </View>
                      <Text style={styles.predictionStatusLow}>Low Risk</Text>
                    </View>
                    <TouchableOpacity style={styles.buttonSmOutline}>
                      <Text style={styles.buttonOutlineText}>View Details</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.predictionItem}>
                    <View style={styles.predictionHeader}>
                      <View>
                        <Text style={styles.predictionTitle}>Assessment #1156</Text>
                        <Text style={styles.predictionDate}>February 12, 2025</Text>
                      </View>
                      <Text style={styles.predictionStatusLow}>Low Risk</Text>
                    </View>
                    <TouchableOpacity style={styles.buttonSmOutline}>
                      <Text style={styles.buttonOutlineText}>View Details</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.predictionItem}>
                    <View style={styles.predictionHeader}>
                      <View>
                        <Text style={styles.predictionTitle}>Assessment #1089</Text>
                        <Text style={styles.predictionDate}>December 3, 2024</Text>
                      </View>
                      <Text style={styles.predictionStatusModerate}>Moderate Risk</Text>
                    </View>
                    <TouchableOpacity style={styles.buttonSmOutline}>
                      <Text style={styles.buttonOutlineText}>View Details</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.cardFooter}>
                  <TouchableOpacity style={styles.buttonOutline}>
                    <Text style={styles.buttonOutlineText}>View All History</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {activeTab === "resources" && (
            <View style={styles.tabContent}>
              <View style={styles.card}>
                <View style={styles.cardHeaderBlue}>
                  <Text style={styles.cardTitle}>Educational Resources</Text>
                  <Text style={styles.cardDescription}>Learn more about oral cancer prevention and detection</Text>
                </View>
                <View style={styles.cardContent}>
                  <View style={styles.resourceItem}>
                    <Text style={styles.resourceTitle}>Self-Examination Guide</Text>
                    <Text style={styles.resourceDescription}>
                      Step-by-step instructions for performing an oral cancer self-examination at home.
                    </Text>
                    <TouchableOpacity style={styles.buttonSmOutline}>
                      <Text style={styles.buttonOutlineText}>View Guide</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.resourceItem}>
                    <Text style={styles.resourceTitle}>Risk Factor Analysis</Text>
                    <Text style={styles.resourceDescription}>
                      Detailed information about factors that may increase your risk of oral cancer.
                    </Text>
                    <TouchableOpacity style={styles.buttonSmOutline}>
                      <Text style={styles.buttonOutlineText}>Learn More</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.resourceItem}>
                    <Text style={styles.resourceTitle}>Treatment Options</Text>
                    <Text style={styles.resourceDescription}>
                      Overview of current treatment approaches for different stages of oral cancer.
                    </Text>
                    <TouchableOpacity style={styles.buttonSmOutline}>
                      <Text style={styles.buttonOutlineText}>Explore Treatments</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.resourceItem}>
                    <Text style={styles.resourceTitle}>Support Resources</Text>
                    <Text style={styles.resourceDescription}>
                      Connect with support groups and find resources for patients and caregivers.
                    </Text>
                    <TouchableOpacity style={styles.buttonSmOutline}>
                      <Text style={styles.buttonOutlineText}>Find Support</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </DashboardLayout>
  );
};

// Custom styles
const styles = StyleSheet.create({
  // Layout styles
  container: {
    flex: 1,
    backgroundColor: '#f9fafb', // light gray background
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  mainContent: {
    flex: 1,
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


  // Header styles
  headerContainer: {
    backgroundColor: '#325be3', // primary blue
    borderBottomWidth: 1,
    borderBottomColor: '#1e3a8a', // darker blue
  },
  header: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerRight: {
    position: 'relative',
  },
  headerIconButton: {
    padding: 8,
  },

  // Dropdown styles
  dropdown: {
    position: 'absolute',
    right: 0,
    top: 40,
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 10,
    minWidth: 200,
    zIndex: 100,
  },
  dropdownLabel: {
    padding: 12,
    fontWeight: '500',
    color: '#374151',
    fontSize: 14,
  },
  dropdownSeparator: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 4,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  dropdownItemIcon: {
    marginRight: 8,
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#374151',
  },

  // Sidebar/Nav styles
  sidebarToggle: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: '#325be3',
    borderRadius: 8,
    padding: 12,
    zIndex: 50,
  },
  sidebar: {
    width: 240,
    backgroundColor: '#eff6ff', // light blue background
    borderRightWidth: 1,
    borderRightColor: '#e5e7eb',
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  sidebarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
  },
  sidebarHeaderText: {
    fontWeight: 'bold',
  },
  sidebarCloseButton: {
    padding: 8,
  },
  sidebarNav: {
    marginTop: 8,
  },
  navLink: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 4,
  },
  navLinkActive: {
    backgroundColor: '#325be3',
  },
  navLinkIcon: {
    marginRight: 12,
  },
  navLinkText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e3a8a',
  },
  navLinkTextActive: {
    color: '#ffffff',
  },

  // Home page styles
  homeContainer: {
    flex: 1,
    padding: 16,
  },
  dashboardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  dashboardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#325be3',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  profileButtonIcon: {
    marginRight: 8,
  },
  profileButtonText: {
    color: '#ffffff',
    fontWeight: '500',
    fontSize: 14,
  },

  // Tabs styles
  tabsContainer: {
    marginBottom: 16,
  },
  tabsList: {
    flexDirection: 'row',
    backgroundColor: '#eff6ff',
    borderRadius: 8,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  activeTab: {
    backgroundColor: '#325be3',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e3a8a',
  },
  activeTabText: {
    color: '#ffffff',
  },
  tabContent: {
    marginTop: 16,
  },

  // Card grid styles
  cardsGrid: {
    flexDirection: 'column',
    marginBottom: 16,
  },
  twoColumnGrid: {
    flexDirection: 'column',
  },

  // Card styles
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeaderBlue: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  cardDescription: {
    color: '#6b7280',
    fontSize: 14,
    marginTop: 4,
  },
  cardContent: {
    padding: 20,
  },
  cardContentTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  cardContentDescription: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  cardFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },

  // Button styles
  buttonPrimary: {
    backgroundColor: '#325be3',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonPrimaryText: {
    color: '#ffffff',
    fontWeight: '500',
    fontSize: 14,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#d1d5db',
    alignItems: 'center',
  },
  buttonOutlineText: {
    color: '#374151',
    fontWeight: '500',
    fontSize: 14,
  },
  buttonSmOutline: {
    backgroundColor: 'transparent',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#d1d5db',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 8,
  },

  // Activity styles
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  activityIcon: {
    marginRight: 8,
  },
  activityDetails: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  activityDate: {
    fontSize: 14,
    color: '#6b7280',
  },
  activityStatus: {
    fontWeight: '500',
    color: '#10b981', // green
  },

  // Info box styles
  infoBox: {
    backgroundColor: '#eff6ff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  infoBoxTitle: {
    fontWeight: '500',
    marginBottom: 8,
  },
  infoBoxText: {
    fontSize: 14,
    color: '#4b5563',
  },

  // Prediction styles
  predictionItem: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  predictionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  predictionTitle: {
    fontWeight: '500',
  },
  predictionDate: {
    fontSize: 14,
    color: '#6b7280',
  },
  predictionStatusLow: {
    color: '#10b981', // green
    fontWeight: '500',
  },
  predictionStatusModerate: {
    color: '#f59e0b', // amber
    fontWeight: '500',
  },

  // Resource styles
  resourceItem: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  resourceTitle: {
    fontWeight: '500',
  },
  resourceDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
    marginBottom: 8,
  },

  // Media queries would be handled with Dimensions API or libraries like react-native-responsive-screen
});

export default UserHomePage;