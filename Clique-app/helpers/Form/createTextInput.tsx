import { styles } from '@/components/Styles/login_styles';
import { View, Text, TextInput, TextInputProps, TextStyle, ViewStyle } from 'react-native';

interface TextInputConfig extends TextInputProps {
    label?: string;
    style?: TextStyle | TextStyle[];
    containerStyle?: ViewStyle | ViewStyle[];
}

export function createTextInput({
    label,
    onChangeText,
    autoCapitalize = 'none',
    autoCorrect = false,
    clearButtonMode = 'while-editing',
    keyboardType = 'default',
    placeholder = '',
    placeholderTextColor = '#6b7280',
    value = '',
    style = {},
    containerStyle = {},
}: TextInputConfig) {
    return (
        <View style={[styles.input, containerStyle]}>
            {label && <Text style={styles.inputLabel}>{label}</Text>}
            <TextInput
                autoCapitalize={autoCapitalize}
                autoCorrect={autoCorrect}
                clearButtonMode={clearButtonMode}
                keyboardType={keyboardType}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={placeholderTextColor}
                style={[styles.inputControl, style]}
                value={value}
            />
        </View>
    );
}
