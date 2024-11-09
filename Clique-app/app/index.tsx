import { SafeAreaView, StyleSheet, Text, Image, View } from "react-native"; 

export default function Index() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#8B0000" }}> 
        <View style={styles.container}>
            <View style={styles.header}>
                <Image 
                    source={require("../assets/images/react-logo.png")}
                    style={styles.headerImg}
                    resizeMode="contain" // Maintain aspect ratio.
                />
            </View>
        </View>
        
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
        padding: 24,
        flex: 1,
    },
    header: {
        marginVertical: 36,
    },
    headerImg: {
        width: '100%',
        height: undefined,
        aspectRatio: 1,
    },
    title: {
        fontSize: 27,
        fontWeight: '700',
        color: '#1e1e1e',
        marginBottom: 6,
        textAlign: 'center',
    }
})
