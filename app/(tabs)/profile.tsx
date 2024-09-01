import { useColorScheme } from "@/hooks/useColorScheme.web";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import ImagePicker from "@/components/ImagePicker";
import { supabase } from "@/utils/supabase";
import { User } from "@supabase/supabase-js";

const ProfileScreen = () => {
  const colorScheme = useColorScheme() ?? "light";
  const [user, setUser] = useState<User>();
  useEffect(() => {
    (async () => {
      const user = await supabase.auth.getSession();
      setUser(user.data.session?.user);
    })();
  }, []);
  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground
        source={require("@/assets/images/rocky_gym_background.jpeg")} // Replace with your background image
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.profileSection}>
            <ImagePicker />
            <Text style={styles.name}>{user?.email}</Text>
            <Text style={styles.membershipDetails}>Membership: Premium</Text>
            <Text style={styles.membershipDetails}>
              Joined: {user?.created_at.split("T")[0]}
            </Text>
          </View>

          <View style={styles.buttonsSection}>
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: Colors[colorScheme].tint },
              ]}
            >
              <Text style={styles.buttonText}>تعديل الحساب</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: Colors[colorScheme].tint },
              ]}
            >
              <Text style={styles.buttonText}>تاريخ اللعب</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: Colors[colorScheme].tint },
              ]}
            >
              <Text style={styles.buttonText}>تسجيل الخروج</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    // backgroundColor: "#f2f2f2",
    alignItems: "center",
    padding: 20,
    backgroundColor: "rgba(242, 242, 242, 0.2)",
  },
  profileSection: {
    alignItems: "center",
    marginVertical: 20,
  },
  profileImage: {
    height: 300,
    borderRadius: 75,
    marginBottom: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  membershipDetails: {
    fontSize: 16,
    color: "#fff",
    marginTop: 5,
  },
  buttonsSection: {
    width: "100%",
    marginTop: 30,
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 15,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});

export default ProfileScreen;
