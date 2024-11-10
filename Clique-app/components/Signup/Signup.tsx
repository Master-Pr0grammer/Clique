import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SignupForm } from "./signup_components/signup_form";
import { SignupHeader } from "./signup_components/signup_header";

export function Signup()
{
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'e8ecf4' }}>
            
            <KeyboardAwareScrollView>
                {/* Signup Header */}
                <SignupHeader />

                {/* Form for filling out email */}
                <SignupForm />
                
            </KeyboardAwareScrollView>

        </SafeAreaView>
    )
}