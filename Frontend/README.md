# SMITA - Smart Medical Image Testing Application 🏥

## Overview 🌟

SMITA is a cutting-edge mobile application designed for early oral cancer detection using advanced machine learning algorithms. The application provides healthcare professionals with a powerful tool to capture, analyze, and manage patient oral cavity images for potential cancer detection.

## Technologies Used 🚀

### Core Technologies
- **React Native** - For cross-platform mobile development
- **Expo** - Development framework and platform
- **React Navigation** - For seamless screen navigation
- **AsyncStorage** - Local data persistence
- **Axios** - HTTP client for API requests

### UI Components
- **React Native Paper** - Material Design components
- **React Native Vector Icons** - Icon library
- **Expo Linear Gradient** - Gradient effects
- **React Native Gesture Handler** - Touch and gesture handling

### Image Handling
- **Expo Image Picker** - Image selection and camera access
- **React Native Image Picker** - Native image picking capabilities

## Screens and Features 📱

### 1. Landing Page (`LandingPage.js`)
- Welcome screen with app introduction
- Navigation to login/signup
- Features overview
- Educational information about oral cancer

### 2. Authentication Screens
- **Login Screen** (`LoginScreen.js`)
  - User authentication
  - Password recovery option
  - Admin/User role distinction
  
- **Signup Screen** (`SignupScreen.js`)
  - New user registration
  - Form validation
  - OTP verification integration

- **OTP Verification** (`OTPScreen.js`)
  - Email verification
  - 6-digit OTP input
  - Resend OTP functionality

### 3. User Dashboard (`UserHomePage.js`)
- Overview of available features
- Quick access to:
  - Risk Assessment
  - Previous Results
  - Educational Resources
  - Feedback Form

### 4. Case Record Form (`CaseRecordForm.js`)
- Comprehensive patient information collection
- Image capture/upload functionality
- Real-time prediction results
- Form validation and submission

### 5. Admin Dashboard (`AdminDashboard.js`)
- User management
- Submission monitoring
- Feedback review
- System statistics

### 6. Feedback System
- **Feedback Form** (`FeedbackFormScreen.js`)
  - User experience rating
  - Detailed feedback submission
  - One-time submission enforcement

- **Feedback List** (`FeedbackListScreen.js`)
  - Admin view of all feedback
  - Feedback analysis
  - User satisfaction metrics

### 7. Form Submission Details (`FormSubmissionDetails.js`)
- Detailed view of submissions
- Image preview
- Prediction results
- Comment system

## Getting Started 🚀

1. **Installation**
```bash
npm install
```

2. **Start the Development Server**
```bash
npm start
```

3. **Running on Devices**
```bash
# For iOS
npm run ios

# For Android
npm run android
```

## Environment Setup ⚙️

1. Create a `.env` file in the root directory
2. Add required environment variables:
```env
API_URL=your_backend_url
```

## Contributing 🤝

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License 📄

This project is licensed under the MIT License - see the LICENSE file for details.
