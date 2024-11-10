import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, Platform } from 'react-native';
import { launchImageLibrary, ImageLibraryOptions } from 'react-native-image-picker';

// Define types for media asset
interface MediaAsset {
  uri: string;
  type?: string;
  name?: string;
}

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [mediaUri, setMediaUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleMediaSelect = async () => {
    if (Platform.OS === 'web') {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*,video/*';
      fileInput.onchange = (event: Event) => {
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];
        if (file) {
          const fileURL = URL.createObjectURL(file);
          setMediaUri(fileURL);
        }
      };
      fileInput.click();
    } else {
      const options: ImageLibraryOptions = {
        mediaType: 'mixed',
        quality: 1,
      };

      try {
        const response = await launchImageLibrary(options);
        if (response.didCancel) {
          console.log('User cancelled media picker');
        } else if (response.errorMessage) {
          console.log('ImagePicker Error: ', response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
          const asset = response.assets[0];
          setMediaUri(asset.uri ?? null);
        }
      } catch (error) {
        console.error('Error selecting media:', error);
      }
    }
  };

  const handleCreatePost = async () => {
    if (!title.trim()) {
      alert('Please enter a title');
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('description', description.trim());

    if (mediaUri) {
      try {
        if (Platform.OS === 'web') {
          const response = await fetch(mediaUri);
          const blob = await response.blob();
          formData.append('media', blob, 'media');
        } else {
          const filename = mediaUri.split('/').pop() || 'media';
          const fileType = filename.split('.').pop()?.toLowerCase() || 'jpeg';
          const mediaAsset: MediaAsset = {
            uri: mediaUri,
            name: filename,
            type: fileType.includes('mp4') ? 'video/mp4' : `image/${fileType}`,
          };
          formData.append('media', mediaAsset as any);
        }
      } catch (error) {
        console.error('Error processing media:', error);
        alert('Error processing media. Please try again.');
        setIsLoading(false);
        return;
      }
    }

    try {
      const response = await fetch('https://your-backend-url.com/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      if (response.ok) {
        console.log('Post created successfully');
        // Reset form
        setTitle('');
        setDescription('');
        setMediaUri(null);
        alert('Post created successfully!');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error creating post');
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('Error creating post. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create a New Post</Text>
      <TextInput
        style={styles.input}
        placeholder="Title"
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
      {mediaUri && (
        <Image 
          source={{ uri: mediaUri }} 
          style={styles.preview}
          resizeMode="cover"
        />
      )}
      <Button 
        title={isLoading ? "Creating Post..." : "Post"} 
        onPress={handleCreatePost}
        disabled={isLoading || !title.trim()}
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