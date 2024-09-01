import { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ImageBackground,
  I18nManager,
  Image,
} from "react-native";
import { supabase } from "@/utils/supabase";
import { Link, useRouter } from "expo-router";
import Animated, {
  Easing,
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";
import { Colors } from "@/constants/Colors";

I18nManager.forceRTL(true);
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const opacity = useSharedValue(0);
  const router = useRouter();

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) alert(error.message);
    else router.replace("/(tabs)");
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(opacity.value, {
        duration: 500,
        easing: Easing.inOut(Easing.ease),
      }),
    };
  });

  opacity.value = 1;

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <ImageBackground
        source={require("@/assets/images/rockt_profile.jpeg")} // Replace with your background image
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
        <View style={styles.iconContainer}>
          <Image
            source={require("@/assets/images/rocky_gym_logo.png")} // Replace with your icon image
            style={styles.icon}
          />
        </View>
        <TextInput
          style={styles.input}
          placeholder="البريد الالكتروني"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="black"
        />
        <TextInput
          style={styles.input}
          placeholder="كلمة المرور"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="black"
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>تسجيل الدخول</Text>
        </TouchableOpacity>
        <Link href="/signup">
          <Text style={styles.link}>ليس لديك حساب؟ إنشاء حساب </Text>
        </Link>
      </ImageBackground>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 150,
    height: 150,
  },
  input: {
    width: "80%",
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "white",
    color: "black",
    textAlign: "right",
  },
  button: {
    width: "80%",
    padding: 16,
    backgroundColor: Colors["dark"].tint,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 8,
    marginBottom: 21,
  },
  buttonText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },
  link: {
    marginTop: 21,
    color: "white",
    textDecorationLine: "underline",
  },
});
