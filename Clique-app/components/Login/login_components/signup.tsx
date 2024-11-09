import { styles } from "@/components/Styles/login_styles";
import { TouchableOpacity, Text } from "react-native";

export function SignUp()
{
    return (
        <TouchableOpacity
            onPress={() => {
            // TODO: handle link
            }}>
            <Text style={styles.formFooter}>
            Don't have an account?{' '}
            <Text style={{ textDecorationLine: 'underline' }}>Sign up</Text>
            </Text>
      </TouchableOpacity>
    );
}