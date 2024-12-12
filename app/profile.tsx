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
  const [subscriptionPlan, setSubscriptionPlan] = useState<string | null>(null); // State for subscription plan

  useEffect(() => {
    fetchUserData();
    fetchUserSubscription(); // Fetch user subscription on component mount
  }, []);

  const fetchUserData = async () => {
    try {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchUserSubscription = async () => {
    try {
      const currentUser = await supabase.auth.user(); // Get the current user
      if (currentUser) {
        const { data, error } = await supabase
          .from("users_subscription")
          .select("plan")
          .eq("user_email", currentUser.email) // Assuming user_id is the foreign key
          .single(); // Fetch a single record

        if (error) throw error;

        if (data && data.plan) {
          setSubscriptionPlan(data.plan); // Set the subscription plan if it exists
        }
      }
    } catch (error: any) {
      console.error("Error fetching user subscription:", error.message);
    }
  };

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
            {subscriptionPlan && ( // Conditionally render the subscription plan
              <View style={styles.subscriptionContainer}>
                <Text style={styles.subscriptionText}>
                  Current Subscription Plan: {subscriptionPlan}
                </Text>
              </View>
            )}
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
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flexGrow: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: "rgba(242, 242, 242, 0.2)",
  },
  profileSection: {
    alignItems: "center",
    marginVertical: 20,
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
  subscriptionContainer: {
    padding: 10,
    backgroundColor: "#4CAF50", // Green background for subscription info
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  subscriptionText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
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
});

export default ProfileScreen;
