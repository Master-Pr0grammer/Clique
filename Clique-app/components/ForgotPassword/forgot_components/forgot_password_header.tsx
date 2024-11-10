import { View, TextInput, Text, TouchableOpacity } from "react-native"
import { styles } from "../../Styles/login_styles"
import { useState } from 'react';
import { useRouter } from "expo-router";
import { createTextInput } from "@/helpers/Form/createTextInput";

export function ForgotPasswordForm()
{
    const router = useRouter();

    const [email, setNewEmail] = useState<string>('');

    return (
        <View style={styles.form}>
            <Text style={{textAlign: 'center', paddingTop: 40}}>
                <Text style={{ fontSize: 24, fontWeight: '600' }}>Forgot Password?</Text>
            </Text>
            
            <Text style={{textAlign: 'center', paddingBottom: 20}}>
                <Text style={styles.subtitle}>Send us your email so we can send you a reset link.</Text>
            </Text>
            
            {createTextInput({
                label: 'Email address',
                onChangeText: (text) => setNewEmail(text),
                keyboardType: 'email-address',
                placeholder: 'john@example.com',
                value: email,
            })}


            <View style={styles.formAction}>
                <TouchableOpacity
                    onPress={() => {
                        // TODO: handle onPress
                    }}>
                    <View style={styles.btn}>
                        <Text style={styles.btnText}>Send Reset Link</Text>
                    </View>
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                onPress={() => {
                    // TODO: handle link
                    router.navigate('/login');
                }}>
                <Text style={styles.formLink}>Go back</Text>
            </TouchableOpacity>
        </View>
    )
}