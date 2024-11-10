import { View, TextInput, Text, TouchableOpacity, Linking } from "react-native"
import { useRouter } from "expo-router";
import { config, styles } from "../../Styles/login_styles"
import { useState } from 'react';
import { createTextInput } from "@/helpers/Form/createTextInput";

export function LoginForm()
{
    const router = useRouter();

    const [form, setForm] = useState({
        email: '',
        password: '',
    });

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
                    onPress={() => {
                        // TODO: handle onPress
                    }}>
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