import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';

// const API_URL = 'http://localhost:8080';
// const API_URL = 'https://backend-app-t0ym.onrender.com';

const ForgotPasswordScreen = ({ navigation,API_URL}) => {
    const [email, setEmail] = useState('');
    const [resetToken, setResetToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [stage, setStage] = useState('email');

    const handleSendResetToken = async () => {
        try {
            const response = await fetch(`${API_URL}/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            if (response.ok) {
                setResetToken(data.reset_token);
                setStage('reset');
            } else {
                Alert.alert('Error', data.message);
            }
        } catch (error) {
            Alert.alert('Error', 'Something went wrong');
        }
    };

    const handleResetPassword = async () => {
        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    email, 
                    reset_token: resetToken,
                    new_password: newPassword,
                    confirm_password: confirmPassword 
                }),
            });

            const data = await response.json();
            if (response.ok) {
                Alert.alert('Success', 'Password reset successfully!');
                navigation.navigate('Login');
            } else {
                Alert.alert('Error', data.message);
            }
        } catch (error) {
            Alert.alert('Error', 'Something went wrong');
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Text style={styles.backButtonText}>← Back to Login</Text>
            </TouchableOpacity>

            {stage === 'email' ? (
                <>
                    <Text style={styles.title}>Forgot Password?</Text>
                    <Text style={styles.subtitle}>Enter your email to reset your password</Text>
                    <TextInput 
                        style={styles.input} 
                        placeholder="Enter your email" 
                        value={email} 
                        onChangeText={setEmail} 
                    />
                    <TouchableOpacity onPress={handleSendResetToken} style={styles.button}>
                        <Text style={styles.buttonText}>Send Reset Token</Text>
                    </TouchableOpacity>
                </>
            ) : (
                <>
                    <Text style={styles.title}>Reset Password</Text>
                    <Text style={styles.subtitle}>Enter your new password</Text>
                    <TextInput 
                        style={styles.input} 
                        placeholder="New Password" 
                        value={newPassword} 
                        onChangeText={setNewPassword}
                        secureTextEntry
                    />
                    <TextInput 
                        style={styles.input} 
                        placeholder="Confirm New Password" 
                        value={confirmPassword} 
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                    />
                    <TouchableOpacity onPress={handleResetPassword} style={styles.button}>
                        <Text style={styles.buttonText}>Reset Password</Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        justifyContent: 'center', 
        padding: 20, 
        backgroundColor: '#fff' 
    },
    backButton: {
        marginBottom: 20
    },
    backButtonText: {
        color: 'blue'
    },
    title: { 
        fontSize: 24, 
        fontWeight: 'bold', 
        textAlign: 'center', 
        marginBottom: 10 
    },
    subtitle: { 
        fontSize: 16, 
        textAlign: 'center', 
        marginBottom: 20, 
        color: 'gray' 
    },
    input: { 
        borderWidth: 1, 
        borderColor: '#ddd', 
        padding: 10, 
        borderRadius: 5, 
        marginBottom: 15 
    },
    button: { 
        backgroundColor: 'black', 
        padding: 15, 
        borderRadius: 5, 
        alignItems: 'center' 
    },
    buttonText: { 
        color: 'white', 
        fontSize: 16, 
        fontWeight: 'bold' 
    },
});

export default ForgotPasswordScreen;