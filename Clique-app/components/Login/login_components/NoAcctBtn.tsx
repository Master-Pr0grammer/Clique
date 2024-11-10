import { styles } from "@/components/Styles/login_styles";
import { useRouter } from "expo-router";
import { TouchableOpacity, Text } from "react-native";

export function NoAccountBtn()
{
    const router = useRouter();

    return (
        <TouchableOpacity
            onPress={() => {
                router.navigate('/signup');
            }}>
            <Text style={styles.formFooter}>
            Don't have an account?{' '}
            <Text style={{ textDecorationLine: 'underline' }}>Sign up</Text>
            </Text>
        </TouchableOpacity>
    );
}