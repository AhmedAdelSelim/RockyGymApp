// components/SplashScreen.js
import React, { useEffect } from "react";
import {
  Image,
  StyleSheet,
  ActivityIndicator,
  useColorScheme,
} from "react-native";
import { useRouter } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { DarkTheme, DefaultTheme } from "@react-navigation/native";

const SplashScreen = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();

  useEffect(() => {
    setTimeout(() => {
      router.replace("/auth");
    }, 3000); // 3 seconds delay
  }, [router]);

  return (
    <ThemedView
      style={[
        styles.container,
        {
          backgroundColor:
            colorScheme === "dark"
              ? DarkTheme.colors.background
              : DefaultTheme.colors.background,
        },
      ]}
    >
      <Image
        source={require("@/assets/images/rocky_gym_logo.png")}
        style={styles.icon}
        resizeMode="contain"
      />
      <ActivityIndicator
        size="small"
        color={
          colorScheme === "dark"
            ? DarkTheme.colors.text
            : DefaultTheme.colors.text
        }
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 250,
    height: 250,
    marginBottom: 23,
  },
  text: {
    marginTop: 20,
    fontSize: 18,
    color: "#0000ff",
  },
});

export default SplashScreen;
