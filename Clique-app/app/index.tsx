import { SafeAreaView, StyleSheet, Text, TextInput, Image, View } from "react-native"; 
import { styles } from "@/components/Styles/login_styles";
import { ScrollView } from "react-native-gesture-handler";

export default function Index(){
    const posts = get_posts();
    return (
        <ScrollView>
            {posts.map((post, index) => (
                <View key={index}>
                    {display_post(post)}
                </View>
            ))}
        </ScrollView>
    )
}

//TODO: Implement database call
function get_posts(){
    return [
        {
            'images':['../assets/images/test_posts/image1.png'], 
            'title':'New York Pic',
            'text':'Picture from NY trip'
        },

        {
            'images':['../assets/images/test_posts/image2.png'], 
            'title':'Mount Everest',
            'text':'Tall mountain bro'
        },

        {
            'images':['../assets/images/test_posts/image3.png'], 
            'title':'RPI, am I right',
            'text':'Picture of RPI building'
        }
    ]
}

function display_post(post_info: {
    images: string[];
    title: string;
    text: string;
}){
    post_info.images.map((image_url, index) => (
        console.log(image_url)
    ))
    return (
        <View>
            {post_info.images.map((image_url, index) => (
                <Image key={index} source={{ uri: image_url }} />
            ))}
            <Text style={styles.title}>
                {post_info.title}
            </Text>
            <Text>
                {post_info.text}
            </Text>
        </View>
    )
}


