import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  Image,
  Linking,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { supabase } from "../utils/supabase"; // Adjust the import based on your project structure

type VideoItem = {
  id: number;
  title: string;
  video_link: string; // Assuming this is the field for the video URL
  thumbnail?: string; // Optional thumbnail URL
};

const VideosScreen = () => {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .from("videos")
        .select("id, title, video_link"); // Fetch thumbnail if available

      if (error) throw error;

      if (data) {
        setVideos(data);
      }
    } catch (error: any) {
      console.error("خطأ في جلب الفيديوهات:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: VideoItem }) => (
    <TouchableOpacity
      style={styles.videoItem}
      onPress={() => Linking.openURL(item.video_link)} // Open the video link in the browser or YouTube app
    >
      <LinearGradient
        colors={["#ff7e5f", "#feb47b"]} // Gradient colors
        style={styles.gradientBackground}
      >
        <Image
          source={require("@/assets/images/icon.png")}
          style={styles.thumbnail}
        />
        <View style={styles.videoItemContent}>
          <Text style={styles.videoTitle}>{item.title}</Text>
          <Text style={styles.videoDescription}>{item.video_link} </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground
        source={require("@/assets/images/rocky_gym_background.jpeg")} // Replace with your background image
        style={styles.backgroundImage}
      >
        {videos.length === 0 ? ( // Check for empty state
          <View style={styles.emptyStateContainer}>
            <Image
              source={require("@/assets/images/icon.png")} // Replace with your empty state image
              style={styles.emptyStateImage}
            />
            <Text style={styles.emptyStateText}>لا توجد فيديوهات متاحة.</Text>
            <Text style={styles.emptyStateSubtitle}>
              يرجى التحقق لاحقًا أو إضافة بعض الفيديوهات.
            </Text>
          </View>
        ) : (
          <FlatList
            data={videos}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.list}
          />
        )}
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    paddingBottom: 20,
  },
  videoItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 5, // Shadow effect for Android
    shadowColor: "#000", // Shadow effect for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  gradientBackground: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    padding: 10,
  },
  thumbnail: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 10,
  },
  videoItemContent: {
    flex: 1,
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff", // White text for better contrast
  },
  videoDescription: {
    fontSize: 14,
    color: "#fff", // White text for better contrast
    marginTop: 4, // Space between title and description
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyStateImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginTop: 10,
  },
});

export default VideosScreen;
