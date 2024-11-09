import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
      paddingVertical: 24,
      flexGrow: 1,
      flexShrink: 1,
      flexBasis: 0,
    },
    title: {
      fontSize: 31,
      fontWeight: '700',
      color: '#1D2A32',
      marginBottom: 6,
    },
    subtitle: {
      fontSize: 15,
      fontWeight: '500',
      color: '#929292',
    },
    /** Header */
    header: {
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 36,
    },
    headerImg: {
      width: 150,
      height: 150,
      alignSelf: 'center',
      marginBottom: 36,
    },
    /** Form */
    form: {
      marginBottom: 24,
      paddingHorizontal: 24,
      flexGrow: 1,
      flexShrink: 1,
      flexBasis: 0,
    },
    formAction: {
      marginTop: 4,
      marginBottom: 16,
    },
    formLink: {
      fontSize: 16,
      fontWeight: '600',
      color: '#8B0000',
      textAlign: 'center',
    },
    formFooter: {
      paddingVertical: 24,
      fontSize: 15,
      fontWeight: '600',
      color: '#222',
      textAlign: 'center',
      letterSpacing: 0.15,
    },
    /** Input */
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
    /** Button */
    btn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 30,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderWidth: 1,
      backgroundColor: '#8B0000',
      borderColor: '#8B0000',
    },
    btnText: {
      fontSize: 18,
      lineHeight: 26,
      fontWeight: '600',
      color: '#fff',
    },
  });