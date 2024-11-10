import { View, Text, TouchableOpacity, Alert } from "react-native"
import { useRouter } from "expo-router";
import { styles } from "../../Styles/login_styles"
import { useState } from 'react';
import { createTextInput } from "@/helpers/Form/createTextInput";
import { KeyboardTypeOptions } from 'react-native';
import React from "react";
 
interface InputConfig {
    label: string;
    placeholder: string;
    value: string;
    key: keyof User;
    keyboardType?: KeyboardTypeOptions;
    secureTextEntry?: boolean;
}

export function SignupForm()
{
    const router = useRouter();
    const [user, setUser] = useState<User>({
        //uid: '',
        email: '',
        firstname: '',
        lastname: '',
        password: '',
        rcs_id: '',
        //is_admin: false,
        //profile_image: '',
        graduation_year: 0,
        major: '',
    });

    const inputConfigs: InputConfig[] = [
        {
            label: 'First Name',
            placeholder: 'Enter first name',
            value: user.firstname,
            key: 'firstname',
        },
        {
            label: 'Last Name',
            placeholder: 'Enter last name',
            value: user.lastname,
            key: 'lastname',
        },
        {
            label: 'Email address',
            placeholder: 'john@example.com',
            value: user.email,
            keyboardType: 'email-address',
            key: 'email',
        },
        {
            label: 'Password',
            placeholder: '********',
            value: user.password,
            secureTextEntry: true,
            key: 'password',
        },
        {
            label: 'RCS ID',
            placeholder: 'Enter RCS ID',
            value: user.rcs_id,
            key: 'rcs_id',
        },
        {
            label: 'Graduation Year',
            placeholder: 'Enter graduation year',
            value: String(user.graduation_year),
            keyboardType: 'numeric',
            key: 'graduation_year',
        },
        {
            label: 'Major',
            placeholder: 'Enter major',
            value: user.major,
            key: 'major',
        },
    ];

    const handleSubmit = async () => {
        try {
            const response = await fetch('http://128.213.71.72:8080/users', {
                method: 'POST',
                mode: 'cors', // Explicitly set the mode to CORS
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json', // Optional but good to have
                },
                body: JSON.stringify(user),
            });
    
            if (response.ok) {
                Alert.alert('Success', 'Club created successfully!');
                router.push('/login'); // Redirect after successful submission
            } else {
                const errorMessage = await response.text(); // Get more details about the error
                console.error('Server Response:', errorMessage);
                Alert.alert('Error', 'Failed to create club. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            Alert.alert('Error', 'An unexpected error occurred.');
        }
    };

    return (
        <View style={styles.form}>
            
            {inputConfigs.map(config => (
                <React.Fragment key={config.key}>
                    {createTextInput({
                        label: config.label,
                        placeholder: config.placeholder,
                        value: config.value,
                        keyboardType: config.keyboardType || 'default',
                        secureTextEntry: config.secureTextEntry || false,
                        onChangeText: text => setUser(prev => ({ ...prev, [config.key]: text })),
                    })}
                </React.Fragment>
            ))}

            <View style={styles.formAction}>
                <TouchableOpacity
                    onPress={() => {
                        // TODO: handle onPress
                    }}>
                    <View style={styles.btn}>
                        <Text style={styles.btnText}>Sign Up</Text>
                    </View>
                </TouchableOpacity>
            </View>
            
            <TouchableOpacity
                onPress={() => {
                    // TODO: handle link
                    router.push('/login');
                }}>
                <Text style={styles.formLink}>Go Back</Text>
            </TouchableOpacity>

        </View>
    )
}