import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ClubForm } from "./club_signup_components/club_signup_form";
import { ClubSignupHeader } from "./club_signup_components/club_header";

export function ClubSignup()
{
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'e8ecf4' }}>
            
            <KeyboardAwareScrollView>
                {/* Signup Header */}
                <ClubSignupHeader />

                {/* Form for filling out email */}
                <ClubForm />
                
            </KeyboardAwareScrollView>

        </SafeAreaView>
    )
}