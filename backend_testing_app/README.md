# SMITA Backend Service 🖥️

## Overview 🌟

The SMITA backend service is a robust Flask-based API that handles image processing, user authentication, and data management for the SMITA oral cancer detection application. It integrates machine learning models with secure user management and data storage systems.

## Technologies Used 🚀

### Core Technologies
- **Python 3.8+** - Primary programming language
- **Flask** - Web framework
- **PyTorch** - Machine learning framework
- **MongoDB** - Database system
- **JWT** - Authentication tokens
- **Cloudinary** - Image storage and management

### Key Libraries
- **flask-cors** - Cross-Origin Resource Sharing
- **flask-bcrypt** - Password hashing
- **flask-jwt-extended** - JWT authentication
- **flask-mail** - Email services
- **PyMongo** - MongoDB integration
- **Pillow** - Image processing
- **torchvision** - Computer vision utilities

## Core Features 🎯

### 1. Authentication System
- User registration with email verification
- JWT-based authentication
- Password reset functionality
- Admin role management

### 2. Image Processing
- Image upload and validation
- Integration with pre-trained EfficientNet model
- Real-time prediction generation
- Confidence score calculation

### 3. Data Management
- Patient record storage
- Form submission handling
- Image storage via Cloudinary
- Secure data access control

### 4. Email Services
- OTP generation and verification
- Email notifications
- Password reset communications

### 5. Admin Features
- User management
- Feedback monitoring
- System statistics
- Data export capabilities

## API Endpoints 🛣️

### Authentication
```
POST /signup - User registration
POST /login - User authentication
POST /verify-otp - OTP verification
POST /forgot-password - Password reset initiation
POST /reset-password - Password reset completion
```

### Form Management
```
POST /form_submit - Submit patient form with image
GET /get-comments/:smita_id - Retrieve comments
POST /add-comment - Add comment to submission
PUT /edit-comment/:smita_id - Edit existing comment
```

### Feedback System
```
GET /check_feedback - Check user feedback status
POST /submit_feedback - Submit user feedback
GET /admin/feedbacks - Retrieve all feedback (admin only)
DELETE /reset-feedback - Reset feedback data (admin only)
```

### Admin Routes
```
GET /admin/users - Retrieve all users
GET /admin/feedbacks - Retrieve all feedback
```

## Machine Learning Integration 🤖

### Model Architecture
- EfficientNet-B0 architecture
- Binary classification (Normal/Lesion)
- Confidence score generation
- Image preprocessing pipeline

### Prediction Pipeline
1. Image preprocessing
2. Model inference
3. Probability calculation
4. Result formatting

## Security Features 🔒

- Password hashing with bcrypt
- JWT token authentication
- Admin role verification
- CORS protection
- Rate limiting
- Input validation

## Environment Setup ⚙️

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate  # Windows
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Configure environment variables:
```env
MONGO_URI=your_mongodb_uri
JWT_SECRET_KEY=your_secret_key
MAIL_USERNAME=your_email
MAIL_PASSWORD=your_email_password
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Running the Server 🚀

```bash
python main.py
```

The server will start on `http://localhost:8080`

## Deployment 🌐

The application can be deployed on any Python-supporting platform:
- Heroku
- AWS
- Google Cloud
- DigitalOcean

## Monitoring and Logging 📊

- Request logging
- Error tracking
- Performance monitoring
- User activity tracking

## Contributing 🤝

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
