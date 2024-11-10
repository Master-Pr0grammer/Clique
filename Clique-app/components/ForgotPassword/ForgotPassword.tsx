import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ForgotPasswordForm } from "./forgot_components/forgot_password_form";

export function ForgotPassword()
{
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'e8ecf4' }}>
            
            <KeyboardAwareScrollView>
                {/* Form for filling out email */}
                <ForgotPasswordForm />
                
            </KeyboardAwareScrollView>

        </SafeAreaView>
    )
}