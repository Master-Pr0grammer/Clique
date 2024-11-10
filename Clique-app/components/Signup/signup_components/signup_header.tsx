import { View, Image, Text } from "react-native"
import { styles } from "../../Styles/login_styles"

export function SignupHeader()
{
    return (
        <View style={styles.header}>
            <Image
                alt="App Logo"
                resizeMode="contain"
                style={styles.headerImg}
                source={require("../../../assets/images/Clique_Logo.png")} />

            <Text style={styles.title}>
                Join <Text style={{ color: '#8B0000' }}>Us</Text>
            </Text>

            <Text style={styles.subtitle}>
                We promise we'll make it worthwhile!
            </Text>
        </View>
    );
}