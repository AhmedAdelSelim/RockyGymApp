import { useRouter } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect } from "react";
import { Colors } from "@/constants/Colors";
import { supabase } from "@/utils/supabase"; // Adjust this import based on your Supabase client setup

export default function AuthHome() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  async function checkSession() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      router.replace("/(tabs)");  // Redirect to index page if session exists
    }
  }

  return (
    <ImageBackground
      source={require("@/assets/images/rocky_gym_background.jpeg")} // Replace with your background image
      style={styles.backgroundImage}
      resizeMode="cover"
      onLoadStart={() => setLoading(true)}
      onLoadEnd={() => setLoading(false)}
    >
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
      ) : (
        <View style={styles.overlay}>
          <View style={styles.iconContainer}>
            <Image
              source={require("@/assets/images/rocky_gym_logo.png")} // Replace with your icon image
              style={styles.icon}
            />
          </View>
          <View style={styles.container}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                router.replace("/login");
              }}
            >
              <Text style={styles.buttonText}>تسجيل الدخول</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.replace("/signup")}
            >
              <Text style={styles.buttonText}>إنشاء حساب</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  icon: {
    width: 150,
    height: 150,
  },
  container: {
    width: "100%",
    paddingBottom: 50,
    alignItems: "center",
  },
  button: {
    width: "80%",
    paddingVertical: 15,
    backgroundColor: Colors["dark"].tint,
    borderRadius: 25,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "black",
    fontSize: 18,
    fontWeight: "bold",
  },
  link: {
    textDecorationLine: "none",
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});
