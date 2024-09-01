import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Image, StyleSheet, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "@/utils/supabase"; // Ensure the supabase instance is correctly imported
import * as FileSystem from "expo-file-system";
import { decode } from "base64-arraybuffer";
import { getUserProfileImage } from "@/utils/helpers";

export default function ImageUpload() {
  const [image, setImage] = useState<string | undefined>(undefined);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    (async () => {
      const userId = (await supabase.auth.getUser()).data.user?.id || "";
      const data = await getUserProfileImage(userId, supabase);

      setImage(data);
    })();
  }, []);

  const pickImage = async () => {
    // Request permission to access media library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    // Open image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const img = result.assets[0];

      setImage(result.assets[0].uri);
      await uploadImage(result.assets[0].uri, img.type);
    }
  };

  const uploadImage = async (uri: string, type: string | undefined) => {
    if (!uri) return;
    const img = uri;
    const base64 = await FileSystem.readAsStringAsync(img, {
      encoding: "base64",
    });
    const filePath = `public/${new Date().getTime()}.${
      type === "image" ? "png" : "mp4"
    }`;
    const contentType = type === "image" ? "image/png" : "video/mp4";
    const { data, error } = await supabase.storage
      .from("profiles")
      .upload(filePath, decode(base64), { contentType });
    setUploading(true);

    try {
      if (error) {
        throw error;
      }

      const url = supabase.storage
        .from("profiles") // Replace with your bucket name
        .getPublicUrl(data.path).data.publicUrl;

      await updateUserProfile(url);
      Alert.alert("Success", "Image uploaded successfully!", [{ text: "OK" }]);
      return url;
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to upload image.", [{ text: "OK" }]);
    } finally {
      setUploading(false);
    }
  };

  const updateUserProfile = async (imageUrl: string) => {
    const user = supabase.auth.getUser();
    if (!user) {
      Alert.alert("Error", "No user logged in.", [{ text: "OK" }]);
      return;
    }

    const userId = (await supabase.auth.getUser()).data.user?.id || "";
    const userImage = await getUserProfileImage(userId, supabase);

    if (!userImage) {
      const { data: dd, error: ee } = await supabase.storage
        .from("profiles")
        .remove([userImage.split("/").pop()]);
      console.log("ddd ===> ", ee);

      const { data, error } = await supabase.from("profileImage").insert({
        image: imageUrl,
        userId: (await supabase.auth.getUser()).data.user?.id,
      });
      if (error) {
        throw error;
      }
    } else {
      const { data, error } = await supabase
        .from("profileImage")
        .update({
          image: imageUrl,
        })
        .eq("userId", (await supabase.auth.getUser()).data.user?.id);
      if (error) {
        throw error;
      }
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={pickImage}>
        {image ? (
          <Image
            source={{ uri: image }}
            style={[styles.profileImage, { width: 300 }]}
            resizeMode="contain"
          />
        ) : (
          <Image
            source={require("@/assets/images/rockt_profile.jpeg")} // Placeholder image URL
            style={[styles.profileImage, { width: 200 }]}
            resizeMode="contain"
          />
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
    marginBottom: 20,
  },
  profileImage: {
    height: 300,
    borderRadius: 75,
    marginBottom: 15,
    borderColor: "white",
    borderWidth: 3,
  },
});
