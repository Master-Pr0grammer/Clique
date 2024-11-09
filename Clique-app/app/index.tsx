import { SafeAreaView, StyleSheet, Text, TextInput, Image, View } from "react-native"; 

export default function Index() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#eBecf4" }}> 
        <View style={styles.container}>
            <View style={styles.header}>
                <Image 
                    source={require("../assets/images/Clique_Logo.png")}
                    style={styles.headerImg}
                    resizeMode="contain" // Maintain aspect ratio.
                />

                <Text style={styles.title}>Sign in</Text>
                <Text style={styles.subtitle}></Text>
            </View>
        </View>

        <View style={styles.form}>
            <View style={styles.input}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput style={styles.inputControl}></TextInput>
            </View>
            <View style={styles.input}>
                <Text style={styles.inputLabel}>Password</Text>
                <TextInput style={styles.inputControl}></TextInput>
            </View>
        </View>
    </SafeAreaView>
  );
}


export const styles = StyleSheet.create({
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
        marginBottom: 20,
    },
    title: {
        fontSize: 36,
        fontWeight: '700',
        color: '#1e1e1e',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 15,
        fontWeight: '500',
        color: '#929292',
        textAlign: 'center', 
    },
    form: {
        marginBottom: 24,
        paddingHorizontal: 70,
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
    },
    input: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 17,
        fontWeight: '600',
        color: '#222',
        marginBottom: 8,
    },
    inputControl: {
        height: 50,
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        borderRadius: 12,
        fontSize: 15,
        fontWeight: '500',
        color: '#222',
        borderWidth: 1,
        borderColor: '#C9D3DB',
        borderStyle: 'solid',
    },
})
