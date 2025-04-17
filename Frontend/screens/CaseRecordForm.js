import React, { useState, useRef } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Button,
    StyleSheet,
    Platform,
    Image,
    Alert,
} from "react-native";
import ErrorPopup from './ErrorPopup';
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import LoadingOverlay from './LoadingOverlay';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

export default function CaseRecordForm({API_URL}) {
    const [sex, setSex] = useState("");
    const [prefix, setPrefix] = useState("");
    const [religion, setReligion] = useState("");
    const [type, setType] = useState("");
    const [maritalStatus, setMaritalStatus] = useState("");
    const [education, setEducation] = useState("");
    const [occupation, setOccupation] = useState("");
    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [smitaId, setSmitaId] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [age, setAge] = useState("");
    const [income, setIncome] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [address, setAddress] = useState("");

    const [image, setImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);
    
    // Add error popup state
    const [errorPopupVisible, setErrorPopupVisible] = useState(false);
    const [errorPopupMessage, setErrorPopupMessage] = useState("");

    const handleDateChange = (event, selectedDate) => {
        setShowPicker(false); // hide the picker after selection

        if (event.type === 'set' && selectedDate) {
            setDate(selectedDate);
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

    const handleWebImageSelect = (event) => {
        event.preventDefault();
        const file = event.target.files[0];
        if (file) {
            setImage({ uri: URL.createObjectURL(file) });
            setImageFile(file);
            // setPrediction(null); // Reset prediction when new image is selected
        }
    };

    const handleSubmit = async () => {
        if (!imageFile) {
            Alert.alert("Error", "Please upload an image first");
            return;
        }

        setLoading(true);

        // Retrieve token from AsyncStorage
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
            setLoading(false);
            Alert.alert("Unauthorized", "You are not logged in.");
            return;
        }

        const formData = new FormData();
        formData.append("date", date.toISOString().split("T")[0]);
        formData.append("smitaId", smitaId);
        formData.append("firstName", firstName);
        formData.append("lastName", lastName);
        formData.append("prefix", prefix);
        formData.append("age", age);
        formData.append("sex", sex);
        formData.append("religion", religion);
        formData.append("maritalStatus", maritalStatus);
        formData.append("education", education);
        formData.append("occupation", occupation);
        formData.append("income", income);
        formData.append("phoneNumber", phoneNumber);
        formData.append("address", address);
        formData.append("type", type);

        // Append image
        if (Platform.OS === 'web') {
            formData.append('image', imageFile);
        } else {
            formData.append('image', {
                uri: imageFile.uri,
                type: imageFile.type || 'image/jpeg',
                name: imageFile.fileName || 'image.jpg',
            });
        }

        try {
            const response = await fetch(`${API_URL}/form_submit`, {
                method: "POST",
                body: formData,
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                mode: 'cors',
                credentials: 'omit',
            });
            console.log(response);
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Server response:', errorText);
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            if (response.ok) {
                console.log("prediction is ", result);
                setPrediction(result);
                Alert.alert("Success", "Form submitted successfully!");
            } else {
                Alert.alert("Error", "Failed to submit the form.");
            }
        } catch (error) {
            console.error("Submission error:", error);
            Alert.alert("Error", "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    const navigation = useNavigation();  // Get navigation manually

    const handleLogout = async () => {
        await AsyncStorage.removeItem('authToken');
        navigation.navigate('LandingPage'); // Redirect to login screen
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
                mode:'cors'
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

    // Add function to close error popup
    const closeErrorPopup = () => {
        setErrorPopupVisible(false);
    };

    return (
        <ScrollView style={{ flex: 1 }}>
            <LoadingOverlay visible={loading} message="Submitting ..." />
            
            {/* Add ErrorPopup component */}
            <ErrorPopup 
                visible={errorPopupVisible} 
                message={errorPopupMessage} 
                onClose={closeErrorPopup} 
            />

            <View style={styles.container}>

                {/* Logout Button (Top Right) */}
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutButtonText}>Log Out</Text>
                </TouchableOpacity>

                <Text style={styles.title}>Case Record Form</Text>


                <View style={styles.row}>
                    {/* Date Picker */}

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Date</Text>
                        <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.input}>
                            <Text>{date ? date.toLocaleDateString() : "MM/dd/yyyy"}</Text>
                        </TouchableOpacity>
                    </View>
                    {showPicker && (
                        <DateTimePicker
                            mode="date"
                            value={date || new Date()}
                            onChange={handleDateChange}
                        />
                    )}


                    {/* SMTA ID */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>SMITA ID Number</Text>
                        <TextInput style={styles.input} placeholder="Enter ID" value={smitaId}
                            onChangeText={setSmitaId} />
                    </View>
                </View>


                {/* First Name and Last Name */}
                <View style={styles.row}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>First Name</Text>
                        <TextInput style={styles.input} placeholder="Enter First Name" value={firstName}
                            onChangeText={setFirstName} />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Last Name</Text>
                        <TextInput style={styles.input} placeholder="Enter Last Name" value={lastName}
                            onChangeText={setLastName} />
                    </View>
                </View>



                {/* Age and Sex */}
                <View style={styles.row}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Prefix</Text>
                        <Picker selectedValue={prefix} onValueChange={(val) => setPrefix(val)} style={styles.input}>
                            <Picker.Item label="Please Select" value="" />
                            <Picker.Item label="Mr" value="mr" />
                            <Picker.Item label="Mrs" value="mrs" />
                            <Picker.Item label="Master" value="master" />
                            <Picker.Item label="Miss" value="miss" />
                            <Picker.Item label="Baby" value="baby" />
                            <Picker.Item label="Miss" value="miss" />
                            <Picker.Item label="Other" value="other" />
                        </Picker>
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Age</Text>
                        <TextInput style={styles.input} placeholder="Enter Age" keyboardType="numeric" value={age}
                            onChangeText={setAge} />
                    </View>
                </View>

                <View style={styles.row}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Sex</Text>
                        <Picker selectedValue={sex} onValueChange={(val) => { console.log("Selected Value:", val); setSex(val); }} style={styles.input}>
                            <Picker.Item label="Select" value="" />
                            <Picker.Item label="Male" value="male" />
                            <Picker.Item label="Female" value="female" />
                            <Picker.Item label="Other" value="other" />
                        </Picker>
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Education</Text>
                        <Picker selectedValue={education} onValueChange={(val) => setEducation(val)} style={styles.input}>
                            <Picker.Item label="Select" value="" />
                            <Picker.Item label="Primary" value="primary" />
                            <Picker.Item label="Secondary" value="secondary" />
                            <Picker.Item label="Diploma" value="diploma" />
                            <Picker.Item label="Undergraduate" value="undergraduate" />
                            <Picker.Item label="Postgraduate" value="Postgraduate" />
                            <Picker.Item label="Ph.D" value="Ph.D" />
                            <Picker.Item label="None" value="none" />
                        </Picker>
                    </View>

                </View>

                {/* Religion, Marital Status */}
                <View style={styles.row}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Religion</Text>
                        <Picker selectedValue={religion} onValueChange={(val) => setReligion(val)} style={styles.input}>
                            <Picker.Item label="Select" value="" />
                            <Picker.Item label="Hindu" value="hindu" />
                            <Picker.Item label="Christian" value="christian" />
                            <Picker.Item label="Muslim" value="muslim" />
                            <Picker.Item label="sikh" value="sikh" />
                            <Picker.Item label="jain" value="jain" />
                            <Picker.Item label="Buddhist" value="buddhist" />
                            <Picker.Item label="Other" value="other" />

                        </Picker>
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Marital Status</Text>
                        <Picker selectedValue={maritalStatus} onValueChange={(val) => setMaritalStatus(val)} style={styles.input}>
                            <Picker.Item label="Select" value="" />
                            <Picker.Item label="Single" value="single" />
                            <Picker.Item label="Married" value="married" />
                            <Picker.Item label="Divorced" value="divorced" />
                            <Picker.Item label="Widowed" value="widowed" />
                            <Picker.Item label="Other" value="other" />
                        </Picker>
                    </View>

                </View>

                {/* Occupation and Income */}
                <View style={styles.row}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Occupation</Text>
                        <Picker selectedValue={occupation} onValueChange={(val) => setOccupation(val)} style={styles.input}>
                            <Picker.Item label="Select" value="" />
                            <Picker.Item label="Employed" value="employed" />
                            <Picker.Item label="Self-employed" value="self-employed" />
                            <Picker.Item label="Unemployed" value="unemployed" />
                            <Picker.Item label="Student" value="student" />
                            <Picker.Item label="Retired" value="retired" />
                        </Picker>
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Family Income</Text>
                        <TextInput style={styles.input} placeholder="Enter Income" keyboardType="numeric" value={income}
                            onChangeText={setIncome} />
                    </View>
                    {/* Phone Number */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Phone Number</Text>
                        <TextInput style={styles.input} placeholder="Enter Phone Number" keyboardType="phone-pad" value={phoneNumber}
                            onChangeText={setPhoneNumber} />
                    </View>
                </View>

                <View style={styles.row}>
                    {/* Address */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Address</Text>
                        <TextInput style={styles.input} placeholder="Enter Address" value={address}
                            onChangeText={setAddress} />
                    </View>
                </View>

                {/* Age and Sex */}
                <View style={styles.row}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Image Type</Text>
                        <Picker selectedValue={type} onValueChange={(val) => setType(val)} style={styles.input}>
                            <Picker.Item label="Please Select" value="" />
                            <Picker.Item label="Dorsal Tongue" value="Dorsal Tongue" />
                            <Picker.Item label="Ventral Tongue" value="Ventral Tongue" />
                            <Picker.Item label="Left buccal mucosa" value="Left buccal mucosa" />
                            <Picker.Item label="Right buccal mucosa" value="Right buccal mucosa" />
                            <Picker.Item label="Upper Lip" value="Upper Lip" />
                            <Picker.Item label="Lower Lip" value="Lower Lip" />
                            <Picker.Item label="Upper arch" value="Upper arch" />
                            <Picker.Item label="Lower arch" value="Lower arch" />
                            <Picker.Item label="Other" value="other" />
                        </Picker>
                    </View>
                   
                </View>

                {/* Image Preview */}
                <View style={styles.imageContainer}>
                    {image ? (
                        <Image source={{ uri: image.uri }} style={styles.image} />
                    ) : (
                        <Text style={styles.placeholderText}>No image selected</Text>
                    )}
                </View>

                {/* Image Upload Buttons */}
                <Text style={styles.uploadlabel}>Capture Photo / Choose from Gallery</Text>
                <View style={styles.buttonRow}>
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
                        style={[styles.button, styles.photoButton]}
                        onPress={() => handleImageCapture('camera')}
                    >
                        <Text style={styles.buttonText}>Capture Photo 📷</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button, styles.photoButton]}
                        onPress={() => handleImageCapture('gallery')}
                    >
                        <Text style={styles.buttonText}>Upload Photo</Text>
                    </TouchableOpacity>
                </View>


                {/* Submit and Back Buttons */}
                <View style={styles.buttonRow}>
                    <TouchableOpacity style={[styles.button, styles.backButton]} onPress={() => navigation.navigate('Agreement')}>
                        <Text style={styles.buttonText}>Back</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, styles.submitButton]} onPress={handleSubmit}>
                        <Text style={styles.buttonText}>Submit</Text>
                    </TouchableOpacity>
                </View>
                {/* Feedback Form Button */}
                <View style={styles.feedbackButtonContainer}>
                    <TouchableOpacity
                        style={[styles.button, styles.feedbackButton]}
                        onPress={handleFeedbackPress}
                    >
                        <Text style={styles.buttonText}>Give Feedback</Text>
                    </TouchableOpacity>
                </View>

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

            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    logoutContainer: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 10, // Ensures it stays on top
    },
    feedbackButtonContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    feedbackButton: {
        backgroundColor: '#007bff',
        width: '50%',
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

    resultContainer: {
        backgroundColor: '#f0f0f0',
        padding: 20,
        borderRadius: 10,
        marginTop: 10,
    },
    resultText: {
        fontSize: 16,
        marginVertical: 5,
        textAlign: 'center',
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
    placeholderText: {
        fontSize: 16,
        color: '#888',
        marginVertical: 20,
    },

    container: {
        padding: 20,
        backgroundColor: "#fff",
        flex: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 10,
        marginBottom: 20,
    },
    inputGroup: {
        flex: 1,
        minWidth: 120,
        marginBottom: 10,
    },
    label: {
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 5,
        marginTop: 5,
    },
    uploadlabel: {
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 5,
        marginTop: 5,
        textAlign: "center",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        borderRadius: 5,
        backgroundColor: "#f9f9f9",
        height: 50,
    },
    picker: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        backgroundColor: "#f9f9f9",
    },
    row: {
        flexDirection: 'row',
        gap: 16,
        flexWrap: 'wrap',
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    button: {
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
        flex: 1,
        marginHorizontal: 5,
        marginTop: 5,
    },
    backButton: {
        backgroundColor: "#ccc",
    },
    photoButton: {
        backgroundColor: "#324066",
    },
    submitButton: {
        backgroundColor: "green",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
    },
});