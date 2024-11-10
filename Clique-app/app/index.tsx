import { Key, useState } from "react";
import { StyleSheet, Text, View, ScrollView, Alert } from "react-native"; 
import GallerySwiper from "react-native-gallery-swiper";

type ResizeModeType = 'cover' | 'contain';

export default function Index() {
    const [resize, setResize] = useState<ResizeModeType>('cover');

    const handleSingleTap = () => {
        setResize((prevResize) => (prevResize === 'cover' ? 'contain' : 'cover'));
    };


    // try {
    //     const response = await fetch('http://128.213.71.72:8080/10posts', {
    //         method: 'GET',
    //         mode: 'cors', // Explicitly set the mode to CORS
    //     });

    //     if (response.ok) {
    //         Alert.alert('Success', 'Loaded successfully!');
    //         //const posts = await get_posts();
    //         const posts = await response.json();
    //         console.log(posts);
    //         return (
    //             <ScrollView contentContainerStyle={{ justifyContent: 'space-around', gap: 20 }}>
    //                 {posts.map((post: { title: string; 
    //                                     description: string; 
    //                                     image_data: string[]; 
    //                                     video_data: string
    //                                     upvote: number,
    //                                     downvote: number
    //                                     created_at:string}, 

    //                                     index: Key | null | undefined | number) => (

    //                             <View key={index}>
    //                                 {display_post(post, handleSingleTap, resize)}
    //                             </View>
    //                 ))}
    //             </ScrollView>
    //         );
    //     } else {
    //         const errorMessage = await response.text(); // Get more details about the error
    //         console.error('Server Response:', errorMessage);
    //         Alert.alert('Error', 'Failed to load posts. Please try again.');
    //     }
    // } catch (error) {
    //     console.error('Error getting posts:', error);
    //     Alert.alert('Error', 'An unexpected error occurred.');
    // }

    return (
        <ScrollView contentContainerStyle={{ justifyContent: 'space-around', gap: 20 }}>
            <Text>Hello</Text>
        </ScrollView>
    )
}

function display_post(
    post_info: { title: string; 
        description: string; 
        image_data: string[]; 
        video_data: string
        upvote: number,
        downvote: number
        created_at:string},
    handleSingleTap: () => void,
    resize: ResizeModeType
) {
    // Map images dynamically for better flexibility
    const images = post_info.image_data.map(image => ({ uri: image }));

    return (
        <View style={post_style.container}>
            <Text style={post_style.title}>{post_info.title}</Text>
            <GallerySwiper 
                onSingleTapConfirmed={handleSingleTap}
                resizeMode={resize}
                style={post_style.gallery}
                images={[{ uri: "https://sosf.us/wp-content/uploads/2014/09/RCOSclassphoto_2013-780x400.jpg" },
                    { uri: "https://picsum.photos/id/1015/1000/600/" },
                    { uri: "https://luehangs.site/pic-chat-app-images/beautiful-blond-blonde-hair-478544.jpg" },]}
                enableTranslate={false}
                // Optional: React key that updates when resize changes to force a re-render without resetting
                key={resize} 
            />
            <Text style={post_style.subtitle}>{post_info.description}</Text>
        </View>
    );
}


export const post_style = StyleSheet.create({
    container: {
        marginVertical:'2%',
        //marginHorizontal: '2%',
        flexGrow: 1,
        flexShrink: 1,
        flex: 1,
        backgroundColor: '#8B0000',
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
    },
    subtitle: {
        paddingTop: 5,
        paddingBottom: 10,
        paddingHorizontal: 20,
        fontSize: 15,
        fontWeight: '500',
        color: '#d4d4d4',
      },
});
