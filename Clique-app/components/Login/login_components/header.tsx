import { View, Image, Text } from "react-native"
import { styles } from "../../Styles/login_styles"

export function LoginHeader()
{
    return (
        <View style={styles.header}>
            <Image
                alt="App Logo"
                resizeMode="contain"
                style={styles.headerImg}
                source={require("../assets/images/Clique_Logo.png")} />

            <Text style={styles.title}>
                Sign in to <Text style={{ color: '#8B0000' }}>Clique</Text>
            </Text>

            <Text style={styles.subtitle}>
                Become part of the community!
            </Text>
            </View>
    );
}