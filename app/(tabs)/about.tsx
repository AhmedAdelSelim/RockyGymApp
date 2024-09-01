// AboutScreen.js
import React from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient"; // For gradient backgrounds
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";

const AboutScreen = () => {
  const owners = [
    { id: "1", name: "كابتن روكي", contact: "+201020952678" },
    { id: "2", name: "كابتن أحمد ", contact: "+201020952678" },
  ];

  const handleWhatsApp = (contactNumber: string) => {
    const whatsappUrl = `whatsapp://send?phone=${contactNumber}`;
    Linking.openURL(whatsappUrl)
      .then(() => console.log(`WhatsApp opened for ${contactNumber}`))
      .catch((err) => console.error("Error opening WhatsApp:", err));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Image
            source={require("@/assets/images/rocky_gym_logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <ThemedText style={styles.title}>Rocky Gym</ThemedText>
        </View>

        <LinearGradient
          colors={[Colors.dark.tint, "#25D366"]}
          style={styles.content}
        >
          <ThemedText style={styles.text}>
            ميت الخولي / نادي ميت الخولي الزرقا دمياط
          </ThemedText>

          {owners.map((owner) => (
            <View key={owner.id} style={styles.ownerInfo}>
              <View style={styles.ownerCard}>
                <ThemedText style={styles.ownerName}>{owner.name}</ThemedText>
                <TouchableOpacity
                  onPress={() => handleWhatsApp(owner.contact)}
                  style={styles.whatsappButton}
                >
                  <ThemedText style={styles.buttonText}>
                    {owner.name}
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000", // Light background color for the entire screen
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
    borderRadius: 60, // Rounded logo
    borderColor: Colors.light.tint,
    borderWidth: 2,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    color: Colors.dark.tint, // Dark teal color
    marginTop: 7,
    padding: 3,
  },
  content: {
    width: "100%",
    padding: 20,
    borderRadius: 15,
    elevation: 5, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  text: {
    fontSize: 18,
    lineHeight: 26,
    marginBottom: 15,
    textAlign: "center",
    color: "#37474f", // Darker text color for contrast
  },
  ownerInfo: {
    marginTop: 20,
    alignItems: "center",
  },
  ownerCard: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 12,
    width: "90%",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  ownerName: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#00796b",
  },
  whatsappButton: {
    backgroundColor: "#25D366",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#25D366",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AboutScreen;
