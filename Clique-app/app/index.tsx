import React, { useState } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native"; 
import GallerySwiper from "react-native-gallery-swiper";

type ResizeModeType = 'cover' | 'contain';

export default function Index() {
    const [resize, setResize] = useState<ResizeModeType>('cover');

    const handleSingleTap = () => {
        setResize((prevResize) => (prevResize === 'cover' ? 'contain' : 'cover'));
    };

    const posts = get_posts();
    return (
        <ScrollView contentContainerStyle={{ justifyContent: 'space-around', gap: 20 }}>
            {posts.map((post, index) => (
                <View key={index}>
                    {display_post(post, handleSingleTap, resize)}
                </View>
            ))}
        </ScrollView>
    );
}

// Function to simulate a database call
function get_posts() {
    return [
        {
            images: ['https://picsum.photos/id/1019/1000/600/', 'https://picsum.photos/id/1015/1000/600/'],
            title: 'New York Pic',
            text: 'Picture from NY trip',
        },
        {
            images: ['https://picsum.photos/id/1015/1000/600/'],
            title: 'Mount Everest',
            text: 'Tall mountain bro',
        },
        {
            images: ['https://picsum.photos/id/1019/1000/600/'],
            title: 'RPI, am I right',
            text: 'Picture of RPI building',
        },
    ];
}

function display_post(
    post_info: {
        images: string[];
        title: string;
        text: string;
    },
    handleSingleTap: () => void,
    resize: ResizeModeType
) {
    // Map images dynamically for better flexibility
    const images = post_info.images.map(image => ({ uri: image }));

    return (
        <View style={post_style.container}>
            <Text style={post_style.title}>{post_info.title}</Text>
            <GallerySwiper 
                onSingleTapConfirmed={handleSingleTap}
                resizeMode={resize}
                style={post_style.gallery}
                images={[{ uri: "https://picsum.photos/id/1018/1000/600/" },
                    { uri: "https://picsum.photos/id/1015/1000/600/" },
                    { uri: "https://luehangs.site/pic-chat-app-images/beautiful-blond-blonde-hair-478544.jpg" },]}
                enableTranslate={false}
                // Optional: React key that updates when resize changes to force a re-render without resetting
                key={resize} 
            />
        </View>
    );
}


export const post_style = StyleSheet.create({
    container: {
        marginHorizontal: '2%',
        flexGrow: 1,
        flexShrink: 1,
        flex: 1,
        backgroundColor: '#333',
        borderRadius: 20,
    },
    title: {
        paddingTop: 24,
        fontSize: 31,
        fontWeight: '700',
        color: 'white',
        marginBottom: 6,
        paddingHorizontal: 20,
    },
    gallery: {
        flex: 1,
        flexShrink: 1,
    }
});
