import { View, TextInput, Text, TouchableOpacity, Linking } from "react-native"
import { useRouter } from "expo-router";
import { config, styles } from "../../Styles/login_styles"
import { useState } from 'react';

export function LoginForm()
{
    const router = useRouter();

    const [form, setForm] = useState({
        email: '',
        password: '',
    });

    return (
        <View style={styles.form}>
            <View style={styles.input}>
            <Text style={styles.inputLabel}>Email address</Text>

            <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                clearButtonMode="while-editing"
                keyboardType="email-address"
                onChangeText={email => setForm({ ...form, email })}
                placeholder="john@example.com"
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
                value={form.email} />
            </View>

            <View style={styles.input}>
            <Text style={styles.inputLabel}>Password</Text>

            <TextInput
                autoCorrect={false}
                clearButtonMode="while-editing"
                onChangeText={password => setForm({ ...form, password })}
                placeholder="********"
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
                secureTextEntry={true}
                value={form.password} />
            </View>

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