import { SafeAreaView, StyleSheet, Text, TextInput, Image, View, ScrollView } from "react-native"; 
import { styles } from "@/components/Styles/login_styles";
import GallerySwiper from "react-native-gallery-swiper";
import { useState } from "react";

const image1 = 'https://picsum.photos/id/1019/1000/600/';
const image2 = 'https://picsum.photos/id/1015/1000/600/';
const image3 = 'https://picsum.photos/id/1019/1000/600/';

export default function Index() {
    const posts = get_posts();
    return (
        <ScrollView contentContainerStyle={{justifyContent: 'space-around', gap: 20}}>
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
    images: string[];
    title: string;
    text: string;
}) {
    const images:string[] = [];

    for(var i = 0; i<post_info.images.length; i++){
        images.push(post_info.images[i]);
    }


    const aspect_ratio = findLowestAspectRatio(images);
    const gallery_style = StyleSheet.create({gallery:{
        flex: 1,
        flexShrink: 1,
        aspectRatio: Number(aspect_ratio),
        }
    });


    return (
        <View style={post_style.container}>
            <Text style={post_style.title}>
                {post_info.title}
            </Text>
            <GallerySwiper style={gallery_style.gallery}
                images={[
                    // Version *1.1.0 update (or greater versions): 
                    // Can be used with different image object fieldnames.
                    // Ex. source, source.uri, uri, URI, url, URL
                    { uri: "https://picsum.photos/id/1018/1000/600/" },
                    { uri: "https://picsum.photos/id/1015/1000/600/" },
                    { uri: "https://luehangs.site/pic-chat-app-images/beautiful-blond-blonde-hair-478544.jpg" },
                ]}
                enableTranslate={false}
            />
        </View>
    );
}


const findLowestAspectRatio = async (imageUrls: string[]): Promise<number | null> => {
    try {
      const aspectRatios = await Promise.all(
        imageUrls.map(url =>
          new Promise<number>((resolve, reject) => {
            Image.getSize(
              url,
              (width, height) => resolve(width / height),
              reject
            );
          })
        )
      );
  
      const minAspectRatio = Math.min(...aspectRatios);
      return minAspectRatio;
    } catch (error) {
      console.error("Error loading image dimensions:", error);
      return null;
    }
};

export const post_style = StyleSheet.create({
    container: {
        paddingVertical: '1.5%',
        //marginVertical:'2%',
        marginHorizontal:'2%',
        flexGrow: 1,
        flexShrink: 1,
        flex: 1,
        backgroundColor:'#333',
        borderRadius: 20,
        //aspectRatio: 4 / 3,
    },
    title: {
        paddingTop: 24,
        fontSize: 31,
        fontWeight: '700',
        color: 'white',
        marginBottom: 6,
        paddingHorizontal:20
    },
    gallery:{
        //marginHorizontal:25,
        flex: 1,
        flexShrink: 1,
        //minHeight: '100%',
        aspectRatio: 2 / 3,
    }
})