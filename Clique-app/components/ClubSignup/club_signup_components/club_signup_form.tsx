import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { styles } from "@/components/Styles/login_styles";
import { createTextInput } from "@/helpers/Form/createTextInput";
import { KeyboardTypeOptions } from 'react-native';

interface Club {
    name: string;
    description: string;
    logo_url: string;
    banner_url: string;
    meeting_location: string;
    meeting_time: string;
    contact_email: string;
    website_url: string;
    instagram_handle: string;
    discord_link: string;
}

interface UserCredentials {
    user_email: string;
    user_password: string;
}

interface InputConfig {
    label: string;
    placeholder: string;
    value: string;
    key: keyof Club | keyof UserCredentials;
    keyboardType?: KeyboardTypeOptions;
    secureTextEntry?: boolean;
}

export function ClubForm() {
    const router = useRouter();

    // Combined state for club details and user credentials
    const [formState, setFormState] = useState<Club & UserCredentials>({
        name: '',
        description: '',
        logo_url: '',
        banner_url: '',
        meeting_location: '',
        meeting_time: '',
        contact_email: '',
        website_url: '',
        instagram_handle: '',
        discord_link: '',
        user_email: '', // User email
        user_password: '', // User password
    });

    // Input configuration for the form
    const inputConfigs: InputConfig[] = [
        {
            label: 'Club Name',
            placeholder: 'Enter club name',
            value: formState.name,
            key: 'name',
        },
        {
            label: 'Description',
            placeholder: 'Enter club description',
            value: formState.description,
            key: 'description',
        },
        {
            label: 'Logo URL',
            placeholder: 'Enter logo URL',
            value: formState.logo_url,
            key: 'logo_url',
        },
        {
            label: 'Banner URL',
            placeholder: 'Enter banner URL',
            value: formState.banner_url,
            key: 'banner_url',
        },
        {
            label: 'Meeting Location',
            placeholder: 'Enter meeting location',
            value: formState.meeting_location,
            key: 'meeting_location',
        },
        {
            label: 'Meeting Time',
            placeholder: 'Enter meeting time',
            value: formState.meeting_time,
            key: 'meeting_time',
        },
        {
            label: 'Contact Email',
            placeholder: 'Enter contact email',
            value: formState.contact_email,
            key: 'contact_email',
            keyboardType: 'email-address',
        },
        {
            label: 'Website URL',
            placeholder: 'Enter website URL',
            value: formState.website_url,
            key: 'website_url',
            keyboardType: 'url',
        },
        {
            label: 'Instagram Handle',
            placeholder: 'Enter Instagram handle',
            value: formState.instagram_handle,
            key: 'instagram_handle',
        },
        {
            label: 'Discord Link',
            placeholder: 'Enter Discord link',
            value: formState.discord_link,
            key: 'discord_link',
        },
        {
            label: 'Email',
            placeholder: 'Enter your email',
            value: formState.user_email,
            key: 'user_email',
            keyboardType: 'email-address',
        },
        {
            label: 'Password',
            placeholder: 'Enter your password',
            value: formState.user_password,
            key: 'user_password',
            secureTextEntry: true,
        },
    ];

    const handleSubmit = async () => {
        try {
            const response = await fetch('http://128.213.71.72:8080/clubs', {
                method: 'POST',
                mode: 'cors', // Explicitly set the mode to CORS
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json', // Optional but good to have
                },
                body: JSON.stringify(formState),
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
                        onChangeText: text => setFormState(prev => ({ ...prev, [config.key]: text })),
                    })}
                </React.Fragment>
            ))}

            <View style={styles.formAction}>
                <TouchableOpacity onPress={handleSubmit}>
                    <View style={styles.btn}>
                        <Text style={styles.btnText}>Submit</Text>
                    </View>
                </TouchableOpacity>
            </View>
            
            <TouchableOpacity onPress={() => router.push('/login')}>
                <Text style={styles.formLink}>Go Back</Text>
            </TouchableOpacity>
        </View>
    );
}
