import { styles } from '../Styles/login_styles';
import { LoginHeader } from './login_components/header';
import { LoginForm } from './login_components/login_form';
import { SignUp } from './login_components/signup';
import {
  SafeAreaView,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


export function Login() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#e8ecf4' }}>
      
      <KeyboardAwareScrollView style={styles.container}>
        {/* Login Header */}
        <LoginHeader />

        {/* Login Form */}
        <LoginForm />
      </KeyboardAwareScrollView>

      {/* Sign up button */}
      <SignUp />

    </SafeAreaView>
  );
}

