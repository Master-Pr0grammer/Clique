import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { styles } from "../../Styles/login_styles"; // Make sure to create or reference appropriate styles for clubs
import { KeyboardTypeOptions } from 'react-native';
import { createTextInput } from '../../../helpers/Form/createTextInput';

interface Club {
    cid: string;
    name: string;
    description: string;
    logo_url: string;
    banner_url: string;
    //created_at: string;
    is_active: boolean;
    meeting_location: string;
    meeting_time: string;
    contact_email: string;
    website_url: string;
    instagram_handle: string;
    discord_link: string;
}

interface InputConfig {
    label: string;
    placeholder: string;
    value: string;
    key: keyof Club;
    keyboardType?: KeyboardTypeOptions;
    secureTextEntry?: boolean;
}

export function ClubForm() {
    const router = useRouter();
    const [club, setClub] = useState<Club>({
        cid: '',
        name: '',
        description: '',
        logo_url: '',
        banner_url: '',
        is_active: false,
        meeting_location: '',
        meeting_time: '',
        contact_email: '',
        website_url: '',
        instagram_handle: '',
        discord_link: '',
    });

    const inputConfigs: InputConfig[] = [
        {
            label: 'Club Name',
            placeholder: 'Enter club name',
            value: club.name,
            key: 'name',
        },
        {
            label: 'Description',
            placeholder: 'Enter club description',
            value: club.description,
            key: 'description',
        },
        {
            label: 'Logo URL',
            placeholder: 'Enter logo URL',
            value: club.logo_url,
            key: 'logo_url',
        },
        {
            label: 'Banner URL',
            placeholder: 'Enter banner URL',
            value: club.banner_url,
            key: 'banner_url',
        },
        {
            label: 'Meeting Location',
            placeholder: 'Enter meeting location',
            value: club.meeting_location,
            key: 'meeting_location',
        },
        {
            label: 'Meeting Time',
            placeholder: 'Enter meeting time',
            value: club.meeting_time,
            key: 'meeting_time',
        },
        {
            label: 'Contact Email',
            placeholder: 'Enter contact email',
            value: club.contact_email,
            key: 'contact_email',
            keyboardType: 'email-address',
        },
        {
            label: 'Website URL',
            placeholder: 'Enter website URL',
            value: club.website_url,
            key: 'website_url',
            keyboardType: 'url',
        },
        {
            label: 'Instagram Handle',
            placeholder: 'Enter Instagram handle',
            value: club.instagram_handle,
            key: 'instagram_handle',
        },
        {
            label: 'Discord Link',
            placeholder: 'Enter Discord link',
            value: club.discord_link,
            key: 'discord_link',
        },
    ];

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
                        onChangeText: text => setClub(prev => ({ ...prev, [config.key]: text })),
                    })}
                </React.Fragment>
            ))}

            <View style={styles.formAction}>
                <TouchableOpacity
                    onPress={() => {
                        // TODO: handle form submission
                    }}>
                    <View style={styles.btn}>
                        <Text style={styles.btnText}>Submit</Text>
                    </View>
                </TouchableOpacity>
            </View>
            
            <TouchableOpacity
                onPress={() => {
                    //router.push('/home'); // Navigate to a relevant page
                }}>
                <Text style={styles.formLink}>Go Back</Text>
            </TouchableOpacity>
        </View>
    );
}
