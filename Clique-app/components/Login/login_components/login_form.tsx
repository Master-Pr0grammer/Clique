import { View, Text, TouchableOpacity, Alert } from "react-native"
import { useRouter } from "expo-router";
import { styles } from "../../Styles/login_styles"
import { useState } from 'react';
import { createTextInput } from "@/helpers/Form/createTextInput";

export function LoginForm()
{
    const router = useRouter();

    const [form, setForm] = useState({
        email: '',
        password: '',
    });
    
    const handleLogin = async () => {
        try {
            const response = await fetch('http://128.213.71.72:8080/check_user', {
                method: 'POST',
                mode: 'cors', // Explicitly set the mode to CORS
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json', // Optional but good to have
                },
                body: JSON.stringify(form),
            });

            if (response.ok) {
                // If the response code is 200
                Alert.alert('Success', 'Login successful');
                // Navigate to the next screen or perform other success actions
                router.push('/');
            } else if (response.status === 400) {
                // If the response code is 400
                Alert.alert('Error', 'Invalid email or password');
            } else {
                // Handle other response codes
                Alert.alert('Error', `Unexpected error: ${response.status}`);
            }
        } catch (error) {
            console.error('Error during login:', error);
            Alert.alert('Error', 'An unexpected error occurred. Please try again later.');
        }
    };

    return (
        <View style={styles.form}>
            
            {createTextInput({
                label: 'Email address',
                onChangeText: email => setForm({ ...form, email }),
                keyboardType: 'email-address',
                placeholder: 'john@example.com',
                value: form.email,
            })}

            {createTextInput({
                label: 'Password',
                onChangeText: password => setForm({ ...form, password }),
                placeholder: '********',
                value: form.password,
            })}

            <View style={styles.formAction}>
                <TouchableOpacity
                    onPress={handleLogin}>
                    <View style={styles.btn}>
                        <Text style={styles.btnText}>Sign in</Text>
                    </View>
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                onPress={() => {
                    // TODO: handle link
                    router.push('/forgot_password');
                }}>
                <Text style={styles.formLink}>Forgot password?</Text>
            </TouchableOpacity>
        </View>
    )
}