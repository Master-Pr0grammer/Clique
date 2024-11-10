import { SafeAreaView, StyleSheet, Text, TextInput, Image, View } from "react-native"; 
import { styles } from "@/components/Styles/login_styles";
import { ScrollView } from "react-native-gesture-handler";
import GallerySwiper from "react-native-gallery-swiper";

const image1 = require('../assets/images/test_posts/image1.png');
const image2 = require('../assets/images/test_posts/image2.png');
const image3 = require('../assets/images/test_posts/image3.png');

export default function Index() {
    const posts = get_posts();
    return (
        <ScrollView>
            {posts.map((post, index) => (
                <View key={index}>
                    {display_post(post)}
                </View>
            ))}
        </ScrollView>
    );
}

//TODO: Implement database call
function get_posts() {
    return [
        {
            images: [image1, image2],
            title: 'New York Pic',
            text: 'Picture from NY trip',
        },
        {
            images: [image2],
            title: 'Mount Everest',
            text: 'Tall mountain bro',
        },
        {
            images: [image3],
            title: 'RPI, am I right',
            text: 'Picture of RPI building',
        },
    ];
}

function display_post(post_info: {
    images: any[];
    title: string;
    text: string;
}) {
    return (
        <View>
            <GallerySwiper
                images={post_info.images.map((image_path) => ({
                    source: image_path,
                    dimensions: { width: 1080, height: 1920 },
                }))}
            />
            <Text style={styles.title}>
                {post_info.title}
            </Text>
            <Text>
                {post_info.text}
            </Text>
        </View>
    );
}
