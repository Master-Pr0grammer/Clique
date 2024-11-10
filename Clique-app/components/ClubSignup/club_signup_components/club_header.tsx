import { View, Image, Text } from "react-native"
import { styles } from "../../Styles/login_styles"

export function ClubSignupHeader()
{
    return (
        <View style={styles.header}>
            <Image
                alt="App Logo"
                resizeMode="contain"
                style={styles.headerImg}
                source={require("../../../assets/images/Clique_Logo.png")} />

            <Text style={styles.title}>
                Discover <Text style={{ color: '#8B0000' }}>More</Text>
            </Text>

            <Text style={styles.subtitle}>
                Your organization only grows from here.
            </Text>
        </View>
    );
}