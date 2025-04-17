import React, { useState, useRef } from 'react';
import {
    SafeAreaView,
    Text,
    View,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    Platform,
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import styles from '../styles/UploadImageStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://backend-app-t0ym.onrender.com/predict';
// const API_URL = 'http://localhost:8080/predict';


const UploadImageScreen = ({ navigation }) => {
    const [image, setImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);

    const handleWebImageSelect = (event) => {
        event.preventDefault();
        const file = event.target.files[0];
        if (file) {
            setImage({ uri: URL.createObjectURL(file) });
            setImageFile(file);
            // setPrediction(null); // Reset prediction when new image is selected
        }
    };

    const handleImageCapture = async (source) => {
        if (Platform.OS === 'web') {
            fileInputRef.current?.click();
            return;
        }

        const options = {
            mediaType: 'photo',
            quality: 1,
        };

        try {
            const result = source === 'camera'
                ? await launchCamera(options)
                : await launchImageLibrary(options);

            if (result.didCancel) return;

            if (result.assets && result.assets[0]) {
                setImage(result.assets[0]);
                setImageFile(result.assets[0]);
                // setPrediction(null); // Reset prediction when new image is selected
            }
        } catch (error) {
            console.error('Error capturing image:', error);
        }
    };

    const getPrediction = async (imageFile) => {
        setLoading(true);
        setPrediction(null);

        // Create an AbortController to cancel the fetch after 60 seconds
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
            controller.abort();
        }, 60000); // 60,000 ms = 1 minute

        try {
            const formData = new FormData();

            if (Platform.OS === 'web') {
                formData.append('image', imageFile);
            } else {
                formData.append('image', {
                    uri: Platform.OS === 'ios' ? imageFile.uri.replace('file://', '') : imageFile.uri,
                    type: imageFile.type,
                    name: imageFile.fileName || 'image.jpg',
                });
            }

            console.log('Uploading image to:', API_URL);

            const response = await fetch(API_URL, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json',
                },
                signal: controller.signal,
                mode: 'cors',
                credentials: 'omit',
            });

            // Clear the timeout since the response was received
            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Server response:', errorText);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            setPrediction(result);
        } catch (error) {
            // Clear the timeout in case of an error
            clearTimeout(timeoutId);

            if (error.name === 'AbortError') {
                console.error('Request timed out:', error);
                setPrediction({ error: 'Server is busy, Please try again later' });
            } else {
                console.error('Error uploading image:', error);
                setPrediction({ error: 'Failed to get prediction' });
            }
        } finally {
            setLoading(false);
        }
    };



    const handleLogout = async () => {
        await AsyncStorage.removeItem('authToken');
        navigation.replace('Login'); // Redirect to login screen
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Logout Button (Top Right) */}
            <View style={styles.logoutContainer}>
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.heading}>Image Prediction App</Text>

            <View style={styles.imageContainer}>
                {image ? (
                    <Image
                        source={{ uri: image.uri }}
                        style={styles.image}
                        resizeMode="contain"
                    />
                ) : (
                    <View style={styles.placeholderContainer}>
                        <Text style={styles.placeholderText}>No image selected</Text>
                    </View>
                )}
            </View>

            <View style={styles.buttonContainer}>
                {Platform.OS === 'web' && (
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleWebImageSelect}
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                    />
                )}
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => handleImageCapture('camera')}
                >
                    <Text style={styles.buttonText}>Capture Photo</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => handleImageCapture('gallery')}
                >
                    <Text style={styles.buttonText}>Upload Photo</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={[styles.predictButton, !image && styles.disabledButton]}
                onPress={() => getPrediction(imageFile)}
                disabled={!image}
            >
                <Text style={styles.buttonText}>Get Prediction</Text>
            </TouchableOpacity>

            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                    <Text>Processing image...</Text>
                </View>
            )}

            {prediction && (
                <View
                    style={{
                        ...styles.resultContainer,
                        backgroundColor: prediction.prediction === 'Lesion' ? '#ffebee' : '#e8f5e9',
                    }}
                >
                    {prediction.error ? (
                        <Text style={styles.resultText}>{prediction.error}</Text>
                    ) : (
                        <>
                            <Text style={styles.resultText}>
                                Prediction: {prediction.prediction}
                            </Text>
                            <Text style={styles.resultText}>
                                Confidence: {prediction.confidence}
                            </Text>
                        </>
                    )}
                </View>
            )}
        </SafeAreaView>
    );
};

export default UploadImageScreen;