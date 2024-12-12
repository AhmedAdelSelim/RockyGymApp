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
import { AntDesign, FontAwesome, MaterialIcons } from "@expo/vector-icons";

const AboutScreen = () => {
  const owners = [
    {
      id: "1",
      name: "كابتن محمد",
      contact: "+201020952678",
      facebook: "https://www.facebook.com/share/1JZNAfaT7X/?mibextid=LQQJ4d",
      tiktok: "https://www.tiktok.com/@cap_rocky1?_t=8s1wMIFMSwC&_r=1",
      instagram:
        "https://www.instagram.com/muhammad_nage7/profilecard/?igsh=eXQ3eGNtOWYxaTcz",
    },
    {
      id: "2",
      name: "كابتن أحمد ",
      contact: "+201024155999",
      facebook: "https://www.facebook.com/share/18FfjK7kNx/?mibextid=LQQJ4d",
      tiktok: "https://www.tiktok.com/@cap_rocky1?_t=8s1wMIFMSwC&_r=1",
      instagram:
        "https://www.instagram.com/cap.ahmed.nageh?igsh=cXppc2gxZG8zcnQz",
    },
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
            دمياط - الزرقا - ميت الخولي عبد الله - نادي ميت الخولي الرياضي{" "}
          </ThemedText>
          <View style={styles.socialMedia}>
            <TouchableOpacity
              onPress={() =>
                Linking.openURL(
                  "https://www.instagram.com/rockygym123/profilecard/?igsh=Zmo4bXFmZTFxNG1j"
                )
              }
            >
              <FontAwesome
                name="instagram"
                size={50}
                color="#e1306c"
                style={{ marginLeft: 90 }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                Linking.openURL(
                  "https://www.facebook.com/Rockygym123?mibextid=LQQJ4d&mibextid=LQQJ4d"
                )
              }
            >
              <AntDesign
                name="facebook-square"
                size={50}
                color="#000"
                style={{ marginRight: 100 }}
              />
            </TouchableOpacity>
          </View>

          {owners.map((owner) => (
            <View key={owner.id} style={styles.ownerInfo}>
              <View style={styles.ownerCard}>
                <TouchableOpacity
                  onPress={() => handleWhatsApp(owner.contact)}
                  style={styles.whatsappButton}
                >
                  <ThemedText style={styles.buttonText}>
                    {owner.name}
                  </ThemedText>
                </TouchableOpacity>
                <View style={styles.socialMedia}>
                  <TouchableOpacity
                    onPress={() => Linking.openURL(owner.facebook)}
                  >
                    <AntDesign
                      name="facebook-square"
                      size={50}
                      color="#3b5998"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => Linking.openURL(owner.tiktok)}
                  >
                    <MaterialIcons
                      name="tiktok"
                      size={50}
                      color="black"
                      style={{ marginHorizontal: 30 }}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => Linking.openURL(owner.instagram)}
                  >
                    <FontAwesome name="instagram" size={50} color="#e1306c" />
                  </TouchableOpacity>
                </View>
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
  socialMedia: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
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
    fontSize: 21,
    lineHeight: 26,
    marginBottom: 15,
    textAlign: "center",
    color: "#37474f", // Darker text color for contrast
    fontWeight: "bold",
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
