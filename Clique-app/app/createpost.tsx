import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, Platform, Alert } from 'react-native';
import { launchImageLibrary, ImageLibraryOptions } from 'react-native-image-picker';

interface MediaAsset {
  uri: string;
  type?: string;
  name?: string;
}

interface PostData {
  club_name: string;  // Changed from cid to club_name
  title: string;
  description: string;
  image_data?: string | null;
  video_data?: string | null;
}

export default function CreatePost() {
  const [clubName, setClubName] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [mediaUri, setMediaUri] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Validate required fields
  const validateForm = () => {
    if (!clubName.trim()) {
      Alert.alert('Error', 'Please enter a club name');
      return false;
    }
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title');
      return false;
    }
    return true;
  };

  const handleMediaSelect = async () => {
    if (Platform.OS === 'web') {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*,video/*';
      fileInput.onchange = async (event: Event) => {
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];
        if (file) {
          const fileURL = URL.createObjectURL(file);
          setMediaUri(fileURL);
          setMediaType(file.type.startsWith('image/') ? 'image' : 'video');
        }
      };
      fileInput.click();
    } else {
      const options: ImageLibraryOptions = {
        mediaType: 'mixed',
        quality: 1,
        includeBase64: true,
      };

      try {
        const response = await launchImageLibrary(options);
        if (response.assets && response.assets.length > 0) {
          const asset = response.assets[0];
          setMediaUri(asset.uri ?? null);
          setMediaType(asset.type?.startsWith('image/') ? 'image' : 'video');
        }
      } catch (error) {
        console.error('Error selecting media:', error);
        Alert.alert('Error', 'Failed to select media');
      }
    }
  };

  const getBase64Data = async (uri: string): Promise<string> => {
    if (Platform.OS === 'web') {
      const response = await fetch(uri);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result as string;
          resolve(base64data.split(',')[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } else {
      const response = await fetch(uri);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result as string;
          resolve(base64data.split(',')[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    }
  };

  const handleCreatePost = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const postData: PostData = {
        club_name: clubName.trim(),  // Using club_name instead of cid
        title: title.trim(),
        description: description.trim(),
        image_data: null,
        video_data: null,
      };

      if (mediaUri) {
        const base64Data = await getBase64Data(mediaUri);
        if (mediaType === 'image') {
          postData.image_data = base64Data;
        } else if (mediaType === 'video') {
          postData.video_data = base64Data;
        }
      }

      console.log('Sending post data:', { 
        ...postData, 
        image_data: postData.image_data ? '[BASE64]' : null 
      });

      const response = await fetch('http://128.213.71.72:8080/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        Alert.alert('Success', 'Post created successfully!');
        // Reset form
        setClubName('');
        setTitle('');
        setDescription('');
        setMediaUri(null);
        setMediaType(null);
      } else {
        const errorData = await response.json();
        if (errorData.detail) {
          const errorMessage = Array.isArray(errorData.detail) 
            ? errorData.detail.map((err: any) => err.msg).join('\n')
            : errorData.detail;
          throw new Error(errorMessage);
        } else {
          throw new Error('Failed to create post');
        }
      }
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to create post. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create a New Post</Text>
      
      {/* Club Name Input */}
      <TextInput
        style={styles.input}
        placeholder="Club Name"
        value={clubName}
        onChangeText={setClubName}
        maxLength={100}
      />

      <TextInput
        style={styles.input}
        placeholder="Post Title"
        value={title}
        onChangeText={setTitle}
        maxLength={100}
      />

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
        maxLength={1000}
      />

      <Button 
        title="Select Image/Video" 
        onPress={handleMediaSelect}
        disabled={isLoading}
      />

      {mediaUri && mediaType === 'image' && (
        <Image 
          source={{ uri: mediaUri }} 
          style={styles.preview}
          resizeMode="cover"
        />
      )}

      <Button 
        title={isLoading ? "Creating Post..." : "Create Post"} 
        onPress={handleCreatePost}
        disabled={isLoading || !title.trim() || !clubName.trim()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333333',
  },
  input: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  preview: {
    width: '100%',
    height: 200,
    marginVertical: 10,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
});