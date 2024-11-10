import { styles } from "@/components/Styles/login_styles";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native"; 
import GallerySwiper from "react-native-gallery-swiper";

type ResizeModeType = 'cover' | 'contain';

type Post = {
    images: string[];
    title: string;
    text: string;
};

export default function Index() {
    const router = useRouter();
    const [resize, setResize] = useState<ResizeModeType>('cover');
    const [posts, setPosts] = useState<Post[] | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch posts from the server
        const fetchPosts = async () => {
            try {
                const response = await fetch('http://128.213.71.72:8080/10posts', 
                    {
                        method: 'GET',
                        mode: 'cors',
                    } 
                );
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                setPosts(data);
            } catch (error) {
                console.error("Error fetching posts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    const handleSingleTap = () => {
        setResize((prevResize) => (prevResize === 'cover' ? 'contain' : 'cover'));
    };

    return (
        <View style={{ flex: 1 }}>
            {loading ? (
                <ActivityIndicator size="large" color="#8B0000" />
            ) : posts && posts.length > 0 ? (
                <ScrollView contentContainerStyle={{ justifyContent: 'space-around', gap: 20 }}>
                    {posts.map((post, index) => (
                        <View key={index}>
                            {display_post(post, handleSingleTap, 'cover')}
                        </View>
                    ))}
                </ScrollView>
            ) : (
                <Text style={{ textAlign: 'center', marginTop: 20 }}>No posts available.</Text>
            )}

            <TouchableOpacity
                onPress={() => {
                    router.navigate('/createpost');
                }}>
                <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingVertical: 10,
                        paddingHorizontal: 20,
                        borderWidth: 1,
                        backgroundColor: '#8B0000',
                        borderColor: '#8B0000',
                    }}>
                    <Text style={{ color: 'white', fontSize: 16 }}>Create Post</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
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
                images={images}
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
